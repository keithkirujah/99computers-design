import { createSession, setSessionCookie, clearSessionCookie, verifySession, setSecurityHeaders, sameOrigin, configuredUsers, compareCredential, sessionSecretConfigured, sessionMaxAge } from './_lib/auth.js';

// Best-effort per-instance throttling. Use Vercel Firewall for durable edge rate limiting.
const attempts = new Map();
function clientKey(req) { return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim(); }
function blocked(key) {
  const now = Date.now();
  const old = attempts.get(key) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (old.reset <= now) { old.count = 0; old.reset = now + 15 * 60 * 1000; }
  return old.count >= 10;
}
function recordFailure(key) {
  const now = Date.now();
  const old = attempts.get(key) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (old.reset <= now) { old.count = 0; old.reset = now + 15 * 60 * 1000; }
  old.count += 1; attempts.set(key, old);
  if (attempts.size > 2000) for (const [k, v] of attempts) if (v.reset <= now) attempts.delete(k);
}

export default async function handler(req, res) {
  setSecurityHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    const session = verifySession(req);
    if (!session) return res.status(200).json({ authenticated: false });
    return res.status(200).json({ authenticated: true, user: session.user, role: session.role, expiresIn: sessionMaxAge() });
  }

  if (!['POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Request origin rejected.' });

  if (req.method === 'DELETE') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (!sessionSecretConfigured()) return res.status(503).json({ error: 'Admin authentication is not configured. Set SESSION_SECRET in the deployment environment.' });
  const key = clientKey(req);
  if (blocked(key)) return res.status(429).json({ error: 'Too many sign-in attempts. Wait 15 minutes or contact the administrator.' });
  const body = req.body || {};
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!username || !password || username.length > 120 || password.length > 1024) return res.status(400).json({ error: 'Enter your username and password.' });

  const users = configuredUsers();
  if (!users.length) return res.status(503).json({ error: 'No admin accounts are configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel.' });
  if (users.some(x => x.pass.length < 12)) return res.status(503).json({ error: 'Configured account passwords must be at least 12 characters. Update the Vercel environment variables and redeploy.' });
  const match = users.find(x => compareCredential(username, x.user) && compareCredential(password, x.pass));
  if (!match) {
    // Best-effort delay makes repeated guessing less convenient; configure platform-level rate limiting for stronger protection.
    recordFailure(key);
    await new Promise(resolve => setTimeout(resolve, 350));
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  attempts.delete(key);
  const token = createSession(match.user, match.role);
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true, authenticated: true, user: match.user, role: match.role, expiresIn: sessionMaxAge() });
}
