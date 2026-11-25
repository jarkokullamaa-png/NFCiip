import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

// Server-side only. Uses the service role key, so it must never reach the browser.
export function db() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// 9 random bytes -> 12 URL-safe characters (72 bits): infeasible to guess.
export const newId = () => crypto.randomBytes(9).toString('base64url');
// 24 random bytes -> 32 URL-safe characters (192 bits).
export const newToken = () => crypto.randomBytes(24).toString('base64url');

export const ID_RE = /^[A-Za-z0-9_-]{12}$/;
export const TOKEN_RE = /^[A-Za-z0-9_-]{32}$/;

// Accepts things like "+372 5555 5555", "(555) 123-4567". Returns null if invalid.
export function cleanPhone(raw) {
  const s = String(raw || '').trim();
  if (!/^\+?[0-9 ()\-.]{6,30}$/.test(s)) return null;
  const digits = s.replace(/\D/g, '');
  if (digits.length < 6 || digits.length > 15) return null;
  return { display: s, tel: (s.startsWith('+') ? '+' : '') + digits };
}

export async function getOrigin(headers) {
  const h = await headers();
  const host = h.get('host') || 'localhost:3000';
  const proto =
    h.get('x-forwarded-proto') ||
    (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}
