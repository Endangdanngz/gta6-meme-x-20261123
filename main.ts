// gta6-meme-x-01 entry: the entry is the X post itself. This program's only
// job is to hand the gate the post's address: it copies POST.json from the
// repository root (the bot dir) into the output dir, where the house reads
// it, fetches the post from X, and gives its picture and text to the judge.
//
// Local stand-ins outside the grader's container:
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');
try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy ${source} to ${target}: ${(err as Error).message}`);
  process.exit(1);
}
