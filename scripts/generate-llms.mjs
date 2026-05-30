#!/usr/bin/env node
// Generates llms.txt (curated link index, per llmstxt.org) and llms-full.txt
// (all curated docs concatenated — the AI-era "mega-manual"). Run before build;
// output lands in static/ so Docusaurus serves it at the site root.
//
//   node scripts/generate-llms.mjs
//
// Only the CURATED instance is included: it is the versionless, authoritative
// narrative. The generated, versioned reference is intentionally excluded to
// keep the AI surface stable and version-agnostic.
import {readFileSync, writeFileSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CURATED = join(ROOT, 'curated');
const STATIC = join(ROOT, 'static');
// Must match docusaurus.config.ts url + baseUrl. Switch to
// 'https://docs.pantavisor.io' when the canonical domain goes live.
const SITE = 'https://pantavisor.github.io/docs.pantavisor';

// Section order + labels mirror the curated information architecture.
const SECTIONS = [
  ['start', 'Start'],
  ['concepts', 'Concepts'],
  ['build', 'Build with Yocto'],
  ['install', 'Install on hardware'],
  ['develop', 'Develop applications'],
  ['operate', 'Operate devices'],
  ['troubleshooting', 'Troubleshooting'],
  ['migrate', 'Migrate to Pantavisor'],
  ['benchmarks', 'Benchmarks and comparisons'],
  ['security', 'Security and compliance'],
  ['community', 'Community'],
  ['licensing', 'Project, licensing, and governance'],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(p);
  }
  return out.sort();
}

function parseFrontmatter(raw) {
  const fm = {};
  let body = raw;
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end !== -1) {
      for (const line of raw.slice(3, end).split('\n')) {
        const m = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
        if (m) fm[m[1]] = m[2].trim().replace(/^["'](.*)["']$/, '$1');
      }
      body = raw.slice(end + 4).replace(/^\s+/, '');
    }
  }
  return {fm, body};
}

// Map a curated file path to its site URL (mirrors Docusaurus routing:
// index.md → folder root, custom `slug` honored).
function toUrl(file, fm) {
  if (fm.slug) return SITE + (fm.slug === '/' ? '' : fm.slug);
  let rel = relative(CURATED, file).split(sep).join('/').replace(/\.mdx?$/, '');
  rel = rel.replace(/\/index$/, '').replace(/^index$/, '');
  return SITE + '/' + rel;
}

const files = walk(CURATED).map((f) => {
  const raw = readFileSync(f, 'utf8');
  const {fm, body} = parseFrontmatter(raw);
  const title = fm.title || (body.match(/^#\s+(.+)$/m)?.[1] ?? '(untitled)');
  const section = relative(CURATED, f).split(sep)[0];
  return {file: f, url: toUrl(f, fm), title, description: fm.description || '', section, body};
});

// ── llms.txt — concise link index ──────────────────────────────────────────
let idx = `# Pantavisor\n\n`;
idx += `> Pantavisor is PID 1 and owns the full device update — base/BSP, kernel, app containers, and config — as one signed, content-addressed revision. It replaces Mender, RAUC, and SWUpdate rather than layering on them.\n\n`;
idx += `This is the curated, versionless documentation. Generated, per-release reference lives under ${SITE}/reference.\n\n`;

const home = files.find((f) => f.section === 'index' || f.url === SITE);
for (const [dir, label] of SECTIONS) {
  const inSection = files.filter((f) => f.section === dir);
  if (!inSection.length) continue;
  idx += `## ${label}\n\n`;
  for (const f of inSection) {
    idx += `- [${f.title}](${f.url})${f.description ? ': ' + f.description : ''}\n`;
  }
  idx += `\n`;
}
idx += `## Reference\n\n- [Reference (generated, versioned)](${SITE}/reference)\n`;

// ── llms-full.txt — full concatenation (the "mega-manual") ──────────────────
let full = `# Pantavisor — Full Documentation\n\n`;
full += `> Pantavisor is PID 1 and owns the full device update. It replaces Mender/RAUC/SWUpdate.\n\n`;
const ordered = [
  ...files.filter((f) => f.section === 'index'),
  ...SECTIONS.flatMap(([dir]) => files.filter((f) => f.section === dir)),
];
for (const f of ordered) {
  full += `\n\n---\n\n# ${f.title}\n\nSource: ${f.url}\n\n${f.body.trim()}\n`;
}

mkdirSync(STATIC, {recursive: true});
writeFileSync(join(STATIC, 'llms.txt'), idx);
writeFileSync(join(STATIC, 'llms-full.txt'), full);
console.log(`Wrote static/llms.txt (${idx.length} bytes) and static/llms-full.txt (${full.length} bytes) from ${files.length} curated pages.`);
