import crypto from 'node:crypto';

const COOKIE_NAME = 'n99_session';
const SESSION_SECONDS = 8 * 60 * 60;

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''), 'utf8');
  const bb = Buffer.from(String(b || ''), 'utf8');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function secret() {
  const value = process.env.SESSION_SECRET || '';
  if (value.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters.');
  return value;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const item of raw.split(';')) {
    const i = item.indexOf('=');
    if (i < 0) continue;
    if (item.slice(0, i).trim() === name) return decodeURIComponent(item.slice(i + 1).trim());
  }
  return '';
}

export function createSession(user, role) {
  const payload = Buffer.from(JSON.stringify({ user, role, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySession(req) {
  try {
    const token = getCookie(req, COOKIE_NAME);
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    if (!safeEqual(signature, sign(payload))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.user || !['admin', 'site', 'staff'].includes(data.role) || !Number.isFinite(data.exp) || data.exp <= Date.now() / 1000) return null;
    return { user: String(data.user).slice(0, 80), role: data.role, exp: data.exp };
  } catch { return null; }
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return req.headers['sec-fetch-site'] !== 'cross-site';
  try {
    const parsed = new URL(origin);
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
    return parsed.host.toLowerCase() === host && parsed.protocol === 'https:';
  } catch { return false; }
}

export function configuredUsers() {
  const defs = [
    ['admin', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'],
    ['site', 'SITE_USERNAME', 'SITE_PASSWORD'],
    ['staff', 'STAFF_USERNAME', 'STAFF_PASSWORD']
  ];
  return defs.map(([role, userKey, passKey]) => ({ role, user: process.env[userKey] || '', pass: process.env[passKey] || '' }))
    .filter(x => x.user && x.pass);
}

export function cookieName() { return COOKIE_NAME; }
export function sessionMaxAge() { return SESSION_SECONDS; }
export function compareCredential(a, b) { return safeEqual(a, b); }
export function sessionSecretConfigured() { try { secret(); return true; } catch { return false; } }
