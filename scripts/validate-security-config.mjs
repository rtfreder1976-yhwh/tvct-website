import fs from "node:fs";

const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const failures = [];

function headerMapFor(source) {
  const rule = vercel.headers?.find((entry) => entry.source === source);
  if (!rule) {
    failures.push(`vercel.json: missing header rule for ${source}`);
    return new Map();
  }

  return new Map(
    rule.headers.map(({ key, value }) => [key.toLowerCase(), value]),
  );
}

function requireHeader(headers, name, expected) {
  const actual = headers.get(name.toLowerCase());
  if (actual !== expected) {
    failures.push(
      `vercel.json: ${name} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`,
    );
  }
}

const globalHeaders = headerMapFor("/(.*)");

requireHeader(globalHeaders, "X-Content-Type-Options", "nosniff");
requireHeader(globalHeaders, "X-Frame-Options", "DENY");
requireHeader(globalHeaders, "Referrer-Policy", "strict-origin-when-cross-origin");
requireHeader(globalHeaders, "X-XSS-Protection", "0");

const hsts = globalHeaders.get("strict-transport-security") ?? "";
const maxAge = Number(/(?:^|;)\s*max-age=(\d+)/i.exec(hsts)?.[1] ?? 0);
if (maxAge < 31_536_000) {
  failures.push("vercel.json: Strict-Transport-Security max-age must be at least one year");
}

const csp = globalHeaders.get("content-security-policy") ?? "";
for (const directive of [
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
]) {
  if (!csp.split(";").map((value) => value.trim()).includes(directive)) {
    failures.push(`vercel.json: Content-Security-Policy is missing ${JSON.stringify(directive)}`);
  }
}

const permissions = globalHeaders.get("permissions-policy") ?? "";
for (const permission of ["camera=()", "geolocation=()", "microphone=()", "payment=()"]) {
  if (!permissions.split(",").map((value) => value.trim()).includes(permission)) {
    failures.push(`vercel.json: Permissions-Policy is missing ${JSON.stringify(permission)}`);
  }
}

const apiHeaders = headerMapFor("/api/(.*)");
requireHeader(apiHeaders, "X-Robots-Tag", "noindex, nofollow");

if (failures.length > 0) {
  console.error("Security configuration validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Security configuration validation passed (headers, CSP, and private API indexing guard).");
