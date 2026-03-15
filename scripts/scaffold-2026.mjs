import fs from 'fs';
import path from 'path';

const calendarPath = path.join(process.cwd(), 'docs', '2026-content-calendar.md');
const blogAstroPath = path.join(process.cwd(), 'src', 'pages', 'blog.astro');
const blogPagesDir = path.join(process.cwd(), 'src', 'pages', 'blog');

const calendarContent = fs.readFileSync(calendarPath, 'utf-8');
const lines = calendarContent.split('\n');

const posts = [];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

for (let line of lines) {
  if (!line.includes('**Week ') || !line.includes('📝')) continue;

  const dateMatch = line.match(/\*\*Week \d+ \((.*?)\):\*\*/);
  const locationMatch = line.match(/📝 \[([^\]]+)\]/);
  
  if (dateMatch && locationMatch) {
    const rawDate = dateMatch[1]; // e.g., "Mar 16"
    const location = locationMatch[2] || locationMatch[1]; // e.g., "Huntsville"
    
    // Parse the rest of the string: anything after `[Location] ` up to the first `*(`
    const titlePart = line.substring(line.indexOf(']') + 1).trim();
    let title = titlePart;
    let focus = "General Focus";
    
    const focusMatch = titlePart.match(/\*\((.*?)\)\*/);
    if (focusMatch) {
      focus = focusMatch[1].replace(' Focus', '').trim();
      title = titlePart.substring(0, titlePart.indexOf('*(')).trim();
    }
    
    // Some basic mapping for colors and icons
    let categoryColor = 'blue';
    let filterCategory = 'industry';
    let icon = 'lightbulb';
    
    if (focus.toLowerCase().includes('real estate') || focus.toLowerCase().includes('move-out')) {
      categoryColor = 'purple';
      filterCategory = 'move-out';
      icon = 'home';
    } else if (focus.toLowerCase().includes('seasonal') || focus.toLowerCase().includes('hosting') || focus.toLowerCase().includes('holiday')) {
      categoryColor = 'green';
      filterCategory = 'holiday';
      icon = 'gift';
    } else if (focus.toLowerCase().includes('health') || focus.toLowerCase().includes('pain point')) {
      categoryColor = 'teal';
      filterCategory = 'home-health';
      icon = 'heart';
    } else if (focus.toLowerCase().includes('commercial')) {
      categoryColor = 'indigo';
      filterCategory = 'industry';
      icon = 'building';
    } else if (location.toLowerCase() === 'nashville') {
       categoryColor = 'pink';
    }

    // e.g. "April 6, 2026"
    const fullDate = `${rawDate.replace('Mar', 'March')
                            .replace('Apr', 'April')
                            .replace('Jun', 'June')
                            .replace('Jul', 'July')
                            .replace('Aug', 'August')
                            .replace('Sep', 'September')
                            .replace('Oct', 'October')
                            .replace('Nov', 'November')
                            .replace('Dec', 'December')} 2026`;

    posts.push({
      date: fullDate,
      location,
      title,
      focus,
      slug: slugify(title),
      categoryColor,
      filterCategory,
      icon,
      excerpt: `Check back on ${fullDate} for our latest article covering ${title.toLowerCase()}.`
    });
  }
}

console.log(`Found ${posts.length} posts to scaffold.`);

// Create individual astro files
posts.forEach(post => {
  const fileContent = `---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SchemaMarkup from "../../components/SchemaMarkup.astro";
import Icon from "../../components/Icon.astro";

// Make this page dynamic via SSR
export const prerender = false;

const publishDate = new Date("${post.date}");
const author = "The Valley Clean Team";
const readTime = "5 min read";

const isPublished = new Date().getTime() >= publishDate.getTime();

// FAQ Schema data for AEO optimization
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: []
};
---

<BaseLayout
  title="${post.title.replace(/"/g, '&quot;')} | The Valley Clean Team"
  description={isPublished ? "Full Article: ${post.title.replace(/"/g, '&quot;')}" : "Coming Soon: ${post.title.replace(/"/g, '&quot;')}"}
  ogImage="https://storage.googleapis.com/msgsndr/iKQIBhpKVL2XVPgU7HMd/media/6920802945dc047d65b4ec5d.png"
>
  <SchemaMarkup
    type="article"
    title="${post.title.replace(/"/g, '&quot;')}"
    description={isPublished ? "Read our full guide to ${post.title.replace(/"/g, '&quot;')}" : "Coming Soon: ${post.title.replace(/"/g, '&quot;')}"}
    publishDate="${post.date}"
    author={author}
  />

  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />

  <!-- Hero Section -->
  <section class="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <span class="inline-block px-4 py-2 bg-[#FFA985]/20 text-[#FFA985] rounded-full text-sm font-medium mb-6">
          ${post.focus}
        </span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          ${post.title}
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {isPublished ? "Expert Cleaning Guide" : "Coming ${post.date}."}
        </p>
        <div class="flex items-center justify-center space-x-4 text-gray-400 mb-8">
          <span>${post.date}</span>
          <span>•</span>
          <span>{readTime}</span>
          <span>•</span>
          <span>By {author}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Content Toggle based on Published Date -->
  {isPublished ? (
    <article class="py-16 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg max-w-none">
          <!-- TODO: REPLACE THIS SECTION WITH YOUR ACTUAL BLOG CONTENT -->
          <h2>Article Draft Placeholder</h2>
          <p>This is where your drafted content will appear once the publish date has passed.</p>
        </div>
      </div>
    </article>
  ) : (
    <article class="py-16 bg-white border-t border-gray-100 shadow-inner">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-2xl">
        <div class="prose prose-lg max-w-none text-center">
          <Icon name="clock" class="w-16 h-16 text-[#FFA985] mx-auto mb-6" />
          <h2 class="text-3xl font-bold text-gray-800 mb-4 mt-0">Article Coming Soon!</h2>
          <p class="text-gray-600 m-0">This article is locked and scheduled to automatically publish on <br/><strong class="text-gray-800 text-xl">${post.date}</strong>.<br/>Check back then!</p>
          <div class="mt-12">
            <a href="/blog" class="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-[#FFA985] rounded-full hover:bg-[#ff9a70] transition shadow-md no-underline">
              Back to Blog
            </a>
          </div>
        </div>
      </div>
    </article>
  )}
</BaseLayout>
`;
  
  const astroPath = path.join(blogPagesDir, `${post.slug}.astro`);
  fs.writeFileSync(astroPath, fileContent, 'utf-8');
  console.log(`Overwrote: ${astroPath}`);
});

let blogAstroContent = fs.readFileSync(blogAstroPath, 'utf-8');

// Strip out any previous empty injections or old scaffold hooks
blogAstroContent = blogAstroContent.replace(/\/\/ 2026 Script Scaffolded Posts\s*\n/, '');

const additionalArrayObjects = posts.map(post => {
  return `  {
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    excerpt: "${post.excerpt.replace(/"/g, '\\"')}",
    category: "${post.focus}",
    filterCategory: "${post.filterCategory}",
    categoryColor: "${post.categoryColor}",
    date: "${post.date}",
    readTime: "5 min read",
    icon: "${post.icon}",
  },`;
}).join('\n');

const hookString = "export const prerender = false;\nconst allBlogPosts = [";
if (blogAstroContent.includes(hookString)) {
  blogAstroContent = blogAstroContent.replace(
    hookString,
    hookString + "\n  // 2026 Script Scaffolded Posts\n" + additionalArrayObjects
  );
  fs.writeFileSync(blogAstroPath, blogAstroContent, 'utf-8');
  console.log("Updated src/pages/blog.astro with 2026 posts!");
} else {
  console.log("Could not find allBlogPosts array in src/pages/blog.astro to inject.");
}
