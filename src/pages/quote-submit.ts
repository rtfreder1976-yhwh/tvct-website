import type { APIRoute } from "astro";

/**
 * Deliberately NOT under /api/. As `src/pages/api/request-quote.ts` this route
 * 404'd in production while building correctly and working locally: Vercel's
 * routing layer answered it directly (the 404 carried the X-Robots-Tag from
 * vercel.json's `/api/(.*)` rule) and the function was never invoked — it never
 * appeared in runtime logs. A cache-free redeploy did not fix it. Other SSR
 * routes (/admin/login, /api-docs) were unaffected, so the collision was with
 * the /api/ path convention, not with SSR. Do not move this back under /api/.
 */
export const prerender = false;

const SERVICE_TYPES = [
  "regular",
  "deep",
  "moveInOut",
  "airbnbTurnover",
  "postConstruction",
  "commercial",
] as const;

const CONTACT_METHODS = ["text", "email", "either"] as const;

interface RequestQuoteBody {
  name: string;
  phone: string;
  email: string;
  serviceType: (typeof SERVICE_TYPES)[number];
  city: string;
  sqft?: string;
  message?: string;
  preferredContact?: (typeof CONTACT_METHODS)[number];
  website?: string; // honeypot
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

// Loose on purpose — catches obvious junk without rejecting real numbers
// (extensions, spaces, dashes, parens are all fine).
function isPlausiblePhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isPlausibleEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<RequestQuoteBody>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Honeypot: bots fill every field, real users never see this one.
  if (isNonEmptyString(body.website)) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const errors: string[] = [];
  if (!isNonEmptyString(body.name)) errors.push("name is required");
  if (!isNonEmptyString(body.phone) || !isPlausiblePhone(body.phone!))
    errors.push("a valid phone number is required");
  if (!isNonEmptyString(body.email) || !isPlausibleEmail(body.email!))
    errors.push("a valid email is required");
  if (!body.serviceType || !SERVICE_TYPES.includes(body.serviceType))
    errors.push("a valid service type is required");
  if (!isNonEmptyString(body.city)) errors.push("city is required");
  if (
    body.preferredContact &&
    !CONTACT_METHODS.includes(body.preferredContact)
  )
    errors.push("invalid preferred contact method");

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join("; ") }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Forwarded to n8n, which owns the GoHighLevel write and the prospect
  // auto-reply (CLAUDE.md §2, decision 2026-08-24). The site holds no GHL
  // credential — only the n8n webhook URL — so nothing here revives the
  // retired /api/submit-form GHL wiring.
  const webhookUrl = import.meta.env.N8N_QUOTE_WEBHOOK_URL;

  if (!webhookUrl) {
    // Never fail the visitor because delivery is misconfigured. Log loudly so
    // the submission can be recovered from logs, and still confirm to them —
    // they have no way to act on our plumbing problem.
    console.error(
      "[request-quote] N8N_QUOTE_WEBHOOK_URL is not set; submission not delivered",
      { name: body.name, phone: body.phone, email: body.email, city: body.city },
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        phone: body.phone,
        email: body.email,
        serviceType: body.serviceType,
        city: body.city,
        sqft: body.sqft ?? "",
        message: body.message ?? "",
        preferredContact: body.preferredContact ?? "either",
        source: "request-a-quote",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[request-quote] n8n webhook rejected the submission", {
        status: res.status,
        name: body.name,
        phone: body.phone,
        email: body.email,
      });
    }
  } catch (err) {
    // Same reasoning as above: a delivery failure is ours, not the visitor's.
    console.error("[request-quote] n8n webhook delivery failed", {
      error: err instanceof Error ? err.message : String(err),
      name: body.name,
      phone: body.phone,
      email: body.email,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
