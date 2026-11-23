// gta6-meme-x-01 entry: the entry is the X post itself. This program's only
// job is to hand the gate the post's address: it copies POST.json from the
// repository root (the bot dir) into the output dir, where the house reads
// it, fetches the post from X, and gives its picture and text to the judge.
//
// Local stand-ins outside the grader's container:
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Fail loudly on a malformed hand-in instead of copying it through: the
// gate refuses a POST.json whose url is not an X post address, so catch
// that here where the message is readable.
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`POST.json at ${source} does not read as JSON: ${(err as Error).message}`);
  process.exit(1);
}
const url = typeof post.url === 'string' ? post.url : '';
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(url)) {
  console.error(`POST.json url is not an X post address: ${url || '(missing)'}`);
  process.exit(1);
}

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy ${source} to ${target}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`handed in post: ${url}`);
