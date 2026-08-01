// ===========================================
// Rate Limiting Utility
// ===========================================
// In-memory rate limiter for login, booking, and contact forms.
// For production with multiple instances, consider Redis-based rate limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

interface RateLimitConfig {
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowSeconds: 300 },        // 5 attempts per 5 min
  booking: { maxRequests: 3, windowSeconds: 600 },       // 3 bookings per 10 min
  contact: { maxRequests: 5, windowSeconds: 600 },       // 5 messages per 10 min
  general: { maxRequests: 30, windowSeconds: 60 },       // 30 requests per min
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier and action type.
 * @param identifier - Unique identifier (e.g., IP address, email)
 * @param action - Action type (login, booking, contact, general)
 * @returns RateLimitResult
 */
export function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMIT_CONFIGS = "general"
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[action] || RATE_LIMIT_CONFIGS.general;
  const key = `${action}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry
    const resetAt = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}
