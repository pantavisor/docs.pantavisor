#!/usr/bin/env node
// Migrates a releases/<version>/ folder into a Docusaurus docs target.
// Usage:
//   node migrate-docs.js <src-version> <dest>
//   node migrate-docs.js 028-rc11 docs           ← current version
//   node migrate-docs.js 028-rc10 versioned_docs/version-028-rc10
//
// - Converts TOML +++ frontmatter to YAML ---
// - Renames _index.md → index.md
// - Maps weight/nav_order → sidebar_position
// - Copies image assets in place

const fs = require('fs');
const path = require('path');

const [srcArg, destArg] = process.argv.slice(2);
if (!srcArg || !destArg) {
  console.error('Usage: node migrate-docs.js <src-version-folder> <dest-folder>');
  console.error('  e.g. node migrate-docs.js 028-rc11 docs');
  process.exit(1);
}

const SRC = path.isAbsolute(srcArg)
  ? srcArg
  : path.join(__dirname, 'releases', srcArg);
const DEST = path.isAbsolute(destArg)
  ? destArg
  : path.join(__dirname, destArg);

function parseTomlFrontmatter(toml) {
  const result = {};
  for (const line of toml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Array: keep raw for now
    if (val.startsWith('[') && val.endsWith(']')) {
      result[key] = val;
      continue;
    }
    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
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
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    // Quote if contains special chars
    if (val.includes(':') || val.includes('"') || val.includes("'") ||
        val.includes('\n') || val.includes('#') || val.startsWith('>') ||
        val.startsWith('|')) {
      return JSON.stringify(val);
    }
    return val;
  }
  return JSON.stringify(val);
}

function buildDocuFrontmatter(parsed) {
  const fm = {};
  if (parsed.title)       fm.title       = parsed.title;
  const pos = parsed.sidebar_position ?? parsed.weight ?? parsed.nav_order;
  if (pos !== undefined)  fm.sidebar_position = Number(pos);
  if (parsed.description) fm.description  = parsed.description;
  const isDraft = parsed.draft;
  if (isDraft && isDraft !== false && isDraft !== 'false') fm.draft = true;
  return fm;
}

function serializeFrontmatter(fm) {
  return Object.entries(fm)
    .map(([k, v]) => `${k}: ${toYamlValue(v)}`)
    .join('\n');
}

function processMarkdown(content) {
  // TOML frontmatter
  if (content.startsWith('+++')) {
    const end = content.indexOf('\n+++', 3);
    if (end !== -1) {
      const toml = content.slice(3, end);
      const body = content.slice(end + 4).trimStart();
      const parsed = parseTomlFrontmatter(toml);
      const fm = buildDocuFrontmatter(parsed);
      const fmStr = serializeFrontmatter(fm);
      return `---\n${fmStr}\n---\n\n${body}`;
    }
  }
  // YAML frontmatter
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    if (end !== -1) {
      const yaml = content.slice(3, end);
      const body = content.slice(end + 4).trimStart();
      const parsed = parseYamlFrontmatter(yaml);
      const fm = buildDocuFrontmatter(parsed);
      const fmStr = serializeFrontmatter(fm);
      return `---\n${fmStr}\n---\n\n${body}`;
    }
  }
  return content;
}

function walk(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    let destName = entry.name === '_index.md' ? 'index.md' : entry.name;
    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      walk(srcPath, destPath);
    } else if (entry.name.endsWith('.md')) {
      const raw = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, processMarkdown(raw));
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

fs.rmSync(DEST, { recursive: true, force: true });
walk(SRC, DEST);
console.log(`Migrated releases/${srcArg} → ${destArg}`);
