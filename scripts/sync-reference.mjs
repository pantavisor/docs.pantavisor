#!/usr/bin/env node
// Regenerates the versioned REFERENCE docs at build time. None of the output is
// committed — it is rebuilt on every `npm run build`.
//
//   node scripts/sync-reference.mjs
//
// We maintain the list of versions to publish in releases.json (`versions` +
// `current`). The upstream manifest (releases.json `manifest` URL) is the
// source for each version's docs tarball (url + sha256). For each version we:
//   1. resolve its docs tarball from the upstream manifest,
//   2. download (cached by sha256) and verify it,
//   3. extract + flatten a top-level docs/ wrapper into releases/<version>/,
//   4. run migrate-docs.js to produce:
//        - reference/                              (the `current` version)
//        - reference_versioned_docs/version-<v>/   (every other version)
// Then write reference_versioned_sidebars/* and reference_versions.json.
import {readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, renameSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const cfg = JSON.parse(readFileSync(join(ROOT, 'releases.json'), 'utf8'));

// DROP_VERSIONS=028-rc11,028-rc12 npm run build  — exclude versions locally without editing releases.json
const drop = new Set((process.env.DROP_VERSIONS ?? '').split(',').map(v => v.trim()).filter(Boolean));
if (drop.size) console.log(`Dropping versions (local override): ${[...drop].join(', ')}`);

let current = cfg.current;
let versions = (cfg.versions ?? []).filter(v => !drop.has(v));
if (drop.has(current)) current = versions[0];

if (!versions.length) { console.error('releases.json has no versions'); process.exit(1); }
if (!versions.includes(current)) { console.error(`releases.json current "${current}" not in versions`); process.exit(1); }

const CACHE = join(ROOT, '.releases-cache');
mkdirSync(CACHE, {recursive: true});

const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

async function downloadTo(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

// Find a version's docs artifact ({name,url,sha256}) anywhere in the upstream
// manifest. Handles two formats:
//   dict  (current): channel[version] = {release-date, devices, docs:{name,hash,url}}
//   array (legacy):  channel[version] = [{docs:{name,url,sha256}}, ...]
// Always returns a normalised {url, sha256, name} object or null.
function findDocs(manifest, version) {
  for (const channel of Object.values(manifest)) {
    const entry = channel?.[version];
    if (!entry) continue;
    let d = null;
    if (!Array.isArray(entry) && entry.docs?.url) {
      d = entry.docs;
    } else if (Array.isArray(entry)) {
      d = entry.find(e => e?.docs?.url)?.docs ?? null;
    }
    if (d) return {url: d.url, sha256: d.sha256 ?? d.hash, name: d.name};
  }
  return null;
}

// Extract a .tar.gz/.tar.zst into destDir, flattening a top-level docs/ wrapper
// so destDir directly holds meta-pantavisor/, pantavisor/, …
function extract(tarball, destDir) {
  rmSync(destDir, {recursive: true, force: true});
  mkdirSync(destDir, {recursive: true});
  const args = tarball.endsWith('.zst')
    ? ['-I', 'zstd', '-xf', tarball, '-C', destDir]
    : ['-xzf', tarball, '-C', destDir];
  execFileSync('tar', args, {stdio: 'inherit'});
  const wrapper = join(destDir, 'docs');
  if (existsSync(wrapper) && !existsSync(join(destDir, 'meta-pantavisor'))) {
    for (const name of readdirSync(wrapper)) renameSync(join(wrapper, name), join(destDir, name));
    rmSync(wrapper, {recursive: true, force: true});
  }
}

async function ensureSource(version, docs) {
  const ext = docs.url.endsWith('.zst') ? 'tar.zst' : 'tar.gz';
  const cacheFile = join(CACHE, `${version}.${ext}`);
  if (!(existsSync(cacheFile) && docs.sha256 && sha256(cacheFile) === docs.sha256)) {
    console.log(`  downloading ${docs.url}`);
    await downloadTo(docs.url, cacheFile);
    if (docs.sha256) {
      const got = sha256(cacheFile);
      if (got !== docs.sha256) throw new Error(`sha256 mismatch for ${version}: expected ${docs.sha256}, got ${got}`);
      console.log('  sha256 OK');
    } else {
      console.warn(`  WARNING: upstream manifest has no sha256 for ${version}`);
    }
  } else {
    console.log(`  using cached ${cacheFile} (sha256 OK)`);
  }
  const srcDir = join(ROOT, 'releases', version);
  extract(cacheFile, srcDir);
  return srcDir;
}

function migrate(version, destRel) {
  execFileSync('node', [join(ROOT, 'migrate-docs.js'), join(ROOT, 'releases', version), join(ROOT, destRel)], {stdio: 'inherit'});
}

console.log(`Fetching upstream manifest: ${cfg.manifest}`);
const manifest = await fetchJson(cfg.manifest);

// Clean previous generated output so removed versions don't linger.
for (const d of ['reference', 'reference_versioned_docs', 'reference_versioned_sidebars']) {
  rmSync(join(ROOT, d), {recursive: true, force: true});
}

const frozen = [];
for (const version of versions) {
  const docs = findDocs(manifest, version);
  if (!docs) throw new Error(`No docs tarball for "${version}" in upstream manifest ${cfg.manifest}`);
  console.log(`Release ${version}${version === current ? ' (current)' : ''}:`);
  await ensureSource(version, docs);
  if (version === current) migrate(version, 'reference');
  else { migrate(version, join('reference_versioned_docs', `version-${version}`)); frozen.push(version); }
}

// Versioned sidebars (static autogenerated stub; keys must match sidebarsReference.ts).
const SIDEBAR_STUB = JSON.stringify({
  pantavisorSidebar: [{type: 'autogenerated', dirName: 'pantavisor'}],
  metaPantavisorSidebar: [{type: 'autogenerated', dirName: 'meta-pantavisor'}],
  pvrSidebar: [{type: 'autogenerated', dirName: 'pvr'}],
}, null, 2);
if (frozen.length) {
  const dir = join(ROOT, 'reference_versioned_sidebars');
  mkdirSync(dir, {recursive: true});
  for (const v of frozen) writeFileSync(join(dir, `version-${v}-sidebars.json`), SIDEBAR_STUB + '\n');
}
writeFileSync(join(ROOT, 'reference_versions.json'), JSON.stringify(frozen, null, 0) + '\n');
console.log(`Wrote reference_versions.json: ${JSON.stringify(frozen)}`);
console.log('Reference docs synced.');
