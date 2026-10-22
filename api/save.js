/* Authenticated GitHub commit proxy. The GitHub token stays server-side. */
import { verifySession, setSecurityHeaders, sameOrigin } from './_lib/auth.js';

const OWNER = 'keithkirujah';
const REPO = '99computers';
const BRANCH = 'main';
const MAX_TEXT_BYTES = 1_500_000;
const MAX_IMAGE_BYTES = 3_000_000;

function json(res, status, body) { return res.status(status).json(body); }
function encodePath(path) { return path.split('/').map(encodeURIComponent).join('/'); }

async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const [filePath, query = ''] = path.split('?');
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodePath(filePath)}${query ? `?${query}` : ''}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

async function commitFile(path, content, message, binary = false) {
  const getRes = await githubRequest(`${path}?ref=${encodeURIComponent(BRANCH)}`);
  let sha = null;
  if (getRes.ok) sha = (await getRes.json()).sha;
  else if (getRes.status !== 404) {
    const err = await getRes.json().catch(() => ({}));
    throw new Error(err.message || 'Could not read file from GitHub');
  }
  const base64 = binary ? content : Buffer.from(content, 'utf8').toString('base64');
  const body = { message: message.slice(0, 140), content: base64, branch: BRANCH };
  if (sha) body.sha = sha;
  const putRes = await githubRequest(path, { method: 'PUT', body: JSON.stringify(body) });
  const out = await putRes.json().catch(() => ({}));
  if (!putRes.ok) throw new Error(out.message || 'GitHub rejected the commit');
  return out.content?.sha || null;
}

async function appendActivity(role, user, action) {
  const path = 'data/log.json';
  const read = await githubRequest(`${path}?ref=${encodeURIComponent(BRANCH)}`);
  let logs = [];
  let sha = null;
  if (read.ok) {
    const file = await read.json();
    sha = file.sha;
    try { logs = JSON.parse(Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8')); } catch { logs = []; }
  } else if (read.status !== 404) return;
  if (!Array.isArray(logs)) logs = [];
  logs.unshift({ time: new Date().toISOString(), user: role, username: user, action: String(action).slice(0, 200) });
  logs = logs.slice(0, 100);
  const body = { message: `Activity log: ${String(action).slice(0, 100)}`, content: Buffer.from(JSON.stringify(logs, null, 2)).toString('base64'), branch: BRANCH };
  if (sha) body.sha = sha;
  const write = await githubRequest(path, { method: 'PUT', body: JSON.stringify(body) });
  if (!write.ok) console.error('Activity log commit failed:', write.status);
}

export default async function handler(req, res) {
  setSecurityHeaders(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }
  if (!sameOrigin(req)) return json(res, 403, { error: 'Request origin rejected.' });
  const session = verifySession(req);
  if (!session) return json(res, 401, { error: 'Your session has expired. Please sign in again.' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json(res, 503, { error: 'Publishing is not configured. Add GITHUB_TOKEN in Vercel and redeploy.' });

  const body = req.body || {};
  const path = typeof body.path === 'string' ? body.path : '';
  const content = body.content;
  const binary = body.binary === true;
  const message = typeof body.message === 'string' && body.message.trim() ? body.message.trim() : 'Update from 99 Computers staff console';

  // Explicit allowlist: never accept arbitrary repository paths from the browser.
  const isCatalog = path === 'catalog.json';
  const isImage = /^images\/shop\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$/i.test(path);
  if (!isCatalog && !isImage) return json(res, 403, { error: 'This file path is not permitted.' });
  if (isImage !== binary) return json(res, 400, { error: 'File content type does not match the permitted path.' });
  if (typeof content !== 'string' || !content.length) return json(res, 400, { error: 'Missing file content.' });
  if (content.length > (binary ? MAX_IMAGE_BYTES * 1.4 : MAX_TEXT_BYTES)) return json(res, 413, { error: 'File is too large.' });

  if (isCatalog) {
    let catalog;
    try { catalog = JSON.parse(content); } catch { return json(res, 400, { error: 'Catalog must be valid JSON.' }); }
    if (!catalog || !Array.isArray(catalog.products) || !Array.isArray(catalog.categories)) return json(res, 400, { error: 'Catalog must include products and categories arrays.' });
    if (catalog.products.length > 5000 || catalog.categories.length > 100) return json(res, 400, { error: 'Catalog exceeds allowed limits.' });
    const ids = new Set();
    for (const p of catalog.products) {
      if (!p || typeof p.id !== 'string' || !p.id || ids.has(p.id) || typeof p.name !== 'string' || p.name.length > 240 || !Number.isFinite(Number(p.price)) || Number(p.price) < 0) {
        return json(res, 400, { error: 'Catalog contains an invalid or duplicate product record.' });
      }
      ids.add(p.id);
    }
    // Non-admin accounts may perform ordinary catalogue edits, but cannot replace/restore the whole inventory in one request.
    if (session.role !== 'admin') {
      try {
        const existingRes = await githubRequest(`catalog.json?ref=${encodeURIComponent(BRANCH)}`);
        if (existingRes.ok) {
          const existingFile = await existingRes.json();
          const existing = JSON.parse(Buffer.from(existingFile.content.replace(/\n/g, ''), 'base64').toString('utf8'));
          const oldProducts = new Map((existing.products || []).map(p => [p.id, JSON.stringify(p)]));
          const newProducts = new Map(catalog.products.map(p => [p.id, JSON.stringify(p)]));
          let changed = 0;
          for (const [id, value] of oldProducts) if (!newProducts.has(id) || newProducts.get(id) !== value) changed++;
          for (const id of newProducts.keys()) if (!oldProducts.has(id)) changed++;
          const catsChanged = JSON.stringify(existing.categories || []) !== JSON.stringify(catalog.categories || []);
          if (changed > 10 || (changed > 3 && catsChanged)) return json(res, 403, { error: 'Bulk catalogue replacement is restricted to the administrator. Make smaller edits or ask the administrator to restore a backup.' });
        }
      } catch (e) {
        console.error('Could not compare current catalogue:', e.message);
        return json(res, 503, { error: 'Could not verify the current catalogue before saving. Please retry.' });
      }
    }
  } else {
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(content) || content.length % 4 !== 0) return json(res, 400, { error: 'Invalid image encoding.' });
    const imageBytes = Buffer.from(content, 'base64');
    if (imageBytes.length > MAX_IMAGE_BYTES) return json(res, 413, { error: 'Image is too large.' });
    const jpeg = imageBytes.length >= 3 && imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
    const png = imageBytes.length >= 8 && imageBytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const webp = imageBytes.length >= 12 && imageBytes.toString('ascii', 0, 4) === 'RIFF' && imageBytes.toString('ascii', 8, 12) === 'WEBP';
    if (!jpeg && !png && !webp) return json(res, 400, { error: 'Uploaded file is not a supported image.' });
  }

  try {
    const sha = await commitFile(path, content, message, binary);
    if (isCatalog) await appendActivity(session.role, session.user, message);
    return json(res, 200, { ok: true, sha, user: session.user, role: session.role });
  } catch (error) {
    console.error('Publish failed:', error.message);
    return json(res, 502, { error: 'Could not publish the change. Check GitHub token permissions and repository configuration.' });
  }
}
