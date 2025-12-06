#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error("Error: GOOGLE_MAPS_API_KEY environment variable is required");
  process.exit(1);
}

const BASE_URL = "https://maps.googleapis.com/maps/api";

// Define available tools
const tools: Tool[] = [
  {
    name: "search_places",
    description: "Search for places/businesses using Google Places API. Returns a list of matching places with basic info.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g., 'cleaning services in Huntsville AL')",
        },
        location: {
          type: "string",
          description: "Optional: Center point for search as 'lat,lng' (e.g., '34.7304,-86.5861')",
        },
        radius: {
          type: "number",
          description: "Optional: Search radius in meters (max 50000, default 5000)",
        },
        type: {
          type: "string",
          description: "Optional: Place type filter (e.g., 'restaurant', 'store', 'lodging')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_place_details",
    description: "Get detailed information about a specific place including reviews, hours, contact info, and more.",
    inputSchema: {
      type: "object",
      properties: {
        place_id: {
          type: "string",
          description: "The Google Place ID of the location",
        },
        fields: {
          type: "string",
          description: "Optional: Comma-separated list of fields to return (e.g., 'name,rating,reviews,formatted_phone_number')",
        },
      },
      required: ["place_id"],
    },
  },
  {
    name: "geocode_address",
    description: "Convert an address to geographic coordinates (latitude/longitude).",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "The address to geocode (e.g., '123 Main St, Huntsville, AL 35801')",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "reverse_geocode",
    description: "Convert geographic coordinates to an address.",
    inputSchema: {
      type: "object",
      properties: {
        lat: {
          type: "number",
          description: "Latitude coordinate",
        },
        lng: {
          type: "number",
          description: "Longitude coordinate",
        },
      },
      required: ["lat", "lng"],
    },
  },
  {
    name: "get_distance_matrix",
    description: "Calculate travel distance and time between origins and destinations.",
    inputSchema: {
      type: "object",
      properties: {
        origins: {
          type: "string",
          description: "Starting point(s) - address or 'lat,lng' (pipe-separated for multiple)",
        },
        destinations: {
          type: "string",
          description: "End point(s) - address or 'lat,lng' (pipe-separated for multiple)",
        },
        mode: {
          type: "string",
          enum: ["driving", "walking", "bicycling", "transit"],
          description: "Optional: Travel mode (default: driving)",
        },
      },
      required: ["origins", "destinations"],
    },
  },
  {
    name: "find_nearby_places",
    description: "Find places near a specific location by type.",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Center point as 'lat,lng' (e.g., '34.7304,-86.5861')",
        },
        radius: {
          type: "number",
          description: "Search radius in meters (max 50000)",
        },
        type: {
          type: "string",
          description: "Place type (e.g., 'restaurant', 'gas_station', 'hospital', 'store')",
        },
        keyword: {
          type: "string",
          description: "Optional: Keyword to filter results",
        },
      },
      required: ["location", "radius", "type"],
    },
  },
];

// API helper functions
async function searchPlaces(params: {
  query: string;
  location?: string;
  radius?: number;
  type?: string;
}): Promise<any> {
  const url = new URL(`${BASE_URL}/place/textsearch/json`);
  url.searchParams.set("query", params.query);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  if (params.location) {
    url.searchParams.set("location", params.location);
  }
  if (params.radius) {
    url.searchParams.set("radius", params.radius.toString());
  }
  if (params.type) {
    url.searchParams.set("type", params.type);
  }

  const response = await fetch(url.toString());
  return response.json();
}

async function getPlaceDetails(params: {
  place_id: string;
  fields?: string;
}): Promise<any> {
  const url = new URL(`${BASE_URL}/place/details/json`);
  url.searchParams.set("place_id", params.place_id);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  if (params.fields) {
    url.searchParams.set("fields", params.fields);
  } else {
    // Default fields if none specified
    url.searchParams.set(
      "fields",
      "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,opening_hours,business_status,price_level,types"
    );
  }

  const response = await fetch(url.toString());
  return response.json();
}

async function geocodeAddress(address: string): Promise<any> {
  const url = new URL(`${BASE_URL}/geocode/json`);
  url.searchParams.set("address", address);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  const response = await fetch(url.toString());
  return response.json();
}

async function reverseGeocode(lat: number, lng: number): Promise<any> {
  const url = new URL(`${BASE_URL}/geocode/json`);
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  const response = await fetch(url.toString());
  return response.json();
}

async function getDistanceMatrix(params: {
  origins: string;
  destinations: string;
  mode?: string;
}): Promise<any> {
  const url = new URL(`${BASE_URL}/distancematrix/json`);
  url.searchParams.set("origins", params.origins);
  url.searchParams.set("destinations", params.destinations);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  if (params.mode) {
    url.searchParams.set("mode", params.mode);
  }

  const response = await fetch(url.toString());
  return response.json();
}

async function findNearbyPlaces(params: {
  location: string;
  radius: number;
  type: string;
  keyword?: string;
}): Promise<any> {
  const url = new URL(`${BASE_URL}/place/nearbysearch/json`);
  url.searchParams.set("location", params.location);
  url.searchParams.set("radius", params.radius.toString());
  url.searchParams.set("type", params.type);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);

  if (params.keyword) {
    url.searchParams.set("keyword", params.keyword);
  }

  const response = await fetch(url.toString());
  return response.json();
}

// Create server instance
const server = new Server(
  {
    name: "google-maps-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case "search_places":
        result = await searchPlaces(args as any);
        break;

      case "get_place_details":
        result = await getPlaceDetails(args as any);
        break;

      case "geocode_address":
        result = await geocodeAddress((args as any).address);
        break;

      case "reverse_geocode":
        result = await reverseGeocode((args as any).lat, (args as any).lng);
        break;

      case "get_distance_matrix":
        result = await getDistanceMatrix(args as any);
        break;

      case "find_nearby_places":
        result = await findNearbyPlaces(args as any);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Maps MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
