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
import {readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, renameSync, unlinkSync, copyFileSync, statSync} from 'node:fs';
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

// LOCAL_META=true — use a local docs tarball (.releases-cache/local-test.tar.zst)
// as the current version.  Build it from meta-pantavisor with:
//   ./kas-container build ... -- -c create_pantacor_docs pantavisor-starter
const LOCAL_META = process.env.LOCAL_META;
const LOCAL_VERSION = 'local-test';

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

// Remove index landing pages from repos that should redirect to their first
// child section instead of showing a generic index. Override the auto-generated
// category page with a link to the overview doc so Docusaurus redirects there.
function removeIndexLandingPages(destRel) {
  const base = join(ROOT, destRel);
  // pantavisor repo: remove the root index and write a _category_.json that
  // redirects the top-level category to the overview doc.
  const pvIdx = join(base, 'pantavisor', 'index.md');
  if (existsSync(pvIdx)) {
    unlinkSync(pvIdx);
    console.log(`  (removed index landing page: ${destRel}/pantavisor/index.md)`);
  }
  const pvCat = join(base, 'pantavisor', '_category_.json');
  if (!existsSync(pvCat)) {
    writeFileSync(pvCat, JSON.stringify({
      link: {type: 'doc', id: 'pantavisor/overview/index'},
    }, null, 2) + '\n');
    console.log(`  (wrote _category_.json → ${destRel}/pantavisor/ redirects to pantavisor/overview)`);
  }
  // meta-pantavisor: remove the auto-generated root landing page (it shows up
  // as a separate sidebar entry that the user shouldn't see) and write a
  // _category_.json that links the top-level category to the overview doc.
  const metaIdx = join(base, 'meta-pantavisor', 'index.md');
  if (existsSync(metaIdx)) {
    unlinkSync(metaIdx);
    console.log(`  (removed index landing page: ${destRel}/meta-pantavisor/index.md)`);
  }
  const metaCat = join(base, 'meta-pantavisor', '_category_.json');
  if (!existsSync(metaCat)) {
    writeFileSync(metaCat, JSON.stringify({
      link: {type: 'doc', id: 'meta-pantavisor/overview/index'},
    }, null, 2) + '\n');
    console.log(`  (wrote _category_.json → ${destRel}/meta-pantavisor/ redirects to overview)`);
  }
}

// Merge docs from the local pvr source repo (../pvr/docs/) into reference/pvr/.
// The tarball only carries a single README.md for pvr; the full command reference
// lives in the source repo. Remove the tarball's README.md to avoid sidebar
// ordering conflicts — the source repo's simplified README is not in docs/.
function mergePvrDocs(destRel) {
  const pvrDocs = join(ROOT, '..', 'pvr', 'docs');
  if (!existsSync(pvrDocs)) {
    console.log('  (pvr source repo not found at ../pvr/docs, skipping)');
    return;
  }
  const pvrRef = join(ROOT, destRel, 'pvr');
  // Remove the tarball's README.md (it was replaced by docs/ structure)
  const tarballReadme = join(pvrRef, 'README.md');
  if (existsSync(tarballReadme)) {
    unlinkSync(tarballReadme);
    console.log(`  (removed tarball README.md from ${destRel}/pvr/)`);
  }
  const cmdSrc = join(pvrDocs, 'commands');
  if (existsSync(cmdSrc)) {
    for (const f of readdirSync(cmdSrc)) {
      if (!f.endsWith('.md')) continue;
      copyFileSync(join(cmdSrc, f), join(pvrRef, f));
    }
    console.log(`  (merged ${readdirSync(cmdSrc).filter(f => f.endsWith('.md')).length} pvr command docs into ${destRel}/pvr/)`);
  }
  // Copy top-level docs (index.md, getting-started.md, etc.)
  for (const f of readdirSync(pvrDocs)) {
    if (!f.endsWith('.md') || f === 'README.md') continue;
    const src = join(pvrDocs, f);
    if (statSync(src).isFile()) {
      copyFileSync(src, join(pvrRef, f));
    }
  }
}

const localTarball = join(CACHE, `${LOCAL_VERSION}.tar.zst`);

// LOCAL_META with a cached tarball — skip the remote manifest entirely
if (LOCAL_META && existsSync(localTarball)) {
  console.log('LOCAL_META: using local tarball, skipping remote manifest');
} else {
  console.log(`Fetching upstream manifest: ${cfg.manifest}`);
}
const manifest = LOCAL_META && existsSync(localTarball) ? {} : await fetchJson(cfg.manifest);

// Clean previous generated output so removed versions don't linger.
for (const d of ['reference', 'reference_versioned_docs', 'reference_versioned_sidebars']) {
  rmSync(join(ROOT, d), {recursive: true, force: true});
}

const frozen = [];

// If we have a local tarball, process it as current and we're done
if (LOCAL_META && existsSync(localTarball)) {
  await processLocalTarball(LOCAL_VERSION, localTarball);
} else {
  // Normal pipeline: process all versions from the manifest
  for (const version of versions) {
    console.log(`Release ${version}:`);
    const docs = findDocs(manifest, version);
    if (!docs) throw new Error(`No docs tarball for "${version}" in upstream manifest ${cfg.manifest}`);
    await ensureSource(version, docs);
    if (version === current) {
      migrate(version, 'reference');
      removeIndexLandingPages('reference');
      mergePvrDocs('reference');
    } else {
      migrate(version, join('reference_versioned_docs', `version-${version}`));
      removeIndexLandingPages(join('reference_versioned_docs', `version-${version}`));
      mergePvrDocs(join('reference_versioned_docs', `version-${version}`));
      frozen.push(version);
    }
  }
}

// Versioned sidebars (static autogenerated stub; keys must match sidebarsReference.ts).
const SIDEBAR_STUB = JSON.stringify({
  pantavisorSidebar: [{type: 'autogenerated', dirName: 'pantavisor'}],
  metaPantavisorGettingStartedSidebar: [
    {type: 'autogenerated', dirName: 'meta-pantavisor/getting-started'},
  ],
  metaPantavisorOverviewSidebar: [
    {type: 'autogenerated', dirName: 'meta-pantavisor/overview'},
  ],
  pvrSidebar: [{type: 'autogenerated', dirName: 'pvr'}],
}, null, 2);
if (frozen.length) {
  const dir = join(ROOT, 'reference_versioned_sidebars');
  mkdirSync(dir, {recursive: true});
  for (const v of frozen) writeFileSync(join(dir, `version-${v}-sidebars.json`), SIDEBAR_STUB + '\n');
}
writeFileSync(join(ROOT, 'reference_versions.json'), JSON.stringify(frozen, null, 0) + '\n');
console.log(`Wrote reference_versions.json: ${JSON.stringify(frozen)}`);

async function processLocalTarball(version, tarball) {
  console.log(`  using local tarball: ${tarball}`);
  const srcDir = join(ROOT, 'releases', version);
  extract(tarball, srcDir);
  migrate(version, 'reference');
  removeIndexLandingPages('reference');
  mergePvrDocs('reference');
}

console.log('Reference docs synced.');
