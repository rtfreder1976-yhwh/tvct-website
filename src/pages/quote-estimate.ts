import type { APIRoute } from "astro";
import { priceRange, startingPrice } from "../data/pricing";
import { PERFORMANCE } from "../data/claims";

/**
 * Deterministic quote lookup for the SMS follow-up bot.
 *
 * Non-negotiable #1 of the quote-flow design: the AI NEVER generates the dollar
 * number. It calls this, and this reads the same rate card the website renders
 * — the one guarded at build time against drifting from claims.ts. The model
 * only writes the words around the number this returns.
 *
 * Non-negotiable #2: returns a RANGE, never a hard point-quote. A 2,000 sq ft
 * home not cleaned in a year is not the same job as one cleaned last month, but
 * the bracket says both. The range preserves the "from $X" hedge the site uses.
 *
 * Non-negotiable #4: commercial is never quoted here. It needs $/sqft x
 * frequency x scope and usually a walkthrough, so it returns a hard handoff.
 *
 * Not under /api/ — see the note in quote-submit.ts.
 */
export const prerender = false;

const SERVICE_MAP: Record<string, string> = {
  regular: "regular",
  deep: "deep",
  moveInOut: "moveinout",
  moveinout: "moveinout",
  postConstruction: "postconstruction",
  postconstruction: "postconstruction",
  // Airbnb turnover is priced per-property in practice, not off the sq-ft
  // curve, so it routes to a human rather than guessing off `regular`.
};

const HUMAN_ONLY = new Set(["commercial", "airbnbTurnover", "airbnbturnover"]);

export const POST: APIRoute = async ({ request }) => {
  let body: { serviceType?: string; sqft?: number | string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const serviceType = String(body.serviceType ?? "");

  if (HUMAN_ONLY.has(serviceType)) {
    return new Response(
      JSON.stringify({
        quotable: false,
        reason: "human_only",
        message:
          "This one needs a person — scope and frequency drive the price, not square footage alone.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  const service = SERVICE_MAP[serviceType];
  if (!service) {
    return new Response(
      JSON.stringify({ error: `Unknown serviceType "${serviceType}"` }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const sqftRaw = Number(body.sqft);
  const sqft = Number.isFinite(sqftRaw) ? Math.floor(sqftRaw) : 0;

  // Without a size there is no bracket, so the only honest answer is the
  // published "from" price — never a made-up midpoint.
  if (sqft <= 0) {
    const from = startingPrice(service);
    return new Response(
      JSON.stringify({
        quotable: false,
        reason: "need_sqft",
        startingPrice: from,
        startingPriceDisplay: `$${from}`,
        message: `Starts at $${from}. Square footage sets the exact range.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  const { low, high } = priceRange(service, sqft);

  return new Response(
    JSON.stringify({
      quotable: true,
      service,
      sqft,
      low,
      high,
      rangeDisplay: `$${low} - $${high}`,
      // Handed to the model verbatim so it never has to reformat a number.
      quoteSentence: `For about ${sqft.toLocaleString()} sq ft, that runs $${low} - $${high}.`,
      slaDisplay: PERFORMANCE.quoteResponseSla,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
