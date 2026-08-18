import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "../../../data/apiCatalog";

export const prerender = true;

const registrationInstructions = {
  audience: "automated_agents",
  status: "manual_review",
  provisioning_uri: `${SITE_ORIGIN}/agent/auth/register`,
  register_uri:
    "mailto:hello@thevalleycleanteam.com?subject=Agent%20integration%20request",
  methods_supported: ["anonymous", "manual_email"],
  identity_types_supported: ["anonymous"],
  credential_types_supported: ["none"],
  credential_use: {
    public_resources_require_credentials: false,
    authorization_header: "Do not send one for public resources.",
  },
  instructions: [
    "Use anonymous HTTPS GET or HEAD requests for public discovery resources.",
    "For a proposed non-public business integration, email the register_uri with the agent name, operator, purpose, and expected request rate.",
    "Requests are reviewed by a person. Approval and private credentials are not guaranteed.",
  ],
} as const;

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(registrationInstructions, null, 2), {
    status: 200,
    headers,
  });

export const HEAD: APIRoute = () =>
  new Response(null, {
    status: 200,
    headers,
  });
