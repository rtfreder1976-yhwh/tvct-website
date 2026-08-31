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

/**
 * Which form posted. Both share this endpoint on purpose: the three production
 * traps documented in docs/quote-capture-flow.md (no /api/ prefix, no n8n
 * ignoreBots, GHL email-only matching) were expensive to find, and a second
 * endpoint would have to rediscover all of them.
 *
 * They are NOT the same lead. A quote request is a buying signal and gets the
 * full treatment downstream (Quotes opportunity + Todd alert). A hiring-sheet
 * download is top-of-funnel interest — n8n branches on `formType` so it only
 * tags the contact and emails the sheet. Keep that distinction: putting
 * downloaders into the Quotes pipeline would muddy the funnel the same way
 * BookingKoala's pipeline would.
 */
const FORM_TYPES = ["quote", "hiring-sheet"] as const;
type FormType = (typeof FORM_TYPES)[number];

interface RequestQuoteBody {
  name: string;
  phone: string;
  email: string;
  serviceType: (typeof SERVICE_TYPES)[number];
  city: string;
  sqft?: string;
  message?: string;
  preferredContact?: (typeof CONTACT_METHODS)[number];
  formType?: FormType;
  company?: string; // hiring-sheet only
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

  // Defaults to "quote" so existing callers (and anything replaying an old
  // payload) keep the behaviour they had before this field existed.
  const formType: FormType = body.formType ?? "quote";
  if (body.formType && !FORM_TYPES.includes(body.formType)) {
    return new Response(JSON.stringify({ error: "invalid form type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const isHiringSheet = formType === "hiring-sheet";

  // Name and email are required by both forms. Everything else is
  // quote-specific: asking a reader for their square footage before handing
  // over a checklist would cost more downloads than the data is worth.
  const errors: string[] = [];
  if (!isNonEmptyString(body.name)) errors.push("name is required");
  if (!isNonEmptyString(body.email) || !isPlausibleEmail(body.email!))
    errors.push("a valid email is required");

  if (isHiringSheet) {
    // Optional here, but still validated when present — a bad phone should
    // never reach GHL just because the form that sent it was the light one.
    if (isNonEmptyString(body.phone) && !isPlausiblePhone(body.phone!))
      errors.push("a valid phone number is required");
  } else {
    if (!isNonEmptyString(body.phone) || !isPlausiblePhone(body.phone!))
      errors.push("a valid phone number is required");
    if (!body.serviceType || !SERVICE_TYPES.includes(body.serviceType))
      errors.push("a valid service type is required");
    if (!isNonEmptyString(body.city)) errors.push("city is required");
    if (
      body.preferredContact &&
      !CONTACT_METHODS.includes(body.preferredContact)
    )
      errors.push("invalid preferred contact method");
  }

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

  // Shared secret proving this request came from the site. The n8n webhook is
  // otherwise open to anyone who learns its URL — `ignoreBots` had to be turned
  // off because it 403'd Vercel (trap 2 in docs/quote-capture-flow.md), which
  // left the door unlocked.
  //
  // Sending it is harmless while n8n is not yet checking, so the site side can
  // ship first. Turn on Header Auth in n8n only AFTER this is deployed with the
  // value set, or every lead 403s — the same silent failure as trap 2, where
  // the form looks healthy while dropping 100% of real traffic.
  // `import.meta.env` is inlined at BUILD time by Vite. A Vercel "Redeploy"
  // that reuses the build cache can therefore ship without a newly-added
  // variable baked in. Fall back to process.env, which is read at RUNTIME, so
  // the value is picked up either way.
  const webhookSecret =
    import.meta.env.N8N_QUOTE_WEBHOOK_SECRET ??
    process.env.N8N_QUOTE_WEBHOOK_SECRET;

  // Everything the lead said, in one object. Logged verbatim on any delivery
  // failure so a lost lead can be reconstructed and contacted by hand — the
  // whole reason this endpoint still answers 200 when delivery breaks.
  const payload = {
    name: body.name,
    phone: body.phone ?? "",
    email: body.email,
    // A hiring-sheet download has no service or city. Sending "commercial"
    // keeps the n8n serviceLabel lookup and the GHL tag meaningful without
    // implying the reader asked us to quote commercial work.
    serviceType: isHiringSheet ? "commercial" : body.serviceType,
    city: isHiringSheet ? (body.company ?? "") : body.city,
    sqft: body.sqft ?? "",
    message: body.message ?? "",
    preferredContact: body.preferredContact ?? "either",
    // n8n branches on formType; source is what shows on the GHL contact.
    formType,
    source: isHiringSheet ? "commercial-hiring-sheet" : "request-a-quote",
    submittedAt: new Date().toISOString(),
  };

  if (!webhookSecret) {
    // Not fatal — n8n may not require the header yet — but it means the
    // request is going out unauthenticated, which is worth seeing.
    console.warn(
      "[quote-submit] N8N_QUOTE_WEBHOOK_SECRET is not set; sending unauthenticated",
    );
  }

  if (!webhookUrl) {
    // Never fail the visitor because delivery is misconfigured. Log loudly so
    // the submission can be recovered from logs, and still confirm to them —
    // they have no way to act on our plumbing problem.
    console.error(
      "[quote-submit] LEAD NOT DELIVERED — N8N_QUOTE_WEBHOOK_URL is not set",
      payload,
    );
    // `delivered: true` even though nothing reached n8n. A real person really
    // did submit, so it is a real conversion and belongs in analytics; the
    // lead is recoverable from the log line above. Reporting it as a
    // non-conversion would hide a human's intent behind our own outage.
    return new Response(JSON.stringify({ ok: true, delivered: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // One retry: a single transient blip (cold start, brief n8n restart) should
  // not cost a lead. Anything past two failures is an outage, not a blip, and
  // the payload lands in the log for manual recovery.
  let delivered = false;
  let lastFailure = "";

  for (let attempt = 1; attempt <= 2 && !delivered; attempt++) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Omitted entirely when unset so the header is never sent empty —
          // an empty value would satisfy a misconfigured check.
          ...(webhookSecret ? { "X-TVCT-Webhook-Secret": webhookSecret } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        delivered = true;
      } else {
        lastFailure = `n8n returned ${res.status}`;
        console.error("[quote-submit] n8n rejected the submission", {
          attempt,
          status: res.status,
          // 401/403 almost always means the shared secret drifted apart
          // between Vercel and the n8n webhook credential. Call it out by
          // name: the generic message sent us hunting the wrong thing once
          // already (trap 2).
          ...(res.status === 401 || res.status === 403
            ? {
                likelyCause:
                  "N8N_QUOTE_WEBHOOK_SECRET does not match the n8n webhook's Header Auth credential",
              }
            : {}),
        });
      }
    } catch (err) {
      lastFailure = err instanceof Error ? err.message : String(err);
      console.error("[quote-submit] n8n delivery failed", {
        attempt,
        error: lastFailure,
      });
    }
  }

  if (!delivered) {
    // Last line of defence: the complete lead, greppable by this exact prefix.
    console.error("[quote-submit] LEAD NOT DELIVERED — recover by hand", {
      reason: lastFailure,
      ...payload,
    });
  }

  // `delivered: true` is what separates a real submission from a honeypot
  // rejection, which deliberately returns an identical 200 + {ok:true} so a bot
  // learns nothing. The client fires its conversion events on this field, not
  // on res.ok — otherwise every trapped bot would count as a lead.
  return new Response(JSON.stringify({ ok: true, delivered: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
