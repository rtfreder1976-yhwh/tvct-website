const fs = require('fs');
const path = require('path');

const dir = 'src/pages/locations/madison';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

files.forEach(f => {
  const fullPath = path.join(dir, f);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Regex to find title and description in BaseLayout or ServiceLocationLayout
  const titleMatch = content.match(/title="([^"]+)"/);
  const descMatch = content.match(/description="([^"]+)"/);
  
  if (titleMatch || descMatch) {
    console.log(`${f}:`);
    if (titleMatch) {
      const title = titleMatch[1];
      console.log(`  Title (${title.length}): "${title}"`);
    }
    if (descMatch) {
      const desc = descMatch[1];
      console.log(`  Desc (${desc.length}): "${desc}"`);
    }
  }
});
