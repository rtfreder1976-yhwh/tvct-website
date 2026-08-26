// Buyer-intent "5 jobs" content for the ProblemOptions component.
// Shared by the combo-page layout (city-interpolated) and the standalone
// service / industry pages (region-level framing). Keep honest and specific.

export interface IntentOption {
  label: string;
  detail: string;
  isUs?: boolean;
}
export interface ServiceIntent {
  problem: string;
  options: IntentOption[];
}

export const standaloneServiceIntent: Record<string, ServiceIntent> = {
  "deep-cleaning": {
    problem:
      "Your home needs more than a surface wipe-down — built-up grime on baseboards, appliances, grout, and the spots a routine clean never reaches. The real question is who actually cleans those, and what it honestly costs.",
    options: [
      { label: "A standard/recurring clean", detail: "Maintains a home that's already clean — it won't cut through months of build-up in the areas a deep clean targets." },
      { label: "A cheap one-time clean", detail: "Advertised low, but 'deep clean' can mean very different things. Ask exactly what's included first." },
      { label: "The Valley Clean Team", isUs: true, detail: "A detailed reset with an upfront quote, a written checklist, and an insured, background-checked team." },
    ],
  },
  "regular-cleaning": {
    problem:
      "You're tired of losing weekends to cleaning, but you've heard the horror stories — a different stranger every visit, no-shows, prices that creep up. You want consistency you can count on.",
    options: [
      { label: "Keep doing it yourself", detail: "No service bill, but it costs the weekend time and mental load you never get back." },
      { label: "A rotating gig-app cleaner", detail: "A new face each visit may never learn your home, and the company-level backup or coverage can vary." },
      { label: "The Valley Clean Team", isUs: true, detail: "A consistent, background-checked team, an upfront quote, and weekly, biweekly, or monthly options without a long-term contract." },
    ],
  },
  "maid-service": {
    problem:
      "You want a clean home without managing it. The biggest difference between providers is whether the work follows a written checklist and whether there is a company standing behind it.",
    options: [
      { label: "Hire an individual cleaner", detail: "Personal service can work well, but backup coverage depends on that one person." },
      { label: "A large rotating provider", detail: "Broad coverage, but the specific cleaners may change from visit to visit." },
      { label: "The Valley Clean Team", isUs: true, detail: "The same 44-item checklist every visit, backed by $2 million in liability insurance." },
    ],
  },
  "move-in-out-cleaning": {
    problem:
      "You're moving and there is already enough to coordinate. A move clean needs to cover the details an ordinary maintenance visit skips, without adding another surprise to moving day.",
    options: [
      { label: "Do it yourself", detail: "Saves the service cost, but competes with packing, loading, utilities, and handoff deadlines." },
      { label: "A basic hourly clean", detail: "Can be a fit for light work, but scope and final cost depend on what the cleaner considers included." },
      { label: "The Valley Clean Team", isUs: true, detail: "A move-focused checklist, an upfront quote, and a team that handles the detailed cleaning while you focus on the move." },
    ],
  },
  "commercial-cleaning": {
    problem:
      "Your business needs cleaning that happens reliably around operating hours. Missed service and unclear accountability create more work for the person managing the facility.",
    options: [
      { label: "An in-house or solo cleaner", detail: "Can be a simple arrangement, but backup coverage may be limited when that person is unavailable." },
      { label: "The lowest bid", detail: "Low price can be attractive, but compare scope, communication, insurance, and backup coverage before deciding." },
      { label: "The Valley Clean Team", isUs: true, detail: "Insured, background-checked crews on a schedule built around your facility, with one point of contact and custom quoting." },
    ],
  },
  "airbnb-cleaning": {
    problem:
      "A short-term rental turnover has a fixed clock. You need the property cleaned, reset, and ready before the next guest arrives.",
    options: [
      { label: "Clean it yourself", detail: "Works at small scale, but gets difficult when checkouts, travel, and back-to-back bookings overlap." },
      { label: "A standard house cleaner", detail: "May handle cleaning well, but turnover timing and guest-ready reset expectations need to be explicit." },
      { label: "The Valley Clean Team", isUs: true, detail: "Turnover cleaning scheduled around guest transitions, with a clear scope and guest-ready presentation." },
    ],
  },
  "post-construction-cleaning": {
    problem:
      "After construction or renovation, fine dust settles on surfaces, trim, tracks, fixtures, and floors. It takes a different level of detail than routine maintenance cleaning.",
    options: [
      { label: "Clean it yourself", detail: "Possible, but fine dust often needs repeated top-to-bottom passes and careful detail work." },
      { label: "Contractor broom clean", detail: "Usually removes debris and obvious mess, not the final-detail dust left before move-in." },
      { label: "The Valley Clean Team", isUs: true, detail: "A post-construction detail clean focused on dust removal and getting the finished space ready for use." },
    ],
  },
  "green-cleaning": {
    problem:
      "You want a clean home while also being thoughtful about the products used around your family, pets, and surfaces.",
    options: [
      { label: "Use your usual products", detail: "Familiar and easy, but they may not match your fragrance or ingredient preferences." },
      { label: "DIY alternatives", detail: "Lets you control ingredients, though results and surface compatibility vary by recipe." },
      { label: "The Valley Clean Team", isUs: true, detail: "Tell us your product sensitivities and surface requirements when booking so the cleaning plan can account for them." },
    ],
  },
  "neighborhood": {
    problem:
      "Finding a house cleaner you can trust in your neighborhood comes down to reliability, clear pricing, and knowing who is entering your home.",
    options: [
      { label: "An individual or gig cleaner", detail: "May offer flexibility and a low price; compare insurance, backup coverage, and consistency." },
      { label: "A large franchise", detail: "Provides broad coverage, though the assigned crew may change depending on scheduling." },
      { label: "The Valley Clean Team", isUs: true, detail: "An insured, background-checked team with an upfront quote and consistent scheduling." },
    ],
  },
  "medical-cleaning": {
    problem:
      "Medical and dental facilities have cleaning needs that must be defined carefully. General janitorial work is not the same thing as a regulated clinical-disinfection program.",
    options: [
      { label: "General janitorial service", detail: "Can handle ordinary facility cleaning when the scope is clearly separated from clinical or regulated disinfection duties." },
      { label: "Specialized clinical vendor", detail: "The appropriate choice when your facility requires documented medical-grade protocols, regulated disinfection, or certifications." },
      { label: "The Valley Clean Team", isUs: true, detail: "We can discuss general office/facility cleaning, but we do not claim clinical-compliance certifications or regulated medical-disinfection protocols we do not hold." },
    ],
  },
};
