type Bucket = { attempts: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(key: string, now = Date.now()) {
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  current.attempts += 1;
  return current.attempts <= MAX_ATTEMPTS
    ? { allowed: true, retryAfterSeconds: 0 }
    : { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
}

export function resetLoginRateLimit(key: string) { buckets.delete(key); }
