import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminPasswordValid,
  SESSION_LIFETIME_SECONDS,
} from '@/lib/admin-auth';
import { getClientIp, isRateLimited, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MESSAGE = 'Too many attempts, try again later.';

function jsonResponse(payload, options = {}) {
  const response = NextResponse.json(payload, options);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

function tooManyAttemptsResponse(retryAfter) {
  return jsonResponse({ error: RATE_LIMIT_MESSAGE }, {
    status: 429,
    headers: { 'Retry-After': String(retryAfter) },
  });
}

export async function POST(request) {
  const rateLimitKey = `admin-login:${getClientIp(request)}`;

  if (!process.env.ADMIN_PASSWORD) {
    return jsonResponse({ error: 'Admin access is not configured.' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request.' }, { status: 400 });
  }

  const lockout = isRateLimited(rateLimitKey, MAX_FAILED_ATTEMPTS);
  if (lockout.limited) return tooManyAttemptsResponse(lockout.retryAfter);

  if (!isAdminPasswordValid(body?.password)) {
    const failureLimit = rateLimit(rateLimitKey, MAX_FAILED_ATTEMPTS, RATE_LIMIT_WINDOW_MS);
    if (failureLimit.limited) return tooManyAttemptsResponse(failureLimit.retryAfter);
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_LIFETIME_SECONDS,
  });
  return response;
}