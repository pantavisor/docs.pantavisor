#!/usr/bin/env node
// Migrates a releases/<version>/ folder into the REFERENCE docs instance.
// The reference instance is the generated, versioned, repo-shaped content.
// The curated/ instance (user-task IA, positioning) is hand-authored Markdown
// and is NEVER touched by this script.
// Usage:
//   node migrate-docs.js <src-version> <dest>
//   node migrate-docs.js 028-rc11 reference                              ← current version
//   node migrate-docs.js 028-rc10 reference_versioned_docs/version-028-rc10
//
// - Converts TOML +++ frontmatter to YAML ---
// - Renames _index.md → index.md
// - Maps weight/nav_order → sidebar_position
// - Copies image assets in place
// - Writes a Reference landing index.md when DEST is the live `reference` dir

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
    // Raw JSON arrays — pass through as-is (valid YAML)
    if (val.startsWith('[')) return val;
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
  if (parsed.title)       fm.title            = parsed.title;
  const pos = parsed.sidebar_position ?? parsed.weight ?? parsed.nav_order;
  if (pos !== undefined)  fm.sidebar_position = Number(pos);
  if (parsed.description) fm.description      = parsed.description;
  if (parsed.keywords)    fm.keywords         = parsed.keywords;
  const isDraft = parsed.draft;
  if (isDraft && isDraft !== false && isDraft !== 'false') fm.draft = true;
  return fm;
}

function serializeFrontmatter(fm) {
  return Object.entries(fm)
    .map(([k, v]) => `${k}: ${toYamlValue(v)}`)
    .join('\n');
}

// Upstream reference pages link to old copies under reference/legacy/ (e.g.
// `../../../reference/legacy/pantavisor-commands.md#commands`). The legacy tree
// is dropped from the generated reference instance (see EXCLUDE_FROM_REFERENCE)
// and is not served anywhere, so those links would dangle. Repoint them to
// where the content actually lives now: the current reference pages under
// pantavisor/reference/, and — for the build-only page — the curated Build
// section.
const LEGACY_LINK_IN_REFERENCE = new Set([
  'logserver-sockets', 'pantavisor-commands', 'pantavisor-configuration',
  'pantavisor-metadata', 'pantavisor-state-format-v2', 'pantavisor-xconnect',
]);
function rewriteLegacyReferenceLinks(content) {
  return content.replace(
    /\]\((?:\.\.\/)*(?:reference\/)?legacy\/([A-Za-z0-9._-]+)\.md(#[^)\s]*)?\)/g,
    (match, name, anchor = '') => {
      if (LEGACY_LINK_IN_REFERENCE.has(name))
        return `](/reference/pantavisor/reference/${name}${anchor})`;
      if (name === 'pantavisor-configuration-legacy')
        return `](/reference/pantavisor/reference/pantavisor-configuration${anchor})`;
      if (name === 'customize-build-pantavisor') return '](/build)';
      return match; // unknown legacy target — leave as-is
    },
  );
}

// Upstream reference Markdown also links back to source repositories and to
// legacy curated pages that no longer exist on this site. Rewrite those to the
// current curated/reference targets so the generated docs stop 404ing.
const DOTDOT = '(?:\\.\\./)*';
const CROSS_REPO_LINKS = [
  // Curated pages referenced by generated docs.
  { from: new RegExp(`\\]\\((${DOTDOT})initial-devices\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/start/download-and-flash$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})inspect-device\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})environment-setup\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/build/get-started$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})navigating-console\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access/serial-port$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})make-a-new-revision\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/application/install/local-pvr$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})claim-device\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access/remote-pantahub$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})deploy-a-new-revision\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/application/install/local-pvr$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})choose-device\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/install/supported-devices$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})choose-way\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/start$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})debug-pantavisor\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/troubleshooting/faq$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})clone-your-system\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/application/install/local-pvr$2' },
  // Source-repo paths that map to existing reference overview pages.
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/pantavisor-architecture\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/pantavisor-architecture$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/bsp\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/bsp$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/init-mode\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/init-mode$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/xconnect\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/xconnect$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/docs/overview/xconnect\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/xconnect$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/overview/xconnect\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/overview/xconnect$2' },
  // Source-repo paths that map to curated task pages.
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/remote-control\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access/remote-pantahub$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/pantavisor-configuration-levels\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-configuration$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/containers\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/container-development$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/updates\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/concepts/composable-firmware$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/storage\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access/pvtx-ui$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/local-control\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/operate/device-access/local-network$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-src/docs/overview/watchdog\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-tools$2' },
  // Source-repo paths that map to current reference pages.
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/docs/reference/pantavisor-xconnect\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-xconnect$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/docs/reference/pantavisor-commands\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-commands$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/reference/pantavisor-commands\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-commands$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor/reference/pantavisor-xconnect\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-xconnect$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})reference/027/pantavisor-commands\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/pantavisor-commands$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})reference/027/logserver-sockets\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference/pantavisor/reference/logserver-sockets$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pvr-sdk/reference/pvcontrol\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/cli-tools/pvcontrol$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pvr-sdk/reference/pantabox\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/reference$2' },
  // Misc README / old paths.
  { from: new RegExp(`\\]\\((${DOTDOT})pvr/README\\.md(#[^)\\s]*)?\\)`, 'g'), to: '/develop/cli-tools/pvr-cli$2' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantahub-base/README\\.md(#[^)\\s]*)?\\)`, 'g'), to: 'https://docs.pantahub.com$2' },
  // Anchors on pages that have no such heading — drop the anchor so the link
  // at least resolves to the right file.
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-state-format-v2\\.md#[^)\\s]+\\)`, 'g'), to: '](/reference/pantavisor/reference/pantavisor-state-format-v2)' },
  { from: new RegExp(`\\]\\((${DOTDOT})pantavisor-configuration\\.md#[^)\\s]+\\)`, 'g'), to: '](/reference/pantavisor/reference/pantavisor-configuration)' },
];
function rewriteCrossRepoLinks(content) {
  for (const { from, to } of CROSS_REPO_LINKS) {
    content = content.replace(from, to);
  }
  return content;
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
      return rewriteCrossRepoLinks(rewriteLegacyReferenceLinks(`---\n${fmStr}\n---\n\n${body}`));
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
      return rewriteCrossRepoLinks(rewriteLegacyReferenceLinks(`---\n${fmStr}\n---\n\n${body}`));
    }
  }
  return rewriteCrossRepoLinks(rewriteLegacyReferenceLinks(content));
}

// Paths (relative to the release root) that are NOT reference material and are
// excluded from the generated reference instance. The "learn" tree is curated,
// versionless narrative and is hand-authored in curated/ instead.
const EXCLUDE_FROM_REFERENCE = new Set([
  // Curated narrative/guides — maintained by hand in curated/, not generated.
  'meta-pantavisor/learn',
  'meta-pantavisor/supported-devices',
  // The upstream tarball ships the entire previous (MkDocs-era) docs site under
  // legacy/. It is not repo-shaped reference material — it is archived narrative.
  // A one-time, hand-reviewed snapshot lives in curated/legacy/ (imported via
  // scripts/import-legacy.mjs); keep it out of the generated reference instance.
  'legacy',
]);

function walk(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const relFromRoot = path.relative(SRC, srcPath).split(path.sep).join('/');
    if (EXCLUDE_FROM_REFERENCE.has(relFromRoot)) {
      console.log(`  (excluded from reference: ${relFromRoot})`);
      continue;
    }
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

// Restore placeholder images for relative image refs that have no source.
// These are referenced in pantavisor/overview/ docs but never existed in the repo.
const PLACEHOLDER = path.join(__dirname, 'static', 'images', 'kas-menu-1.png');
const relativeImagePlaceholders = [
  path.join(DEST, 'pantavisor', 'overview', 'images', 'state-pv.png'),
  path.join(DEST, 'pantavisor', 'overview', 'images', 'state-phclient.png'),
  path.join(DEST, 'pantavisor', 'overview', 'images', 'flow-remote-update.png'),
  path.join(DEST, 'pantavisor', 'overview', 'images', 'flow-local-update.png'),
];
if (fs.existsSync(PLACEHOLDER)) {
  for (const img of relativeImagePlaceholders) {
    if (!fs.existsSync(img)) {
      fs.mkdirSync(path.dirname(img), { recursive: true });
      fs.copyFileSync(PLACEHOLDER, img);
    }
  }
}

// Some release versions renamed meta-pantavisor/how-to-install/tezi.md to
// toradex.md but left tezi.md links behind. If this version only has toradex.md,
// rewrite the links so they resolve.
const teziPath = path.join(DEST, 'meta-pantavisor', 'how-to-install', 'tezi.md');
const toradexPath = path.join(DEST, 'meta-pantavisor', 'how-to-install', 'toradex.md');
if (!fs.existsSync(teziPath) && fs.existsSync(toradexPath)) {
  const installDir = path.join(DEST, 'meta-pantavisor', 'how-to-install');
  for (const entry of fs.readdirSync(installDir, { withFileTypes: true })) {
    if (!entry.name.endsWith('.md')) continue;
    const p = path.join(installDir, entry.name);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/]\((tezi\.md)(#[^)\s]*)?\)/g, (_, file, anchor) => '](./toradex.md' + (anchor || '') + ')'));
  }
}

// Reference landing page. The reference instance is regenerated on every build,
// so the landing is written here rather than hand-maintained. Written for the
// live `reference` dir and for each frozen `version-*` snapshot.
const destBase = path.basename(DEST);
if (destBase === 'reference' || destBase.startsWith('version-')) {
  const REFERENCE_INDEX = `---
title: Reference
description: Generated, versioned reference for Pantavisor, meta-pantavisor, and pvr.
sidebar_position: 1
slug: /
---

# Reference

This section is **generated from each Pantavisor release** and is **versioned** —
use the version dropdown to match your device. It is the exact, authoritative
reference for commands, schemas, recipes, and per-board material.

For task guides and concepts, see the main [documentation](/) (curated and
versionless).

> Do not hand-edit pages under Reference. They are regenerated on every release
> ingest. Edit the source in the originating repository instead.
`;
  fs.writeFileSync(path.join(DEST, 'index.md'), REFERENCE_INDEX);

  // Section landing pages. Top-level reference sections (meta-pantavisor,
  // pantavisor, …) ship no index of their own, so the autogenerated sidebar
  // mounts them as link-less categories and /reference/<section> 404s — which
  // would break the navbar Reference dropdown.
  for (const entry of fs.readdirSync(DEST, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(DEST, entry.name);
    const indexMd = path.join(dir, 'index.md');
    const readmeMd = path.join(dir, 'README.md');
    if (fs.existsSync(indexMd)) continue;
    if (fs.existsSync(readmeMd)) {
      // The section is indexed by a README that carries no frontmatter title,
      // so the sidebar/route label falls back to "README". Stamp the section
      // name as title + sidebar_label so it reads (e.g.) "pvr" instead.
      const body = fs.readFileSync(readmeMd, 'utf8');
      if (!body.startsWith('---')) {
        fs.writeFileSync(readmeMd,
`---
title: ${entry.name}
sidebar_label: ${entry.name}
sidebar_position: 0
---

${body}`);
      }
      continue;
    }
    // No index at all — write a minimal landing so the section is reachable.
    fs.writeFileSync(indexMd,
`---
title: ${entry.name}
sidebar_position: 0
---

# ${entry.name}

Generated reference for \`${entry.name}\`. Browse the pages in the sidebar.
`);
  }
}

console.log(`Migrated releases/${srcArg} → ${destArg}`);
