// Lightweight in-memory fixed-window rate limiter for the public API routes.
//
// This is per-serverless-instance (state resets on cold start), which is enough
// to deter casual abuse of the proxies (protecting the OpenRouter key and the
// settle signer). A production deployment would back this with a shared store
// such as Upstash/Redis for cross-instance limits.

type Window = { count: number; reset: number };

const buckets = new Map<string, Window>();

/** Returns true if the call is allowed, false if the limit is exceeded. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const w = buckets.get(key);
  if (!w || now > w.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (w.count >= limit) return false;
  w.count += 1;
  return true;
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "anon";
  return req.headers.get("x-real-ip") ?? "anon";
}
