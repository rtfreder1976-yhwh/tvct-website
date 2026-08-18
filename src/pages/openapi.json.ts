import type { APIRoute } from "astro";
import {
  API_CATALOG_LINK,
  API_CATALOG_PATH,
  API_CATALOG_PROFILE,
  SITE_ORIGIN,
} from "../data/apiCatalog";

export const prerender = true;

const link = {
  type: "object",
  required: ["href"],
  properties: {
    href: { type: "string", format: "uri" },
    type: { type: "string" },
  },
  additionalProperties: true,
} as const;

const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "The Valley Clean Team API Discovery",
    version: "1.0.0",
    description:
      "Discovers the public APIs published by The Valley Clean Team using the RFC 9727 API catalog format.",
  },
  servers: [{ url: SITE_ORIGIN }],
  paths: {
    [API_CATALOG_PATH]: {
      get: {
        summary: "Get the API catalog",
        operationId: "getApiCatalog",
        responses: {
          "200": {
            description: "An RFC 9727 API catalog encoded as a JSON Linkset.",
            headers: {
              Link: {
                description: "Identifies the API catalog resource.",
                schema: { type: "string", const: API_CATALOG_LINK },
              },
            },
            content: {
              "application/linkset+json": {
                schema: { $ref: "#/components/schemas/ApiCatalog" },
              },
            },
          },
        },
      },
      head: {
        summary: "Discover the API catalog link relation",
        operationId: "headApiCatalog",
        responses: {
          "200": {
            description: "Headers for the RFC 9727 API catalog.",
            headers: {
              Link: {
                required: true,
                description: "Identifies the API catalog resource.",
                schema: { type: "string", const: API_CATALOG_LINK },
              },
              "Content-Type": {
                schema: {
                  type: "string",
                  example: `application/linkset+json; profile="${API_CATALOG_PROFILE}"`,
                },
              },
            },
          },
        },
      },
    },
    "/agent/auth/register": {
      get: {
        summary: "Get agent integration provisioning instructions",
        operationId: "getAgentProvisioningInstructions",
        description:
          "Returns the supported anonymous and manual-email registration methods. This read-only endpoint does not create an account or issue credentials.",
        responses: {
          "200": {
            description: "Current agent provisioning instructions.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AgentProvisioning" },
              },
            },
          },
        },
      },
      head: {
        summary: "Check agent provisioning instruction availability",
        operationId: "headAgentProvisioningInstructions",
        responses: {
          "200": {
            description: "Provisioning instructions are available.",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Link: link,
      CatalogEntry: {
        type: "object",
        required: ["anchor", "service-desc", "service-doc"],
        properties: {
          anchor: { type: "string", format: "uri" },
          "service-desc": {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/Link" },
          },
          "service-doc": {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/Link" },
          },
          status: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/Link" },
          },
        },
        additionalProperties: true,
      },
      ApiCatalog: {
        type: "object",
        required: ["linkset"],
        properties: {
          linkset: {
            type: "array",
            items: { $ref: "#/components/schemas/CatalogEntry" },
          },
        },
      },
      AgentProvisioning: {
        type: "object",
        required: [
          "audience",
          "status",
          "provisioning_uri",
          "register_uri",
          "methods_supported",
          "credential_use",
        ],
        properties: {
          audience: { type: "string", const: "automated_agents" },
          status: { type: "string", const: "manual_review" },
          provisioning_uri: { type: "string", format: "uri" },
          register_uri: { type: "string", format: "uri" },
          methods_supported: {
            type: "array",
            items: { type: "string", enum: ["anonymous", "manual_email"] },
          },
          identity_types_supported: {
            type: "array",
            items: { type: "string", enum: ["anonymous"] },
          },
          credential_types_supported: {
            type: "array",
            items: { type: "string", enum: ["none"] },
          },
          credential_use: { type: "object" },
          instructions: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(openApiDocument, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.oai.openapi+json;version=3.1",
      "Cache-Control": "public, max-age=3600",
    },
  });
