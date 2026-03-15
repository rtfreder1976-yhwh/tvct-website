import fs from 'fs';
const content = fs.readFileSync('docs/2026-content-calendar.md', 'utf-8');
const lines = content.split('\n');
// Less strict regex
const regex = /\*\s+\*\*Week\s+\d+\s+\(([^)]+)\):\*\*\s+📝\s+\[([^\]]+)\]\s+([^\*]+)\s*\(\*(.*?)\*\)/;
let count = 0;
for (let line of lines) {
  if (regex.test(line)) {
    count++;
  } else if (line.includes('Week ') && line.includes('📝')) {
    console.log("Failed line: ", line);
  }
}
console.log(`Matched ${count} lines`);
