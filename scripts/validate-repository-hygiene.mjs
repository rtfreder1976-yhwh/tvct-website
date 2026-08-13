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
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phonePattern = /(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/;
const contactOnlyEmailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const contactOnlyPhonePattern = /^(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
const contactKeyPattern = /^(?:e?mail|emailaddress|phone|phonenumber|telephone|mobile)$/;
const identityKeyPattern = /^(?:name|firstname|lastname|contactname|organization|company|companyname)$/;

function normalizedKey(value) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function containsJsonContactRecord(value) {
  if (Array.isArray(value)) return value.some(containsJsonContactRecord);
  if (!value || typeof value !== "object") return false;

  const entries = Object.entries(value);
  const hasIdentity = entries.some(([key, entryValue]) =>
    identityKeyPattern.test(normalizedKey(key)) && String(entryValue ?? "").trim() !== "",
  );
  const hasEmail = entries.some(([key, entryValue]) =>
    contactKeyPattern.test(normalizedKey(key)) && emailPattern.test(String(entryValue ?? "")),
  );
  const hasPhone = entries.some(([key, entryValue]) =>
    contactKeyPattern.test(normalizedKey(key)) && phonePattern.test(String(entryValue ?? "")),
  );

  if (hasEmail || (hasPhone && hasIdentity)) return true;
  return entries.some(([, entryValue]) => containsJsonContactRecord(entryValue));
}

function spreadsheetXml(file, pattern) {
  try {
    return execFileSync("unzip", ["-p", file, pattern], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function report(file, reason) {
  if (!violations.has(file)) violations.set(file, reason);
}

for (const file of trackedAndUnignoredFiles) {
  const name = path.basename(file);
  if (retiredNames.some((pattern) => pattern.test(name))) {
    report(file, "matches a retired contact export or workflow snapshot");
    continue;
  }

  const extension = path.extname(file).toLowerCase();

  if ([".csv", ".tsv", ".txt"].includes(extension)) {
    const content = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
    const delimiter = (lines[0] ?? "").includes("\t") ? /\t/ : /[;,]/;
    const header = (lines[0] ?? "")
      .split(delimiter)
      .map((field) => field.replace(/^\s*["']|["']\s*$/g, "").trim().toLowerCase());
    const hasContactColumn = header.some((field) =>
      contactKeyPattern.test(normalizedKey(field)),
    );

    if (header.length > 1 && hasContactColumn && lines.length > 1) {
      report(file, "contains contact-oriented columns and data rows");
    }

    const contactOnlyLines = lines.filter((line) => {
      const value = line.trim();
      return contactOnlyEmailPattern.test(value) || contactOnlyPhonePattern.test(value);
    });

    if (contactOnlyLines.length >= 2 && contactOnlyLines.length / lines.length >= 0.5) {
      report(file, "contains a headerless list of email addresses or phone numbers");
    }
  }

  if (extension === ".json") {
    const content = fs.readFileSync(file, "utf8");
    const isN8nWorkflow = content.includes('"nodes"') && content.includes("n8n-nodes-base");
    const hasEmbeddedContact = emailPattern.test(content) || phonePattern.test(content);

    if (isN8nWorkflow && hasEmbeddedContact) {
      report(file, "is an n8n workflow snapshot with embedded contact records");
      continue;
    }

    if (file !== "src/data/locations.json") {
      try {
        if (containsJsonContactRecord(JSON.parse(content))) {
          report(file, "contains structured email or phone contact records");
        }
      } catch {
        // Other validation owns malformed JSON; this guard only classifies contact data.
      }
    }
  }

  if (extension === ".xlsx" || extension === ".ods") {
    const xml =
      extension === ".xlsx"
        ? spreadsheetXml(file, "xl/sharedStrings.xml") +
          spreadsheetXml(file, "xl/worksheets/*.xml")
        : spreadsheetXml(file, "content.xml");
    const hasIdentityLabel = /(?:name|contact|organization|company)/i.test(xml);

    if (xml.trim() === "") {
      report(file, "is a spreadsheet that CI could not inspect safely");
    } else if (emailPattern.test(xml) || (phonePattern.test(xml) && hasIdentityLabel)) {
      report(file, "contains contact records in a spreadsheet");
    }
  }

  if (extension === ".xls") {
    report(file, "uses a legacy binary spreadsheet format that cannot be safely inspected in CI");
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
