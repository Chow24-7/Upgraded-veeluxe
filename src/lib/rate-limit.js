const requestsByKey = new Map();

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  if (requestsByKey.size > 1000) {
    for (const [storedKey, entry] of requestsByKey) {
      if (entry.resetAt <= now) requestsByKey.delete(storedKey);
    }
  }
  const current = requestsByKey.get(key);

  if (!current || current.resetAt <= now) {
    requestsByKey.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count <= limit) return { limited: false, retryAfter: 0 };
  return { limited: true, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export function getClientIp(request) {
  const realIp = request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  return (forwardedFor?.split(',')[0] || realIp || 'unknown').trim().slice(0, 100);
}