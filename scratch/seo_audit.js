import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.astro')) {
      files.push(name);
    }
  }
  return files;
}

async function auditSEO() {
  const files = getFiles('src/pages');
  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Extract title
    let title = '';
    const inlineTitleMatch = content.match(/title="([^"]+)"/);
    if (inlineTitleMatch) {
      title = inlineTitleMatch[1];
    } else {
      const varTitleMatch = content.match(/const title\s*=\s*(?:"|'|`)([^"'`]+)(?:"|'|`)/i);
      if (varTitleMatch) title = varTitleMatch[1];
    }

    // Extract description
    let description = '';
    const inlineDescMatch = content.match(/description="([^"]+)"/);
    if (inlineDescMatch) {
      description = inlineDescMatch[1];
    } else {
      const varDescMatch = content.match(/const description\s*=\s*(?:"|'|`)([^"'`]+)(?:"|'|`)/i);
      if (varDescMatch) description = varDescMatch[1];
    }

    if (title || description) {
      results.push({
        file: file.replace('src\\pages\\', ''),
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length
      });
    }
  }

  // Filter for issues
  const issues = results.filter(r => r.titleLength > 60 || r.descriptionLength < 120 || r.descriptionLength > 160);

  console.log('--- SEO Audit Results (Outliers) ---');
  issues.forEach(r => {
    console.log(`\nFile: ${r.file}`);
    if (r.titleLength > 60) {
      console.log(`[TITLE TOO LONG] (${r.titleLength} chars): "${r.title}"`);
    }
    if (r.descriptionLength < 120) {
      console.log(`[DESC TOO SHORT] (${r.descriptionLength} chars): "${r.description}"`);
    } else if (r.descriptionLength > 160) {
      console.log(`[DESC TOO LONG] (${r.descriptionLength} chars): "${r.description}"`);
    }
  });
}

auditSEO();
