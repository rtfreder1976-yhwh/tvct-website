import { PRICING, RECURRING_DISCOUNTS, REVIEWS } from "../data/claims";
export { REVIEWS } from "../data/claims";

export interface CityConfig {
  lat: string;
  lng: string;
  phone: string;
  state: string;
  stateAbbr: string;
  zips: string;
  radius: string;
  edge: string;
  focusService: string;
  reviewFocus: string;
  searchVolume: string;
}

/**
 * `sms` uses the `?&body=` separator, not `?body=`. iOS Messages drops the
 * prefilled body with a bare `?`; the `?&` form is the one that works on both
 * iOS and Android. Keep it — it looks like a typo and is not.
 */
export const MARKET_PHONES = {
  AL: {
    display: "256-826-1100",
    href: "tel:2568261100",
    sms: "sms:2568261100?&body=Hi%2C%20I%27d%20like%20a%20cleaning%20quote.",
    schema: "+1-256-826-1100",
  },
  TN: {
    display: "615-510-1427",
    href: "tel:6155101427",
    sms: "sms:6155101427?&body=Hi%2C%20I%27d%20like%20a%20cleaning%20quote.",
    schema: "+1-615-510-1427",
  },
} as const;

type MarketPhone = (typeof MARKET_PHONES)[keyof typeof MARKET_PHONES];

export const BUSINESS_HOURS = {
  display: "Mon–Fri: 9:00 AM – 5:00 PM · Sat–Sun: By appointment",
  schema: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
} as const;

export function getMarketPhone(state?: string): MarketPhone {
  const s = (state ?? "").trim().toLowerCase();
  return s === "tn" || s === "tennessee" ? MARKET_PHONES.TN : MARKET_PHONES.AL;
}

export const cityConfigs: Record<string, CityConfig> = {
  Huntsville: {
    lat: "34.7304", lng: "-86.5861", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35801-35816", radius: "50000",
    edge: "North Alabama primary market", focusService: "House Cleaning",
    reviewFocus: "reliable local service", searchVolume: "high",
  },
  Madison: {
    lat: "34.6993", lng: "-86.7483", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35756-35758", radius: "25000",
    edge: "Madison County residential market", focusService: "Recurring House Cleaning",
    reviewFocus: "consistent teams", searchVolume: "medium",
  },
  Athens: {
    lat: "34.8026", lng: "-86.9717", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35611-35614", radius: "30000",
    edge: "Limestone County residential market", focusService: "House Cleaning",
    reviewFocus: "reliable local service", searchVolume: "low",
  },
  Decatur: {
    lat: "34.6059", lng: "-86.9833", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35601-35603", radius: "50000",
    edge: "Morgan County residential market", focusService: "Move-Out Cleaning",
    reviewFocus: "move-out cleaning", searchVolume: "medium",
  },
  "Mountain Brook": {
    lat: "33.4940", lng: "-86.7520", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35213-35243", radius: "20000",
    edge: "Estate and historic-home market", focusService: "Estate Cleaning",
    reviewFocus: "care for fine finishes", searchVolume: "low",
  },
  Florence: {
    lat: "34.7998", lng: "-87.6772", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35630-35634", radius: "30000",
    edge: "Shoals residential market", focusService: "House Cleaning",
    reviewFocus: "reliable local service", searchVolume: "low",
  },
  "Muscle Shoals": {
    lat: "34.7448", lng: "-87.6675", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35661-35662", radius: "35000",
    edge: "Shoals residential market", focusService: "House Cleaning",
    reviewFocus: "local trusted team", searchVolume: "low",
  },
  Nashville: {
    lat: "36.1627", lng: "-86.7816", phone: MARKET_PHONES.TN.schema,
    state: "Tennessee", stateAbbr: "TN", zips: "37201-37250", radius: "65000",
    edge: "Tennessee primary market", focusService: "House Cleaning",
    reviewFocus: "reliable local service", searchVolume: "very-high",
  },
  "West Nashville": {
    lat: "36.1527", lng: "-86.8816", phone: MARKET_PHONES.TN.schema,
    state: "Tennessee", stateAbbr: "TN", zips: "37205-37209", radius: "25000",
    edge: "Established residential market", focusService: "House Cleaning",
    reviewFocus: "consistent teams", searchVolume: "medium",
  },
  Tuscumbia: {
    lat: "34.7312", lng: "-87.7025", phone: MARKET_PHONES.AL.schema,
    state: "Alabama", stateAbbr: "AL", zips: "35674", radius: "35000",
    edge: "Historic-home market in the Shoals", focusService: "Historic Home Cleaning",
    reviewFocus: "historic home care", searchVolume: "low",
  },
};

const recurringDiscountLabel = `${Math.round(RECURRING_DISCOUNTS.weekly * 100)}%`;

/**
 * Organization-level service catalog. Prices come only from claims.ts; custom
 * quote services intentionally omit PriceSpecification.
 */
export const petSafeServiceCatalog = [
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#regular-cleaning",
      name: "Regular House Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: PRICING.regular.amount,
      priceCurrency: "USD",
      description: "Starting price",
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#deep-cleaning",
      name: "Deep Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: PRICING.deep.amount,
      priceCurrency: "USD",
      description: "Starting price",
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#recurring-cleaning",
      name: "Recurring House Cleaning",
      description: `Weekly, biweekly, or monthly service; weekly discounts up to ${recurringDiscountLabel}.`,
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#move-cleaning",
      name: "Move In/Out Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: PRICING.moveInOut.amount,
      priceCurrency: "USD",
      description: "Starting price",
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#airbnb-cleaning",
      name: "Airbnb & Vacation Rental Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: PRICING.airbnbTurnover.amount,
      priceCurrency: "USD",
      description: "Starting price for a standard turnover",
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#post-construction",
      name: "Post-Construction Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: PRICING.postConstruction.amount,
      priceCurrency: "USD",
      description: "Starting price",
    },
  },
  {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": "https://thevalleycleanteam.com/#commercial-cleaning",
      name: "Commercial & Office Cleaning",
      provider: { "@id": "https://thevalleycleanteam.com/#organization" },
    },
  },
];

// Keep a real runtime reference so a future accidental shadowed REVIEWS export
// fails TypeScript/lint review rather than silently diverging.
void REVIEWS;
