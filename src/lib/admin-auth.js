import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'veeluxe-admin-session';
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;

export function isAdminPasswordValid(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== 'string' || candidate.length > 1024) return false;
  const candidateHash = createHash('sha256').update(candidate).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(candidateHash, expectedHash);
}

export function createAdminSession() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured.');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS;
  const signature = createHmac('sha256', secret).update(String(expiresAt)).digest('base64url');
  return `${expiresAt}.${signature}`;
}

export function isAdminSessionValid(value) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || typeof value !== 'string') return false;
  const [expiresAtText, signature] = value.split('.');
  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;

  const expected = createHmac('sha256', secret).update(expiresAtText).digest();
  let actual;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export { SESSION_LIFETIME_SECONDS };