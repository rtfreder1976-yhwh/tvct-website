import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const authMdPath = resolve(root, "dist/client/auth.md");
const provisioningPath = resolve(root, "dist/client/agent/auth/register");
const openApiPath = resolve(root, "dist/client/openapi.json");
const vercelConfig = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
const authMd = readFileSync(authMdPath, "utf8");

const fail = (message) => {
  throw new Error(`auth.md validation failed: ${message}`);
};

if (!/^# .*auth\.md\s*$/im.test(authMd)) {
  fail("an H1 heading containing auth.md is required");
}

for (const heading of [
  "Agent audience",
  "Supported registration methods",
  "Registration and provisioning endpoints",
  "Credential use",
]) {
  if (!new RegExp(`^## ${heading}`, "im").test(authMd)) {
    fail(`missing the ${heading} section`);
  }
}

if (!authMd.includes("GET https://thevalleycleanteam.com/agent/auth/register")) {
  fail("the standalone provisioning endpoint is missing");
}
if (!authMd.includes("must not probe or send requests to `POST /agent/auth`")) {
  fail("passive-discovery safety guidance is missing");
}
if (!authMd.includes("Do not send an `Authorization` header")) {
  fail("credential-use guidance is missing");
}

const authHeaders = vercelConfig.headers?.find(
  (rule) => rule.source === "/auth.md",
)?.headers;
const contentType = authHeaders?.find(
  (header) => header.key.toLowerCase() === "content-type",
)?.value;

if (!contentType?.startsWith("text/markdown")) {
  fail("Vercel route is missing the text/markdown Content-Type");
}

const provisioningHeaders = vercelConfig.headers?.find(
  (rule) => rule.source === "/agent/auth/register",
)?.headers;
const provisioningContentType = provisioningHeaders?.find(
  (header) => header.key.toLowerCase() === "content-type",
)?.value;
if (!provisioningContentType?.startsWith("application/json")) {
  fail("provisioning route is missing the application/json Content-Type");
}

const provisioning = JSON.parse(readFileSync(provisioningPath, "utf8"));
if (provisioning.audience !== "automated_agents") {
  fail("provisioning endpoint must identify its agent audience");
}
if (!provisioning.methods_supported?.includes("anonymous")) {
  fail("provisioning endpoint must list the anonymous method");
}
if (!provisioning.methods_supported?.includes("manual_email")) {
  fail("provisioning endpoint must list the manual_email method");
}
if (!provisioning.register_uri?.startsWith("mailto:")) {
  fail("provisioning endpoint must publish the manual register_uri");
}
if (provisioning.credential_use?.public_resources_require_credentials !== false) {
  fail("provisioning endpoint must explain public credential use");
}

const openApi = JSON.parse(readFileSync(openApiPath, "utf8"));
if (!openApi.paths?.["/agent/auth/register"]?.get) {
  fail("OpenAPI document does not describe the provisioning endpoint");
}

console.log("auth.md validation passed (standalone provisioning flow).");
