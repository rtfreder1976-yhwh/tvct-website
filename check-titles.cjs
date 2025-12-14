const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }
  return files;
}

const files = findHtmlFiles('dist');
const tooLong = [];

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/<title>([^<]+)<\/title>/);
  if (match) {
    const title = match[1];
    if (title.length > 60) {
      const pagePath = file.split('dist')[1].replace(/\\/g, '/').replace('/index.html', '') || '/';
      tooLong.push({ page: pagePath, title, len: title.length });
    }
  }
});

tooLong.sort((a, b) => b.len - a.len);
console.log(`Pages with title > 60 chars: ${tooLong.length}\n`);
tooLong.forEach(p => {
  console.log(`${p.len} chars: ${p.page}`);
  console.log(`   "${p.title}"`);
  console.log('');
});
