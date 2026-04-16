const fs = require('fs');
const path = require('path');

const baseDir = 'src/pages/locations';

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (f.endsWith('.astro')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const titleMatch = content.match(/title="([^"]+)"/);
      const descMatch = content.match(/description="([^"]+)"/);
      
      if (titleMatch || descMatch) {
        const title = titleMatch ? titleMatch[1] : '';
        const desc = descMatch ? descMatch[1] : '';
        
        if (title.length < 30 || title.length > 60 || desc.length < 120 || desc.length > 160) {
           console.log(`${fullPath}:`);
           if (title.length < 30 || title.length > 60) console.log(`  Title (${title.length}): "${title}" [FLAGGED]`);
           else console.log(`  Title (${title.length}): "${title}"`);
           
           if (desc.length < 120 || desc.length > 160) console.log(`  Desc (${desc.length}): "${desc}" [FLAGGED]`);
           else console.log(`  Desc (${desc.length}): "${desc}"`);
        }
      }
    }
  });
}

walk(baseDir);
