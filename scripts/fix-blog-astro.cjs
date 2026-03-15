const fs = require('fs');
let b = fs.readFileSync('src/pages/blog.astro', 'utf8');
const oldStr = 'const blogPosts = allBlogPosts.filter(post => new Date(post.date) <= new Date());\\n\\n// Filter categories for the sidebar\\nconst filterCategories = [';
const newStr = `const blogPosts = allBlogPosts.filter(post => {
  let postDateStr = post.date;
  if (postDateStr.includes(' ') && !postDateStr.includes(',')) {
    postDateStr = postDateStr.replace(/(\\w+ \\d+) (\\d+)/, "$1, $2");
  }
  return new Date(postDateStr).getTime() <= new Date().getTime();
});

// Filter categories for the sidebar
const filterCategories = [`;

b = b.replace(oldStr, newStr);

// Let's also sort them by date descending
const sortPatchOld = `const filterCategories = [`;
const sortPatchNew = `// Sort descending
blogPosts.sort((a,b) => {
  let dateA = a.date.includes(' ') && !a.date.includes(',') ? a.date.replace(/(\\w+ \\d+) (\\d+)/, "$1, $2") : a.date;
  let dateB = b.date.includes(' ') && !b.date.includes(',') ? b.date.replace(/(\\w+ \\d+) (\\d+)/, "$1, $2") : b.date;
  return new Date(dateB).getTime() - new Date(dateA).getTime();
});

const filterCategories = [`;
b = b.replace(sortPatchOld, sortPatchNew);

fs.writeFileSync('src/pages/blog.astro', b);
console.log("Fixed!");
