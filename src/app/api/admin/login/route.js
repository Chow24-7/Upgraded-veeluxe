import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminPasswordValid,
  SESSION_LIFETIME_SECONDS,
} from '@/lib/admin-auth';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request) {
  const { limited, retryAfter } = rateLimit(`admin-login:${getClientIp(request)}`, 8, 15 * 60 * 1000);
  if (limited) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!isAdminPasswordValid(body?.password)) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_LIFETIME_SECONDS,
  });
  return response;
}