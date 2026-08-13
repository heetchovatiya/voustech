// In-memory rate limiting store for brute-force protection
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Enforces rate limiting on key endpoints (e.g. login & 2FA OTP verification).
 * @param key Unique key to track (e.g., client IP or username)
 * @param maxAttempts Maximum allowed attempts within window
 * @param windowMs Window duration in milliseconds (e.g., 15 mins = 900,000 ms)
 * @returns { success: boolean, remaining: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || now > record.resetTime) {
    tracker.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: maxAttempts - record.count };
}
