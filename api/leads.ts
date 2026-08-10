import type { ApiRequest, ApiResponse } from './_types.js';
import { requireAdmin, setPrivateApiHeaders } from './_admin-auth.js';

/**
 * Lead analytics used to read GoHighLevel contacts and infer quote/booking
 * activity from CRM records. BookingKoala is now the system of record for the
 * customer funnel, so serving GHL-derived metrics would be stale by design.
 *
 * Keep an authenticated tombstone response for the existing dashboard while
 * that UI is migrated; do not silently substitute fabricated or legacy data.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateApiHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  return res.status(410).json({
    success: false,
    source: 'retired',
    error: 'Legacy lead analytics retired',
    message:
      'GoHighLevel is no longer the source of truth for quote and booking activity. ' +
      'Use BookingKoala reporting for funnel metrics until a new dashboard adapter is implemented.',
  });
}
