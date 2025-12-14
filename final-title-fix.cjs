const fs = require('fs');
const path = require('path');

// Remove secondary descriptors from titles (source format without brand suffix)
const replacements = [
  // Remove "| Premium Service"
  [/\| Premium Service"/g, '"'],
  [/\| Premium Service$/gm, ''],
  // Remove "| Office Cleaning"
  [/\| Office Cleaning"/g, '"'],
  [/\| Office Cleaning$/gm, ''],
  // Remove "| Eco-Friendly Shoals"
  [/\| Eco-Friendly Shoals"/g, '"'],
  // Remove "| Eco-Friendly"
  [/\| Eco-Friendly"/g, '"'],
  [/\| Eco-Friendly$/gm, ''],
  // Remove "| Trusted Service"
  [/\| Trusted Service"/g, '"'],
  // Remove "| Party Cleanup"
  [/\| Party Cleanup"/g, '"'],
  [/\| Party Cleanup$/gm, ''],
  // Remove "| Offices"
  [/\| Offices"/g, '"'],
  [/\| Offices$/gm, ''],
  // Remove "| Office"
  [/\| Office"/g, '"'],
  [/\| Office$/gm, ''],
  // Remove "| Deposit Back"
  [/\| Deposit Back"/g, '"'],
  // Remove "| Family Service"
  [/\| Family Service"/g, '"'],
  // Remove "| Luxury Service"
  [/\| Luxury Service"/g, '"'],
  // Remove "| Get Your Deposit Back"
  [/\| Get Your Deposit Back"/g, '"'],
  // Remove "| Valley Clean" (duplicate)
  [/\| Valley Clean"/g, '"'],
  [/\| Valley Clean$/gm, ''],

  // Specific fixes for long location names
  ['House Cleaning Clift\'s Cove Madison AL', 'Clift\'s Cove Cleaning Madison AL'],
  ['Oak Hill Estate Cleaning Nashville', 'Oak Hill Cleaning Nashville TN'],
  ['SEO Dashboard - Analytics & Performance Tracking', 'SEO Dashboard'],

  // Shorten West Nashville TN to West Nashville
  [/West Nashville TN/g, 'West Nashville'],
];

function findAstroFiles(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...findAstroFiles(fullPath));
      } else if (item.name.endsWith('.astro')) {
        files.push(fullPath);
      }
    }
  } catch (e) {}
  return files;
}

const files = findAstroFiles('src/pages');
let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const [pattern, replacement] of replacements) {
    if (pattern instanceof RegExp) {
      newContent = newContent.replace(pattern, replacement);
    } else {
      newContent = newContent.split(pattern).join(replacement);
    }
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    totalChanged++;
    console.log('Updated:', file.replace('src\\pages\\', ''));
  }
});

console.log(`\nTotal files updated: ${totalChanged}`);
