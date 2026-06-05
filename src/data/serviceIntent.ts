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

// Region-level framing for the standalone service & industry pages (no single
// city). Combo pages have their own city-interpolated copy in the layout.
export const standaloneServiceIntent: Record<string, ServiceIntent> = {
  "deep-cleaning": {
    problem:
      "Your home needs more than a surface wipe-down — built-up grime on baseboards, inside appliances, grout, and the spots a routine clean never reaches. The real question is who actually cleans those, and what it honestly costs.",
    options: [
      { label: "A standard/recurring clean", detail: "Maintains a home that's already clean — it won't cut through months of build-up in the oven, grout, and baseboards." },
      { label: "A cheap one-time clean", detail: "Advertised low, but 'deep clean' often means the same surface pass with a bigger price tag. Ask exactly what's included first." },
      { label: "The Valley Clean Team", isUs: true, detail: "A true top-to-bottom reset from a flat upfront price — baseboards, inside appliances, cabinet fronts, detailed kitchen and bath — pet-safe products, satisfaction guaranteed." },
    ],
  },
  "regular-cleaning": {
    problem:
      "You're tired of losing weekends to cleaning, but you've heard the horror stories — a different stranger every visit, no-shows, prices that creep up. You want consistency you can actually count on.",
    options: [
      { label: "Keep doing it yourself", detail: "Free, but it's the weekend time and mental load you never get back — and it never really stays done." },
      { label: "A rotating gig-app cleaner", detail: "A new face each visit who never learns your home, with no company insurance or accountability behind them." },
      { label: "The Valley Clean Team", isUs: true, detail: "The same background-checked team every visit, a flat quote that doesn't move, no contract — weekly, bi-weekly, or monthly." },
    ],
  },
  "maid-service": {
    problem:
      "You want a clean home without managing it — but most 'maid services' rotate whoever's available, so you re-explain your home every visit and quality swings week to week.",
    options: [
      { label: "Hire an individual cleaner", detail: "Personal, until they're sick or quit and you're back to square one with no backup and no insurance." },
      { label: "A franchise with rotating crews", detail: "Reliable branding, but the specific cleaners change, so consistency depends on who's assigned that day." },
      { label: "The Valley Clean Team", isUs: true, detail: "A dedicated team that learns your home and returns every visit, fully insured and bonded, on a schedule and flat price you control." },
    ],
  },
  "move-in-out-cleaning": {
    problem:
      "You're moving and your deposit is on the line. Landlords inspect the exact spots tenants miss — oven interiors, window tracks, cabinet shelves, bathroom grout — and deduct for every one. Clean it wrong and you lose hundreds.",
    options: [
      { label: "Do it yourself", detail: "Free, but you clean what you see while the landlord inspects what you don't — the broiler drawer, fridge coils, caulk lines." },
      { label: "A $19/hr gig cleaner", detail: "Cheap up front, but no checklist, no insurance, and no guarantee your deposit comes back. Misses land on you." },
      { label: "The Valley Clean Team", isUs: true, detail: "A flat-rate clean to a landlord's inspection checklist — inside appliances, tracks, grout, baseboards — with post-clean photos and a 24-hour re-clean guarantee." },
    ],
  },
  "commercial-cleaning": {
    problem:
      "Your business can't run on a cleaner who flakes. A missed night means a bad first impression for clients or a compliance problem — and most 'commercial' cleaners are solo operators with no backup and no insurance.",
    options: [
      { label: "An in-house or solo cleaner", detail: "Works until they're sick, quit, or no-show — then your facility goes uncleaned with no backup and the liability is yours." },
      { label: "The lowest bid", detail: "Cheapest per-visit, but turnover is high and quality slips fast once the contract is signed." },
      { label: "The Valley Clean Team", isUs: true, detail: "Insured, background-checked crews on a consistent schedule built around your hours, one point of contact, and a free on-site assessment first." },
    ],
  },
  "airbnb-cleaning": {
    problem:
      "One bad turnover — a missed stain, no fresh linens, a late finish — and you've got a 1-star review and a blocked calendar. You need a turnover that's guest-ready every single time, on a host's timeline.",
    options: [
      { label: "Clean it yourself between guests", detail: "Doable until you scale — then back-to-back checkouts and a day job make same-day turnovers impossible." },
      { label: "A standard house cleaner", detail: "They'll clean, but linens, restocking, staging, and the checkout-to-check-in clock aren't their job." },
      { label: "The Valley Clean Team", isUs: true, detail: "Hospitality-standard turnovers timed to your booking calendar — fresh linens, restocked supplies, sanitized and staged for a 5-star reset." },
    ],
  },
  "post-construction-cleaning": {
    problem:
      "After a renovation, fine construction dust is in everything — vents, tracks, every surface — and it keeps resettling for days. Regular cleaning just spreads it around; this needs a specific multi-stage process.",
    options: [
      { label: "Clean it yourself", detail: "Without the right tools, dust resettles for a week and ends up in your HVAC. It's a job that fights back." },
      { label: "Your contractor's 'broom clean'", detail: "Gets the debris out, but leaves the fine dust film that makes a finished home still feel unfinished." },
      { label: "The Valley Clean Team", isUs: true, detail: "A multi-stage dust-removal clean — top to bottom, vents and tracks included — that takes a job-site to move-in ready." },
    ],
  },
  "green-cleaning": {
    problem:
      "You want a genuinely clean home without the harsh chemical smell, the headaches, or the worry about what your kids and pets are breathing and touching afterward.",
    options: [
      { label: "Standard chemical cleaning", detail: "Effective, but leaves residue and fumes you'd rather not have around pets, kids, or anyone with allergies or asthma." },
      { label: "DIY 'natural' products", detail: "Better ingredients, but most home remedies under-clean — you trade results for peace of mind." },
      { label: "The Valley Clean Team", isUs: true, detail: "Professional-grade results using non-toxic, pet- and kid-safe products — a truly clean home without the chemical trade-off." },
    ],
  },
  "event-cleaning": {
    problem:
      "Hosting is stressful enough without the cleanup. Before the event you need the space spotless; after, you need it reset fast — usually on a tight timeline you can't hit alone.",
    options: [
      { label: "Do it yourself", detail: "You spend the party exhausted from prep and the next day buried in cleanup instead of enjoying it." },
      { label: "Ask the venue", detail: "Often a surface tidy at a premium — rarely the detailed before-and-after reset a real event needs." },
      { label: "The Valley Clean Team", isUs: true, detail: "Pre- and post-event cleaning on your schedule, so the space is guest-ready before and reset fast after — parties, corporate, holidays." },
    ],
  },
  // Neighborhood pages — generic residential framing (no single service)
  "neighborhood": {
    problem:
      "Finding a house cleaner you can actually trust in your neighborhood is harder than it should be — no-shows, a different stranger every visit, and prices that change after they see your home. You want someone reliable, insured, and consistent.",
    options: [
      { label: "A gig-app or Craigslist cleaner", detail: "Cheap up front, but no company insurance, no bonding, and a new face each time — if something breaks or goes missing, the liability is yours." },
      { label: "A big franchise", detail: "Reliable branding, but crews rotate so they never learn your home, and per-visit pricing climbs once you add anything beyond the base." },
      { label: "The Valley Clean Team", isUs: true, detail: "The same background-checked, insured team every visit, a flat quote that doesn't move, pet-safe products, and a re-clean guarantee — serving your neighborhood directly." },
    ],
  },
  // Industry / facility pages — all share the commercial compliance framing
  "medical-cleaning": {
    problem:
      "A medical or dental facility can't gamble on cleaning. A missed disinfection step is a compliance and infection-control risk — and most cleaners aren't trained for healthcare-grade protocols or carry the right insurance.",
    options: [
      { label: "A general janitorial service", detail: "Cleans the floors, but isn't trained on OSHA, bloodborne-pathogen, or clinical disinfection standards." },
      { label: "An in-house solo cleaner", detail: "No backup if they're out, and the compliance liability for a missed protocol sits with you." },
      { label: "The Valley Clean Team", isUs: true, detail: "Healthcare-aware, insured, background-checked crews following clinical disinfection protocols on a dependable schedule — with a single point of contact." },
    ],
  },
};
