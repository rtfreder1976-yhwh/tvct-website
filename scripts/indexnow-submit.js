/**
 * IndexNow Batch Submission Script
 * Submits all site URLs to IndexNow for faster indexing
 * 
 * Usage: node scripts/indexnow-submit.js
 * 
 * Run after deployment to notify search engines of new/updated pages
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  siteUrl: 'https://thevalleycleanteam.com',
  apiKey: 'f7a3e9c1b5d2f8a4e6c0b3d7f9a2e5c1',
  keyLocation: 'https://thevalleycleanteam.com/f7a3e9c1b5d2f8a4e6c0b3d7f9a2e5c1.txt',
  searchEngine: 'api.indexnow.org', // Also works: www.bing.com, yandex.com
};

// Collect all .astro pages from src/pages
function collectPages(dir, baseRoute = '') {
  const pages = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Recurse into subdirectories
      pages.push(...collectPages(fullPath, `${baseRoute}/${item.name}`));
    } else if (item.name.endsWith('.astro')) {
      // Convert filename to URL
      let route = baseRoute;
      if (item.name === 'index.astro') {
        route = baseRoute || '/';
      } else {
        route = `${baseRoute}/${item.name.replace('.astro', '')}`;
      }
      pages.push(route);
    }
  }

  return pages;
}

// Submit URLs to IndexNow
async function submitToIndexNow(urls) {
  const payload = JSON.stringify({
    host: CONFIG.siteUrl.replace('https://', ''),
    key: CONFIG.apiKey,
    keyLocation: CONFIG.keyLocation,
    urlList: urls.map(url => `${CONFIG.siteUrl}${url}/`)
  });

  const options = {
    hostname: CONFIG.searchEngine,
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          message: getStatusMessage(res.statusCode),
          data
        });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getStatusMessage(code) {
  const messages = {
    200: 'OK - URLs submitted successfully',
    202: 'Accepted - URLs accepted for processing',
    400: 'Bad Request - Invalid format',
    403: 'Forbidden - Key not valid or not matching',
    422: 'Unprocessable Entity - URLs not valid',
    429: 'Too Many Requests - Rate limited'
  };
  return messages[code] || `Unknown status: ${code}`;
}

// Main execution
async function main() {
  console.log('🔍 IndexNow Batch Submission');
  console.log('============================\n');

  // Collect pages
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  const pages = collectPages(pagesDir);
  
  console.log(`📄 Found ${pages.length} pages to submit\n`);

  // IndexNow allows up to 10,000 URLs per request, but let's batch by 100
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < pages.length; i += batchSize) {
    batches.push(pages.slice(i, i + batchSize));
  }

  console.log(`📦 Split into ${batches.length} batch(es)\n`);

  // Submit each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)...`);
    
    try {
      const result = await submitToIndexNow(batch);
      console.log(`   Status: ${result.statusCode} - ${result.message}`);
      
      if (result.statusCode === 200 || result.statusCode === 202) {
        console.log(`   ✅ Success!\n`);
      } else {
        console.log(`   ⚠️ Issue detected. Response: ${result.data}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Small delay between batches
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('============================');
  console.log('✅ Submission complete!\n');
  
  // List all submitted URLs
  console.log('📋 URLs submitted:');
  pages.forEach(page => {
    console.log(`   ${CONFIG.siteUrl}${page}/`);
  });
}

main().catch(console.error);
