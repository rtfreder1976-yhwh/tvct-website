import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const authMdPath = resolve(root, "dist/client/auth.md");
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
  "Supported method",
  "Registration and provisioning",
  "Credential use",
]) {
  if (!new RegExp(`^## ${heading}`, "im").test(authMd)) {
    fail(`missing the ${heading} section`);
  }
}

if (!authMd.includes("There is no `register_uri`")) {
  fail("registration availability must be explicit");
}
if (!authMd.includes("must not probe or send requests to `/agent/auth`")) {
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

console.log("auth.md validation passed (anonymous public access).");
