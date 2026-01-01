import type { VercelRequest, VercelResponse } from '@vercel/node';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const normalizeHeader = (value: string | string[] | undefined): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const getClientIp = (req: VercelRequest): string => {
  const forwarded = normalizeHeader(req.headers['x-forwarded-for']);
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return normalizeHeader(req.headers['x-real-ip']) || req.socket.remoteAddress || 'unknown';
};

const extractToken = (req: VercelRequest): string | undefined => {
  const authHeader = normalizeHeader(req.headers.authorization);
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return normalizeHeader(req.headers['x-analytics-token']);
};

const checkRateLimit = (req: VercelRequest): { ok: boolean; retryAfterSeconds?: number } => {
  const key = getClientIp(req);
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return { ok: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { ok: true };
};

export const requireAnalyticsAuth = (req: VercelRequest, res: VercelResponse): boolean => {
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.ok) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds ?? 60));
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }

  const expectedToken = process.env.ANALYTICS_API_TOKEN;
  const providedToken = extractToken(req);

  if (!expectedToken || !providedToken || providedToken !== expectedToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
};

export const applyAnalyticsCors = (res: VercelResponse): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-Analytics-Token, Content-Type');
};
