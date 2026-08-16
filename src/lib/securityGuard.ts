/**
 * VousTech Shield — Multi-Tier Anti-DDoS Rate Limiting & IP Jail System
 */

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
  violations: number;
}

interface JailedIp {
  reason: string;
  expiresAt: number;
  threatCount: number;
}

// In-memory threat stores
const globalBuckets = new Map<string, RateLimitBucket>();
const apiBuckets = new Map<string, RateLimitBucket>();
const authBuckets = new Map<string, RateLimitBucket>();
const ipJail = new Map<string, JailedIp>();

// Cleanup stale buckets periodically (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of globalBuckets.entries()) {
      if (now - bucket.lastRefill > 5 * 60 * 1000) globalBuckets.delete(ip);
    }
    for (const [ip, bucket] of apiBuckets.entries()) {
      if (now - bucket.lastRefill > 5 * 60 * 1000) apiBuckets.delete(ip);
    }
    for (const [ip, jail] of ipJail.entries()) {
      if (now > jail.expiresAt) ipJail.delete(ip);
    }
  }, 10 * 60 * 1000);
}

/**
 * Checks if an IP is currently banned/jailed.
 */
export function isIpJailed(ip: string): { jailed: boolean; reason?: string; retryAfterSeconds?: number } {
  const jail = ipJail.get(ip);
  if (!jail) return { jailed: false };

  const now = Date.now();
  if (now > jail.expiresAt) {
    ipJail.delete(ip);
    return { jailed: false };
  }

  const retryAfterSeconds = Math.ceil((jail.expiresAt - now) / 1000);
  return { jailed: true, reason: jail.reason, retryAfterSeconds };
}

/**
 * Places an attacker IP into the security jail/blacklist.
 */
export function jailIp(ip: string, reason: string, durationMs = 60 * 60 * 1000): void {
  const existing = ipJail.get(ip);
  const threatCount = (existing?.threatCount ?? 0) + 1;
  // Exponential backoff for repeat offenders (up to 24 hours)
  const multiplier = Math.min(threatCount, 24);
  const expiresAt = Date.now() + durationMs * multiplier;

  ipJail.set(ip, {
    reason,
    expiresAt,
    threatCount,
  });

  console.warn(
    `🚨 [VousTech Shield WAF] JAILED IP: ${ip} | Reason: ${reason} | Duration: ${Math.round(
      (durationMs * multiplier) / 60000
    )} mins (Offense #${threatCount})`
  );
}

/**
 * Enforces Token-Bucket Sliding Window Anti-DDoS Rate Limiting.
 */
function checkBucket(
  store: Map<string, RateLimitBucket>,
  ip: string,
  capacity: number,
  refillRatePerSec: number
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  let bucket = store.get(ip);

  if (!bucket) {
    bucket = { tokens: capacity - 1, lastRefill: now, violations: 0 };
    store.set(ip, bucket);
    return { allowed: true, remaining: capacity - 1 };
  }

  // Refill tokens based on elapsed time
  const elapsedSec = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillRatePerSec);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, remaining: Math.floor(bucket.tokens) };
  }

  // Rate limit exceeded
  bucket.violations += 1;
  if (bucket.violations >= 10) {
    // Repeated DDoS burst offender -> jail IP for 30 minutes
    jailIp(ip, "Layer-7 HTTP Flood / Rate Limit Abuse", 30 * 60 * 1000);
  }

  const retryAfter = Math.ceil((1 - bucket.tokens) / refillRatePerSec);
  return { allowed: false, remaining: 0, retryAfter };
}

/**
 * Global Page Traffic Rate Limiter (Max 120 req/minute, burst up to 40)
 */
export function checkGlobalRateLimit(ip: string) {
  return checkBucket(globalBuckets, ip, 40, 2); // 2 tokens/sec = 120/min
}

/**
 * API Traffic Rate Limiter (Max 60 req/minute, burst up to 20)
 */
export function checkApiRateLimit(ip: string) {
  return checkBucket(apiBuckets, ip, 20, 1); // 1 token/sec = 60/min
}

/**
 * Sensitive Auth & Admin Rate Limiter (Max 5 attempts / 5 mins)
 */
export function checkAuthRateLimit(ip: string) {
  return checkBucket(authBuckets, ip, 5, 5 / 300);
}
