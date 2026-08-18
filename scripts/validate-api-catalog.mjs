import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const clientOutput = resolve(root, "dist/client");
const catalogPath = resolve(clientOutput, ".well-known/api-catalog");
const openApiPath = resolve(clientOutput, "openapi.json");
const docsPath = resolve(clientOutput, "api-docs/index.html");
const vercelConfig = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));

const fail = (message) => {
  throw new Error(`API catalog validation failed: ${message}`);
};

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
if (!Array.isArray(catalog.linkset) || catalog.linkset.length === 0) {
  fail("linkset must be a non-empty array");
}

for (const [index, entry] of catalog.linkset.entries()) {
  try {
    new URL(entry.anchor);
  } catch {
    fail(`linkset[${index}].anchor must be an absolute URL`);
  }

  for (const relation of ["service-desc", "service-doc"]) {
    if (!Array.isArray(entry[relation]) || entry[relation].length === 0) {
      fail(`linkset[${index}].${relation} must be a non-empty array`);
    }
    for (const link of entry[relation]) {
      try {
        new URL(link.href);
      } catch {
        fail(`linkset[${index}].${relation} contains an invalid href`);
      }
    }
  }
}

const openApi = JSON.parse(readFileSync(openApiPath, "utf8"));
if (!openApi.openapi?.startsWith("3.1.")) fail("OpenAPI document must use version 3.1");
if (!openApi.paths?.["/.well-known/api-catalog"]?.get) {
  fail("OpenAPI document does not describe GET /.well-known/api-catalog");
}
if (!readFileSync(docsPath, "utf8").includes("API discovery")) {
  fail("human-readable API documentation was not generated");
}

const catalogHeaders = vercelConfig.headers?.find(
  (rule) => rule.source === "/.well-known/api-catalog",
)?.headers;
const contentType = catalogHeaders?.find(
  (header) => header.key.toLowerCase() === "content-type",
)?.value;
const linkHeader = catalogHeaders?.find(
  (header) => header.key.toLowerCase() === "link",
)?.value;

if (!contentType?.startsWith("application/linkset+json")) {
  fail("Vercel route is missing the application/linkset+json Content-Type");
}
if (!linkHeader?.includes('rel="api-catalog"')) {
  fail("Vercel route is missing the api-catalog Link relation");
}

console.log(`API catalog validation passed (${catalog.linkset.length} API).`);
