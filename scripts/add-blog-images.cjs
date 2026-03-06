const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/blog.astro');
let content = fs.readFileSync(file, 'utf8');

const images = [
    "/images/gallery/bathroom.webp",
    "/images/gallery/kitchen.webp",
    "/images/gallery/move_out.webp",
    "/images/hero-400w.avif",
    "/images/services/Cleaningpic11-301.png",
    "/images/services/Cleaningpic12-303.png",
    "/images/services/Cleaningpic13-309.png",
    "/images/services/Cleaningpic15-312.png",
    "/images/services/Cleaningpic16-310.png",
    "/images/services/Cleaningpic17-302.png",
    "/images/services/Cleaningpic2--1--307.png",
    "/images/services/Cleaningpic3-308.png",
    "/images/services/Cleaningpic4-306.png",
    "/images/services/Cleaningpic6-305.png",
    "/images/services/Cleaningpic7-300.png",
    "/images/services/Cleaningpic8-311.png",
    "/images/services/Cleaningpic9-304.png",
    "/images/gallery/move_out.webp", // reuse
    "/images/gallery/kitchen.webp", // reuse
    "/images/gallery/bathroom.webp", // reuse
    "/images/hero-1280w.avif" // reuse
];

let imageIndex = 0;

// Regular expression to match an object in the 'blogPosts' array
// We look for 'icon: "something",' and check if it's already followed by 'image:'
// Actually simpler: we can just match `icon: "...",` using global regex and a replacer function
// The replacer function will check if the next non-whitespace keyword is `image:`.
// If not, we inject the image.

content = content.replace(/(icon:\s*"[^"]+",?)/g, (match, offset, string) => {
    // Check what comes after this match to see if 'image' is already there
    const afterMatch = content.substring(offset + match.length, offset + match.length + 30);
    if (afterMatch.trim().startsWith('image:')) {
        return match; // Already has an image
    }

    if (imageIndex < images.length) {
        const replacement = `${match}\n    image: "${images[imageIndex]}",`;
        imageIndex++;
        return replacement;
    }

    return match;
});

fs.writeFileSync(file, content, 'utf8');
console.log(`Added ${imageIndex} images to blog posts.`);
