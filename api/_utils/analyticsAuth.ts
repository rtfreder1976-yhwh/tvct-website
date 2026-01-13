import type { VercelRequest, VercelResponse } from '@vercel/node';

type RateLimitOptions = {
  windowMs?: number;
  maxRequests?: number;
};

const RATE_LIMIT_BUCKET = new Map<string, { count: number; resetAt: number }>();

const getClientKey = (req: VercelRequest): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0];
  }
  return req.socket.remoteAddress || 'unknown';
};

const extractToken = (req: VercelRequest): string | null => {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader === 'string') {
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token.trim();
    }
  }

  const customHeader = req.headers['x-analytics-token'];
  if (typeof customHeader === 'string') {
    return customHeader.trim();
  }
  return null;
};

export const enforceAnalyticsToken = (req: VercelRequest, res: VercelResponse): boolean => {
  const expectedToken = process.env.ANALYTICS_API_TOKEN;
  if (!expectedToken) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing ANALYTICS_API_TOKEN configuration'
    });
    return false;
  }

  const providedToken = extractToken(req);
  if (!providedToken || providedToken !== expectedToken) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid analytics token'
    });
    return false;
  }

  return true;
};

export const enforceRateLimit = (
  req: VercelRequest,
  res: VercelResponse,
  { windowMs = 60_000, maxRequests = 30 }: RateLimitOptions = {}
): boolean => {
  const key = getClientKey(req);
  const now = Date.now();
  const bucket = RATE_LIMIT_BUCKET.get(key);

  if (!bucket || now > bucket.resetAt) {
    RATE_LIMIT_BUCKET.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count += 1;

  if (bucket.count > maxRequests) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
    return false;
  }

  return true;
};
