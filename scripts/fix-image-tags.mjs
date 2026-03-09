import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = './src';
const publicDir = './public';

async function getFiles(dir, exts) {
  if (!fsSync.existsSync(dir)) return [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.join(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res, exts) : res;
  }));
  return Array.prototype.concat(...files).filter(f => !exts || exts.some(ext => f.endsWith(ext)));
}

async function fixImageTags() {
  const files = await getFiles(srcDir, ['.astro', '.html', '.jsx', '.tsx']);
  let totalFixed = 0;

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    
    const imgRegex = /<img[^>]+>/g;
    const matches = [...content.matchAll(imgRegex)];
    let isModified = false;

    // Process from end to start to avoid index issues if we were replacing by index,
    // but we use simple string replacement since tags are usually unique or first match is fine.
    // However, if we have two identical tags, `replace(fullTag, newTag)` replaces the first one, which is safe.
    for (const match of matches) {
      const fullTag = match[0];
      
      // Skip tracking pixel
      if (fullTag.includes('display:none') || fullTag.includes('height="1"')) continue;
      
      let srcMatch = fullTag.match(/src=["'](.*?)["']/);
      if (!srcMatch) continue;
      
      let src = srcMatch[1];
      if (src.startsWith('http')) continue;
      
      let localPath = path.join(publicDir, src);
      if (!fsSync.existsSync(localPath)) continue;
      
      let widthMatch = fullTag.match(/width=["'](\d+)["']/);
      let heightMatch = fullTag.match(/height=["'](\d+)["']/);
      
      let w = widthMatch ? widthMatch[1] : null;
      let h = heightMatch ? heightMatch[1] : null;
      
      let newTag = fullTag;
      
      try {
        if (!w || !h) {
            const metadata = await sharp(localPath).metadata();
            if (metadata.width && metadata.height) {
                if (!w) {
                    newTag = newTag.replace(/<img([\s]+)/, `<img$1width="${metadata.width}" `);
                }
                if (!h) {
                    newTag = newTag.replace(/<img([\s]+)/, `<img$1height="${metadata.height}" `);
                }
            }
        }
        
        if (!newTag.includes('loading=') && !newTag.includes('hero') && !newTag.includes('banner')) {
            newTag = newTag.replace(/<img([\s]+)/, `<img$1loading="lazy" `);
        }

        if (newTag !== fullTag) {
            content = content.replace(fullTag, newTag);
            isModified = true;
        }
      } catch (err) {
        console.warn(`Error processing ${localPath}: ${err.message}`);
      }
    }
    
    if (isModified) {
       await fs.writeFile(file, content, 'utf8');
       totalFixed++;
       console.log(`Updated images in ${file}`);
    }
  }
  
  console.log(`Fixed images in ${totalFixed} files.`);
}

fixImageTags().catch(console.error);
