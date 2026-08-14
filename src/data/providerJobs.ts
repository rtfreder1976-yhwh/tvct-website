export interface ProviderJob {
  slug: string;
  identifier: string;
  market: string;
  locality: string;
  region: "AL" | "TN";
  geoRegion: string;
  geoPosition: string;
  nearbyAreas: string[];
  introduction: string;
}

export const providerJobs: ProviderJob[] = [
  {
    slug: "florence-shoals",
    identifier: "TVCT-PROVIDER-FLORENCE-SHOALS",
    market: "Florence & The Shoals",
    locality: "Florence",
    region: "AL",
    geoRegion: "US-AL",
    geoPosition: "34.7998;-87.6773",
    nearbyAreas: [
      "Florence",
      "Muscle Shoals",
      "Sheffield",
      "Tuscumbia",
      "Killen",
    ],
    introduction:
      "We are expanding our network of reliable independent cleaning providers across Florence and the Shoals.",
  },
  {
    slug: "madison-al",
    identifier: "TVCT-PROVIDER-MADISON-AL",
    market: "Madison",
    locality: "Madison",
    region: "AL",
    geoRegion: "US-AL",
    geoPosition: "34.6993;-86.7483",
    nearbyAreas: [
      "Madison City",
      "Clift Farm",
      "Town Madison",
      "Triana",
      "West Huntsville",
    ],
    introduction:
      "We are looking for experienced independent cleaning providers serving Madison and nearby communities.",
  },
  {
    slug: "huntsville-al",
    identifier: "TVCT-PROVIDER-HUNTSVILLE-AL",
    market: "Huntsville",
    locality: "Huntsville",
    region: "AL",
    geoRegion: "US-AL",
    geoPosition: "34.7304;-86.5861",
    nearbyAreas: [
      "Huntsville",
      "Hampton Cove",
      "Owens Cross Roads",
      "Five Points",
      "Jones Valley",
      "Monte Sano",
    ],
    introduction:
      "We are expanding our independent provider network across Huntsville and surrounding communities.",
  },
  {
    slug: "nashville-tn",
    identifier: "TVCT-PROVIDER-NASHVILLE-TN",
    market: "Nashville",
    locality: "Nashville",
    region: "TN",
    geoRegion: "US-TN",
    geoPosition: "36.1627;-86.7816",
    nearbyAreas: [
      "Nashville",
      "West Nashville",
      "Bellevue",
      "The Nations",
      "Sylvan Park",
      "East Nashville",
      "Green Hills",
      "Brentwood",
    ],
    introduction:
      "We are growing our network of independent residential cleaning providers across Nashville.",
  },
];
