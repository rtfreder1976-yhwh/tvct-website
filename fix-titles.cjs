const fs = require('fs');
const path = require('path');

function findAstroFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findAstroFiles(fullPath));
    } else if (item.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = findAstroFiles('src/pages');
let changed = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(/\| The Valley Clean Team/g, '| Valley Clean Team');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changed++;
    console.log('Updated:', file);
  }
});

console.log('\nTotal files updated:', changed);
