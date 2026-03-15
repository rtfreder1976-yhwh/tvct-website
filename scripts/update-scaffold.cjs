const fs = require('fs');
const path = require('path');

let script = fs.readFileSync('scripts/scaffold-2026.mjs', 'utf8');

const oldFileContentMatch = script.match(/const fileContent = `---[\\s\\S]*?\\n\`;\\s+const astroPath = path\.join\(blogPagesDir, \\`\${post\.slug}\.astro\\`\);/);

if (!oldFileContentMatch) {
  console.log("Could not find the fileContent block");
  process.exit(1);
}

const oldFileContent = oldFileContentMatch[0];

const newFileContent = `const fileContent = \`---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SchemaMarkup from "../../components/SchemaMarkup.astro";
import Icon from "../../components/Icon.astro";

// Make this page dynamic
export const prerender = false;

const rawDate = "\${post.date}";
const publishDateStr = rawDate.includes(" ") && !rawDate.includes(",") 
  ? rawDate.replace(/(\\w+ \\d+) (\\d+)/, "$1, $2")
  : rawDate;

const publishDate = new Date(publishDateStr);
const author = "The Valley Clean Team";
const readTime = "5 min read";
const isPublished = new Date() >= publishDate;

// FAQ Schema data for AEO optimization
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: []
};
---

<BaseLayout
  title="\${post.title.replace(/"/g, '&quot;')} | The Valley Clean Team"
  description={isPublished ? "Full Article: \${post.title.replace(/"/g, '&quot;')}" : "Coming Soon: \${post.title.replace(/"/g, '&quot;')}"}
  ogImage="https://storage.googleapis.com/msgsndr/iKQIBhpKVL2XVPgU7HMd/media/6920802945dc047d65b4ec5d.png"
>
  <SchemaMarkup
    type="article"
    title="\${post.title.replace(/"/g, '&quot;')}"
    description={isPublished ? "Read our full guide to \${post.title.replace(/"/g, '&quot;')}" : "Coming Soon: \${post.title.replace(/"/g, '&quot;')}"}
    publishDate={publishDateStr}
    author={author}
  />

  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />

  <!-- Hero Section -->
  <section class="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <span class="inline-block px-4 py-2 bg-[#FFA985]/20 text-[#FFA985] rounded-full text-sm font-medium mb-6">
          \${post.focus}
        </span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          \${post.title}
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {isPublished ? "Expert Cleaning Guide" : "Coming \${post.date}."}
        </p>
        <div class="flex items-center justify-center space-x-4 text-gray-400 mb-8">
          <span>{publishDateStr}</span>
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
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Article Coming Soon!</h2>
          <p class="text-gray-600">This article is locked and scheduled to automatically publish on <strong class="text-gray-800">\${post.date}</strong>. Check back then!</p>
          <div class="mt-12">
            <a href="/blog" class="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-[#FFA985] rounded-full hover:bg-[#ff9a70] transition shadow-md">
              <Icon name="arrow-left" class="w-5 h-5 mr-2" /> Back to Blog
            </a>
          </div>
        </div>
      </div>
    </article>
  )}
</BaseLayout>
\`;

  const astroPath = path.join(blogPagesDir, \`\${post.slug}.astro\`);`;

script = script.replace(oldFileContent, newFileContent);

// Remove the condition that ignores existing files so it forces an override
script = script.replace('if (!fs.existsSync(astroPath)) {', 'if (true) {');

fs.writeFileSync('scripts/scaffold-2026.mjs', script);
console.log("Updated scaffold script.");
