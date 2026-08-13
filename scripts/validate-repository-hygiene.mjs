import fs from "node:fs";

const forbiddenRootFiles = [
  /^Outscraper-.*\.csv$/i,
  /^(?:advanced_)?master_outreach_list(?:_[^.]+)?\.csv$/i,
  /^(?:advanced_test_contacts|sample_outreach_contacts)\.csv$/i,
  /^OUTREACH_WORKFLOW\.json$/i,
];

const violations = fs
  .readdirSync(".", { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => forbiddenRootFiles.some((pattern) => pattern.test(name)));

if (violations.length > 0) {
  console.error("Repository hygiene validation failed:");
  for (const file of violations) {
    console.error(
      `- ${file}: contact data or a data-bearing workflow export must not be stored in the public website repository`,
    );
  }
  process.exit(1);
}

console.log(
  "Repository hygiene validation passed (no retired contact exports or data-bearing workflow snapshot).",
);
