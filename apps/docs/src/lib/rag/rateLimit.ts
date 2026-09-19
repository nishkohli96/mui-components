/**
 * Fixed-window rate limit, per IP, in-memory.
 *
 * In-memory means this resets on every redeploy/cold start and isn't shared
 * across serverless instances.
 *
 * It still stops a single client hammering the paid OpenAI/Pinecone
 * calls behind this route, which is the actual goal here.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestLog = new Map<string, number[]>();

/**
 * A one-off IP is only ever pruned when it requests again — with no
 * traffic from it, its entry sits in `requestLog` forever. Sweeping the
 * whole map (bounded to once per window) drops entries with no timestamps
 * left in the window, so distinct one-off IPs don't accumulate unbounded.
 */
let lastSweep = Date.now();

function sweepExpired(now: number): void {
  const windowStart = now - WINDOW_MS;
  for (const [ip, timestamps] of requestLog) {
    if (!timestamps.some(t => t > windowStart)) {
      requestLog.delete(ip);
    }
  }
  lastSweep = now;
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (now - lastSweep > WINDOW_MS) {
    sweepExpired(now);
  }

  const timestamps = (requestLog.get(ip) ?? []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((timestamps[0]! + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return { allowed: true };
}

/** Best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
