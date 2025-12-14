const fs = require('fs');
const path = require('path');

// Title shortening rules - keep keywords, remove descriptors
const replacements = [
  // Remove secondary descriptors after first pipe
  [/\| New Home & Renovation \|/g, '|'],
  [/\| New Home &amp; Renovation \|/g, '|'],
  [/\| New Build & Renovation \|/g, '|'],
  [/\| New Build &amp; Renovation \|/g, '|'],
  [/\| Weekly & Biweekly Cleaning \|/g, '|'],
  [/\| Weekly &amp; Biweekly Cleaning \|/g, '|'],
  [/\| Weekly, Biweekly Cleaning \|/g, '|'],
  [/\| Office & Business Cleaning \|/g, '|'],
  [/\| Office &amp; Business Cleaning \|/g, '|'],
  [/\| Turnover Service \|/g, '|'],
  [/\| Party Cleanup, Pre-Event Deep Clean \|/g, '|'],
  [/\| Pre & Post Party Cleaning \|/g, '|'],
  [/\| Pre &amp; Post Party Cleaning \|/g, '|'],
  [/\| Office Janitorial Services \|/g, '|'],
  [/\| Town Madison New Homes \|/g, '|'],
  [/\| Town Madison, Clift Farm \|/g, '|'],
  [/\| Old Decatur, Hartselle \|/g, '|'],
  [/\| Ivy Green, Shoals Area \|/g, '|'],
  [/\| Premium Service \|/g, '|'],
  [/\| Trusted Service \|/g, '|'],
  [/\| Family Service \|/g, '|'],
  [/\| Luxury Service \|/g, '|'],
  [/\| Get Your Deposit Back \|/g, '|'],
  [/\| Party & Venue Cleanup \|/g, '|'],
  [/\| Party &amp; Venue Cleanup \|/g, '|'],
  [/\| Vacation Rental Turnover \|/g, '|'],
  [/\| Eco-Friendly House Cleaning \|/g, '|'],
  [/\| Eco-Friendly, Non-Toxic \|/g, '|'],
  [/\| Eco-Friendly Shoals \|/g, '|'],
  [/\| Eco-Friendly \|/g, '|'],
  [/\| Party Cleanup Shoals \|/g, '|'],
  [/\| Party Cleanup \|/g, '|'],
  [/\| Office Cleaning \|/g, '|'],
  [/\| Offices \|/g, '|'],
  [/\| Office \|/g, '|'],
  [/\| Deposit Back \|/g, '|'],
  [/\| Luxury Home \|/g, '|'],
  [/\| Belle Meade \|/g, '|'],

  // Fix duplicate Valley Clean
  [/\| Valley Clean \| Valley Clean Team/g, '| Valley Clean Team'],

  // Shorten long location descriptions
  [/House Cleaning in Clift's Cove, Madison AL/g, 'House Cleaning Clift\'s Cove Madison AL'],
  [/House Cleaning in Hillsboro Village & Belmont \| Nashville/g, 'Hillsboro Village Cleaning Nashville'],
  [/House Cleaning in Hillsboro Village &amp; Belmont \| Nashville/g, 'Hillsboro Village Cleaning Nashville'],
  [/House Cleaning in Forest Hills, Nashville/g, 'Forest Hills Cleaning Nashville'],
  [/House Cleaning in Homewood, Birmingham/g, 'Homewood Cleaning Birmingham AL'],
  [/House Cleaning in Hoover, Alabama/g, 'Hoover House Cleaning AL'],
  [/House Cleaning in Providence, Madison AL/g, 'Providence Cleaning Madison AL'],
  [/House Cleaning in Sylvan Park, Nashville/g, 'Sylvan Park Cleaning Nashville'],
  [/House Cleaning in Bellevue, Nashville/g, 'Bellevue Cleaning Nashville'],
  [/Estate Cleaning in Oak Hill, Nashville/g, 'Oak Hill Estate Cleaning Nashville'],
  [/House Cleaning Mountain Brook AL \| Luxury Home Cleaning/g, 'Luxury House Cleaning Mountain Brook AL'],

  // Shorten Airbnb titles
  [/Airbnb & Vacation Rental Cleaning/g, 'Airbnb Cleaning'],
  [/Airbnb &amp; Vacation Rental Cleaning/g, 'Airbnb Cleaning'],

  // Shorten long blog titles
  [/How Much Does House Cleaning Cost in Alabama\? \(2025 Pricing Guide\)/g, 'House Cleaning Cost Alabama 2025'],
  [/What to Expect from Your First Professional Cleaning/g, 'What to Expect: First Professional Cleaning'],
  [/Emergency House Cleaning: Guests Coming in 2 Hours\? Here's Your Plan/g, 'Emergency Cleaning: Guests in 2 Hours'],
  [/Emergency House Cleaning: Guests Coming in 2 Hours\? Here&#39;s Your Plan/g, 'Emergency Cleaning: Guests in 2 Hours'],
  [/Deep Cleaning Cost in the Shoals: Florence, Muscle Shoals Pricing Guide/g, 'Deep Cleaning Cost Shoals AL'],
  [/Spring Cleaning Nashville: Survival Guide for Music City Homes/g, 'Spring Cleaning Nashville Guide'],
  [/Airbnb Cleaning Nashville: Host Guide to Avoid Bad Reviews/g, 'Airbnb Cleaning Nashville Host Guide'],
  [/Is Hiring a House Cleaner Worth It\? Honest Cost Analysis/g, 'Is Hiring a Cleaner Worth It?'],
  [/Complete Guide to Move-Out Cleaning in Huntsville \| TVCT/g, 'Move-Out Cleaning Huntsville Guide'],
  [/Post-Construction Cleaning Birmingham: Complete Guide/g, 'Post-Construction Cleaning Birmingham'],
  [/Cleaning Service Missing Spots\? What to Do Next/g, 'Cleaning Service Missing Spots?'],

  // Shorten location hub titles
  [/Tuscumbia Cleaning Services \| House Cleaning in the Shoals/g, 'Tuscumbia Cleaning Services'],
  [/Mountain Brook Cleaning Services \| Luxury Home/g, 'Mountain Brook Cleaning Services'],
  [/West Nashville Cleaning Services \| Belle Meade/g, 'West Nashville Cleaning Services'],

  // Remove redundant "Valley Clean" when already in brand
  [/\| Valley Clean \|/g, '|'],

  // Clean up double pipes
  [/\|\s*\|/g, '|'],
  [/\|\s+Valley Clean Team/g, '| Valley Clean Team'],
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

// Process src/pages
const files = findAstroFiles('src/pages');
let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    totalChanged++;

    // Extract and show the title
    const titleMatch = newContent.match(/title="([^"]+)"/);
    if (titleMatch) {
      const title = titleMatch[1];
      const status = title.length <= 60 ? '✓' : `✗ (${title.length})`;
      console.log(`${status} ${file.replace('src\\pages\\', '')}`);
      if (title.length > 60) {
        console.log(`   "${title}"`);
      }
    }
  }
});

console.log(`\nTotal files updated: ${totalChanged}`);
