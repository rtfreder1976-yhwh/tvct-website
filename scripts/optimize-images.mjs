import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = './src';
const publicImgDir = './public/images';
const oldToNewPaths = new Map();

async function getFiles(dir, exts) {
  if (!fsSync.existsSync(dir)) return [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.join(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res, exts) : res;
  }));
  return Array.prototype.concat(...files).filter(f => !exts || exts.some(ext => f.endsWith(ext)));
}

async function optimizeImages() {
  console.log('Finding images to optimize...');
  const imageFiles = await getFiles(publicImgDir, ['.png', '.jpg', '.jpeg']);
  console.log(`Found ${imageFiles.length} images.`);
  
  for (const file of imageFiles) {
    const parsed = path.parse(file);
    const newPath = path.join(parsed.dir, `${parsed.name}.webp`);
    
    // Relative path used in Astro components: /images/...
    const publicPath = '/images' + file.split('images')[1].replace(/\\/g, '/');
    const newPublicPath = '/images' + newPath.split('images')[1].replace(/\\/g, '/');
    
    // Resize if too large
    let image = sharp(file);
    const metadata = await image.metadata();
    
    // If it's very large, scale it down relatively
    if (metadata.width > 2000) {
        image = image.resize({ width: 2000, withoutEnlargement: true });
    }
    
    await image
      .webp({ quality: 80, effort: 6 })
      .toFile(newPath);
      
    await fs.unlink(file);
    console.log(`Converted ${publicPath} -> ${newPublicPath}`);
    oldToNewPaths.set(publicPath, newPublicPath);
  }

  console.log('Updating references in src directory...');
  // now replace in src
  const srcFiles = await getFiles(srcDir, ['.astro', '.html', '.md', '.tsx', '.jsx', '.json']);
  for (const file of srcFiles) {
     let content = await fs.readFile(file, 'utf8');
     let changed = false;
     for (const [oldPath, newPath] of oldToNewPaths.entries()) {
         if (content.includes(oldPath)) {
            content = content.replaceAll(oldPath, newPath);
            changed = true;
         }
         const oldPathNoSlash = oldPath.substring(1);
         const newPathNoSlash = newPath.substring(1);
         if (content.includes(oldPathNoSlash)) {
            content = content.replaceAll(oldPathNoSlash, newPathNoSlash);
            changed = true;
         }
     }
     if (changed) {
         await fs.writeFile(file, content, 'utf8');
         console.log(`Updated references in ${file}`);
     }
  }
}

optimizeImages().then(() => console.log('Done!')).catch(console.error);
