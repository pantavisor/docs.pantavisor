#!/usr/bin/env node
// One-time snapshot of the previous (MkDocs-era) documentation site into a
// parked archive/legacy/ folder — NOT served by the site.
//
//   node scripts/import-legacy.mjs
//
// The upstream release tarball ships the whole old site under legacy/. We
// deliberately exclude that tree from the generated REFERENCE instance (see
// migrate-docs.js) because it is archived narrative, not repo-shaped reference.
// We also keep it out of the curated docs instance so it does not appear in the
// navbar or sidebar. Instead we snapshot it once into archive/legacy/ — a
// committed folder that lives OUTSIDE every Docusaurus docs instance, preserved
// for later curation into the real sections.
//
// This script is idempotent: re-running it overwrites archive/legacy/ from the
// current local release source. It reads from releases/<current>/legacy, which
// only exists after `npm run generate` (or a build) has fetched + extracted the
// release. It is NOT part of the build — run it manually when (re)importing.
//
// Transformations applied per Markdown file:
//   - TOML (+++) / YAML (---) frontmatter → Docusaurus YAML frontmatter
//   - MkDocs admonitions (`!!! note "Title"`) → Docusaurus (`:::note[Title]`)
//   - _index.md → index.md
// Images, diagrams, and other assets are copied verbatim. Empty directories
// (the old per-repo image holders) are skipped.
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, rmSync,
  readdirSync, copyFileSync,
} from 'node:fs';
import {join, dirname, relative, sep} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const cfg = JSON.parse(readFileSync(join(ROOT, 'releases.json'), 'utf8'));
const SRC = join(ROOT, 'releases', cfg.current, 'legacy');
const DEST = join(ROOT, 'archive', 'legacy');

if (!existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  console.error('Run `npm run generate` first so the release is fetched + extracted.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Frontmatter conversion (mirrors migrate-docs.js, kept standalone on purpose).
// ---------------------------------------------------------------------------
function parseTomlFrontmatter(toml) {
  const result = {};
  for (const line of toml.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('[')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) { result[key] = val; continue; }
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (val === 'true') result[key] = true;
    else if (val === 'false') result[key] = false;
    else if (!isNaN(val) && val !== '') result[key] = Number(val);
    else result[key] = val;
  }
  return result;
}

function parseYamlFrontmatter(yaml) {
  const result = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    if (val === 'true') result[m[1]] = true;
    else if (val === 'false') result[m[1]] = false;
    else if (!isNaN(val) && val !== '') result[m[1]] = Number(val);
    else result[m[1]] = val;
  }
  return result;
}

function toYamlValue(val) {
  if (typeof val === 'boolean' || typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    if (val.startsWith('[')) return val;
    if (/[:"'#\n]|^[>|]/.test(val)) return JSON.stringify(val);
    return val;
  }
  return JSON.stringify(val);
}

function buildFrontmatter(parsed) {
  const fm = {};
  if (parsed.title) fm.title = parsed.title;
  const pos = parsed.sidebar_position ?? parsed.weight ?? parsed.nav_order;
  if (pos !== undefined) fm.sidebar_position = Number(pos);
  if (parsed.description) fm.description = parsed.description;
  if (parsed.keywords) fm.keywords = parsed.keywords;
  if (parsed.draft && parsed.draft !== 'false') fm.draft = true;
  return fm;
}

function serialize(fm) {
  return Object.entries(fm).map(([k, v]) => `${k}: ${toYamlValue(v)}`).join('\n');
}

function splitFrontmatter(content) {
  if (content.startsWith('+++')) {
    const end = content.indexOf('\n+++', 3);
    if (end !== -1) {
      return {
        fm: buildFrontmatter(parseTomlFrontmatter(content.slice(3, end))),
        body: content.slice(end + 4).replace(/^\n+/, ''),
      };
    }
  }
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    if (end !== -1) {
      return {
        fm: buildFrontmatter(parseYamlFrontmatter(content.slice(3, end))),
        body: content.slice(end + 4).replace(/^\n+/, ''),
      };
    }
  }
  return {fm: {}, body: content};
}

// ---------------------------------------------------------------------------
// MkDocs admonition → Docusaurus admonition.
//   !!! note "Title"        :::note[Title]
//       indented body   →   body
//                           :::
// ---------------------------------------------------------------------------
const ADMONITION_TYPE = {
  note: 'note', tip: 'tip', info: 'info', warning: 'warning',
  danger: 'danger', caution: 'caution', important: 'info', example: 'info',
  success: 'tip', question: 'info', quote: 'note', abstract: 'info',
  failure: 'danger', bug: 'danger', hint: 'tip', attention: 'warning',
};

function convertAdmonitions(md) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)!!!\s*([A-Za-z]+)(?:\s+"([^"]*)")?\s*$/);
    if (!m) { out.push(lines[i]); continue; }
    const indent = m[1];
    const type = ADMONITION_TYPE[m[2].toLowerCase()] || 'note';
    const title = m[3];
    const body = [];
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (l.trim() === '') { body.push(''); j++; continue; }
      const lead = (l.match(/^\s*/)[0]).length;
      if (lead > indent.length) {
        body.push(l.slice(Math.min(lead, indent.length + 4)));
        j++;
      } else break;
    }
    while (body.length && body[body.length - 1] === '') body.pop();
    out.push(`${indent}:::${type}${title ? `[${title}]` : ''}`);
    out.push(...body);
    out.push(`${indent}:::`);
    // Ensure a blank line separates the closing fence from following content
    // (MkDocs' blank separator was consumed into the admonition body above).
    if (j < lines.length && lines[j].trim() !== '') out.push('');
    i = j - 1;
  }
  return out.join('\n');
}

function transformMarkdown(content) {
  const {fm, body} = splitFrontmatter(content);
  const converted = convertAdmonitions(body);
  const fmStr = Object.keys(fm).length ? serialize(fm) : '';
  return fmStr ? `---\n${fmStr}\n---\n\n${converted}` : converted;
}

// ---------------------------------------------------------------------------
// Walk + write. Returns the number of entries written so empty dirs are pruned.
// ---------------------------------------------------------------------------
function walk(srcDir, destDir) {
  let written = 0;
  for (const entry of readdirSync(srcDir, {withFileTypes: true})) {
    const srcPath = join(srcDir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(srcPath, join(destDir, entry.name));
      written += sub;
    } else {
      const rel = relative(SRC, srcPath).split(sep).join('/');
      if (rel === 'index.md') continue; // landing is written separately below
      const destName = entry.name === '_index.md' ? 'index.md' : entry.name;
      const destPath = join(destDir, destName);
      mkdirSync(dirname(destPath), {recursive: true});
      if (entry.name.endsWith('.md')) {
        writeFileSync(destPath, transformMarkdown(readFileSync(srcPath, 'utf8')));
      } else {
        copyFileSync(srcPath, destPath);
      }
      written++;
    }
  }
  return written;
}

rmSync(DEST, {recursive: true, force: true});
mkdirSync(DEST, {recursive: true});
const count = walk(SRC, DEST);

// Section landing: archive banner + the old site's intro body underneath.
// sidebar_position is high so the Legacy section sorts last among curated
// sections (current curated positions run 0–12).
const intro = existsSync(join(SRC, 'index.md'))
  ? convertAdmonitions(splitFrontmatter(readFileSync(join(SRC, 'index.md'), 'utf8')).body)
  : '';
writeFileSync(join(DEST, 'index.md'), `---
title: Legacy documentation (archived)
sidebar_label: Legacy
sidebar_position: 99
description: Archived snapshot of the previous Pantavisor documentation site.
---

:::warning[Archived]
These pages are a snapshot of the **previous** Pantavisor documentation site,
kept for reference while content is migrated into the current sections. Some of
it may be outdated. For up-to-date material use the main sections above, and for
generated, versioned material see the [Reference](/reference).
:::

${intro}`);

console.log(`Imported ${count} legacy files → archive/legacy/`);
