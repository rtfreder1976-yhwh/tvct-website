import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const MAX_CONCURRENT = 3;      // Number of articles to generate in parallel
const MAX_TOTAL = 42;          // Max number of files to process per run (set lower to test)
const MODEL = "gpt-4o";        // Recommended model for writing long-form content


// Ensure an API key is present
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY environment variable is not set.");
  console.log("👉 How to run this script:");
  console.log('   In Windows PowerShell:');
  console.log('   $env:OPENAI_API_KEY="your-api-key-here"');
  console.log('   node scripts/generate-all-content.mjs');
  console.log('');
  console.log('   In Mac/Linux terminal:');
  console.log('   OPENAI_API_KEY="your-api-key-here" node scripts/generate-all-content.mjs');
  process.exit(1);
}

// Ensure required files/directories exist
const blogDir = path.join(process.cwd(), 'src', 'pages', 'blog');
const brandVoicePath = path.join(process.cwd(), 'docs', 'rules', 'brand-voice-elevated-direct-response.md');

if (!fs.existsSync(blogDir)) {
  console.error(`❌ ERROR: Could not find blog directory at ${blogDir}`);
  process.exit(1);
}

// Load Brand Voice Rules
let brandVoice = "";
if (fs.existsSync(brandVoicePath)) {
  brandVoice = fs.readFileSync(brandVoicePath, 'utf-8');
} else {
  console.warn("⚠️ Warning: Could not find brand-voice-elevated-direct-response.md. Generating without strict brand rules.");
}

// The target replacement string that means this file is still a draft
const DRAFT_MARKER = '<h2>Article Draft Placeholder</h2>';
const FULL_MARKER_REGEX = /<h2>Article Draft Placeholder<\/h2>\s*<p>This is where your drafted content will appear once the publish date has passed\.<\/p>/;

async function generateArticleContent(title, focus, location, publishDate) {
  const systemPrompt = `You are an elite, veteran-owned cleaning company copywriter writing SEO/AEO optimized blog articles.
You write in HTML designed to be dropped directly into an Astro <article> container. NO markdown wrappers, NO \`\`\`html tags. JUST raw HTML elements (<h2>, <p>, <ul>, <strong>, etc).

CRITICAL BRAND VOICE RULES:
${brandVoice}

ARTICLE REQUIREMENTS:
- **Title:** The article is about "${title}". Focus category: "${focus}". Local Location: "${location}". 
- **Length:** Write a comprehensive, highly-valuable ~800 to 1200 word article.
- **AEO (Answer Engine Optimization) Structure:** 
  1. Start with a <h2> that asks the exact primary question or states the exact problem.
  2. Follow immediately with a bold, 2-3 sentence direct answer (Direct Answer Block).
  3. Then transition into the full article with proper <h3> and <h4> headings.
- **Local Context:** Naturally drop the location "${location}" (if not generic) and surrounding areas a few times so local search engines pick it up.
- **Formatting:** Use short paragraphs (2-3 sentences max). Use bullet points and bolding for scannability.
- **CTA:** End the article with a powerful, direct <h3> call to action telling them to reclaim their time and book a guaranteed clean with The Valley Clean Team today.

Do NOT include an <h1>. Do NOT wrap the output in a markdown block. Output ONLY the internal HTML of the article body.`;

  const userPrompt = `Please write the full blog article for the post titled: "${title}".`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error(`❌ Failed to generate content for "${title}":`, error.message);
    return null;
  }
}

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes(DRAFT_MARKER)) {
    return false; // Already processed
  }

  // Extract metadata dynamically from the astro file contents
  const titleMatch = content.match(/title="([^"]+) \| The Valley Clean Team"/);
  const focusMatch = content.match(/<span[^>]*>\s*([^\n<]+)\s*<\/span>\s*<h1/);
  const dateMatch = content.match(/const publishDate = new Date\("([^"]+)"\);/);
  
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.astro').replace(/-/g, ' ');
  const focus = focusMatch ? focusMatch[1].trim() : "General Cleaning";
  const publishDate = dateMatch ? dateMatch[1] : "Future Date";
  
  // Try to guess location from Title or Context
  let location = "The Shoals & Surrounding Areas";
  const locMatch = title.match(/Athens|Nashville|Birmingham|Huntsville|Florence|Madison/i);
  if (locMatch) location = locMatch[0];

  console.log(`\n⏳ Generating: "${title}" (${focus})`);
  
  const generatedHtml = await generateArticleContent(title, focus, location, publishDate);
  if (!generatedHtml) return false;

  // Replace the placeholder
  const updatedContent = content.replace(FULL_MARKER_REGEX, generatedHtml);
  
  // Failsafe if regex didn't match perfectly
  if (updatedContent === content) {
    content = content.replace(DRAFT_MARKER, generatedHtml);
  }

  fs.writeFileSync(filePath, updatedContent === content ? content : updatedContent, 'utf-8');
  console.log(`✅ Success: Updated ${path.basename(filePath)}`);
  return true;
}

// MAIN EXECUTION
async function run() {
  console.log("🚀 Starting Bulk Content Generation Pipeline...");
  
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.astro'));
  const filesToProcess = [];

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(DRAFT_MARKER)) {
      filesToProcess.push(filePath);
    }
  }

  const toRun = filesToProcess.slice(0, MAX_TOTAL);
  console.log(`Found ${filesToProcess.length} drafts needing content. Processing ${toRun.length}...`);

  // Run in sequence with delay
  for (let i = 0; i < toRun.length; i++) {
    const filePath = toRun[i];
    await processFile(filePath);
    if (i < toRun.length - 1) {
      console.log("⏱️  Waiting 3 seconds to avoid OpenAI rate limits...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log("🎉 Bulk Content Generation complete!");
}

run().catch(console.error);
