import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const retiredNames = [
  /^Outscraper-.*\.csv$/i,
  /^(?:advanced_)?master_outreach_list(?:_[^.]+)?\.csv$/i,
  /^(?:advanced_test_contacts|sample_outreach_contacts)\.csv$/i,
  /^OUTREACH_WORKFLOW\.json$/i,
];

const trackedAndUnignoredFiles = execFileSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
)
  .split("\0")
  .filter(Boolean);

const violations = new Map();

function report(file, reason) {
  if (!violations.has(file)) violations.set(file, reason);
}

for (const file of trackedAndUnignoredFiles) {
  const name = path.basename(file);
  if (retiredNames.some((pattern) => pattern.test(name))) {
    report(file, "matches a retired contact export or workflow snapshot");
    continue;
  }

  if (path.extname(file).toLowerCase() === ".csv") {
    const content = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
    const header = (lines[0] ?? "")
      .split(/[;,]/)
      .map((field) => field.replace(/^\s*["']|["']\s*$/g, "").trim().toLowerCase());
    const hasContactColumn = header.some((field) =>
      /^(?:e-?mail|.*_email|phone|.*_phone|telephone|mobile)$/.test(field),
    );

    if (hasContactColumn && lines.length > 1) {
      report(file, "contains contact-oriented columns and data rows");
    }
  }

  if (path.extname(file).toLowerCase() === ".json") {
    const content = fs.readFileSync(file, "utf8");
    const isN8nWorkflow = content.includes('"nodes"') && content.includes("n8n-nodes-base");
    const hasEmbeddedContact =
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(content) ||
      /(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/.test(content);

    if (isN8nWorkflow && hasEmbeddedContact) {
      report(file, "is an n8n workflow snapshot with embedded contact records");
    }
  }
}

if (violations.size > 0) {
  console.error("Repository hygiene validation failed:");
  for (const [file, reason] of violations) {
    console.error(`- ${file}: ${reason}; keep contact data in approved restricted storage`);
  }
  process.exit(1);
}

console.log(
  `Repository hygiene validation passed (${trackedAndUnignoredFiles.length} repository files scanned).`,
);
