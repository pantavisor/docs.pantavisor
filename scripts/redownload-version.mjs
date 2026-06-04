#!/usr/bin/env node
// Force re-download of one or more reference doc versions.
// Clears the cached tarball and extracted release directory for each version,
// then re-runs sync-reference.mjs so they are fetched fresh from S3.
//
// Usage:
//   node scripts/redownload-version.mjs               # interactive: pick from releases.json
//   node scripts/redownload-version.mjs 028-rc12       # specific version
//   node scripts/redownload-version.mjs 028-rc11 028-rc12

import { readFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const ROOT = new URL('..', import.meta.url).pathname;
const cfg = JSON.parse(readFileSync(join(ROOT, 'releases.json'), 'utf8'));
const available = cfg.versions ?? [];

async function pickVersions() {
  console.log('Available versions:');
  available.forEach((v, i) => console.log(`  ${i + 1}) ${v}${v === cfg.current ? ' (current)' : ''}`));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(r => rl.question('Enter number(s) or version name(s) [space-separated]: ', r));
  rl.close();
  return answer.trim().split(/\s+/).map(tok => {
    const n = parseInt(tok, 10);
    return (!isNaN(n) && n >= 1 && n <= available.length) ? available[n - 1] : tok;
  });
}

const args = process.argv.slice(2);
const targets = args.length ? args : await pickVersions();

const invalid = targets.filter(v => !available.includes(v));
if (invalid.length) { console.error(`Unknown version(s): ${invalid.join(', ')}`); process.exit(1); }

for (const version of targets) {
  for (const ext of ['tar.gz', 'tar.zst']) {
    const cached = join(ROOT, '.releases-cache', `${version}.${ext}`);
    if (existsSync(cached)) { rmSync(cached); console.log(`  cleared cache: ${cached}`); }
  }
  const extracted = join(ROOT, 'releases', version);
  if (existsSync(extracted)) { rmSync(extracted, { recursive: true }); console.log(`  cleared extracted: ${extracted}`); }
}

console.log(`\nRe-fetching: ${targets.join(', ')} …`);
execFileSync('node', [join(ROOT, 'scripts', 'sync-reference.mjs')], { stdio: 'inherit' });
