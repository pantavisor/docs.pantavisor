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
  let rewritten = content.replace(
    /\]\((?:\.\.\/)*(?:reference\/)?legacy\/([A-Za-z0-9._-]+)\.md(#[^)\s]*)?\)/g,
    (match, name, anchor = '') => {
      if (LEGACY_LINK_IN_REFERENCE.has(name))
        return `](/pantavisor/reference/${name}${anchor})`;
      if (name === 'customize-build-pantavisor') return '](/meta-pantavisor/overview/build-system)';
      return match; // unknown legacy target — leave as-is
    },
  );
  
  // Fix broken links to pantavisor-src/docs by pointing directly to the pantavisor section
  rewritten = rewritten.replace(/((?:\.\.\/)+)pantavisor-src\/docs\//g, (match, prefix) => {
    return prefix + 'pantavisor/';
  });

  // Map old MkDocs root how-to guides to their new Curated locations
  const LEGACY_ROOT_LINKS = {
    'automated-workflow': '/develop/',
    'choose-device': '/start/',
    'choose-way': '/start/',
    'claim-device': '/operate/device-access/remote-pantahub',
    'clone-your-system': '/operate/',
    'debug-pantavisor': '/troubleshooting/faq',
    'deploy-a-new-revision': '/develop/application/',
    'environment-setup': '/start/',
    'initial-devices': '/start/download-and-flash',
    'inspect-device': '/operate/device-access/',
    'make-a-new-revision': '/develop/application/',
    'navigating-console': '/operate/device-access/serial-port',
    'sdcard': '/start/download-and-flash',
    'testplan-pvctrl': '/develop/cli-tools/pvcontrol',
  };
  // The toradex flashing guide moved from meta-pantavisor/how-to-install/ to
  // meta-pantavisor/getting-started/how-to-install/ in the getting-started
  // restructure, but that restructure only landed in `development` and the
  // in-flight `current` version — every frozen older version (RCs included)
  // still has it at the old flat path. Resolve against THIS version's own
  // source tree rather than hardcoding one path for every version.
  const TORADEX_LINK_NAMES = new Set(['toradex', 'verdin-imx8mm', 'colibri-imx6ull']);
  const TORADEX_LINK_CANDIDATES = [
    '/meta-pantavisor/getting-started/how-to-install/toradex',
    '/meta-pantavisor/how-to-install/toradex',
  ];
  function resolveToradexLink() {
    return TORADEX_LINK_CANDIDATES.find((c) => resolveReferenceLinkTarget(c.slice(1)))
      ?? TORADEX_LINK_CANDIDATES[0];
  }
  rewritten = rewritten.replace(
    /\]\((?:\.\.\/)+([A-Za-z0-9._-]+)\.md(#[^)\s]*)?\)/g,
    (match, name, anchor = '') => {
      if (TORADEX_LINK_NAMES.has(name)) return `](${resolveToradexLink()}${anchor})`;
      if (LEGACY_ROOT_LINKS[name]) {
        if (name === 'inspect-device') {
          if (anchor === '#ssh') return '](/operate/device-access/local-network#ssh-access)';
          if (anchor === '#tty') return '](/operate/device-access/serial-port)';
          return '](/operate/device-access/)';
        }
        return `](${LEGACY_ROOT_LINKS[name]})`;
      }
      return match;
    }
  );

  return rewritten;
}

// Cross-reference links authored as absolute site paths (e.g.
// `/meta-pantavisor/getting-started/migrate/mender`) always resolve against
// whichever version is served at the site root, so following one while
// browsing a prefixed version (e.g. /development/...) silently drops the
// reader into a different version. Docusaurus resolves *relative* doc links
// within whatever version is currently active, so rewrite absolute links
// that target one of the reference instance's own top-level sections into a
// path relative to the linking file, computed against SRC (which mirrors
// DEST 1:1 for this version) — that keeps them version-safe automatically.
const REFERENCE_SECTIONS = ['meta-pantavisor', 'pantavisor', 'pvr'];
function resolveReferenceLinkTarget(urlPath) {
  const base = urlPath.replace(/\/$/, '');
  for (const suffix of ['.md', '/index.md', '/_index.md', '/README.md']) {
    const candidate = base + suffix;
    if (fs.existsSync(path.join(SRC, candidate))) return candidate;
  }
  return null;
}
function rewriteAbsoluteReferenceLinks(content, relFilePath) {
  const fileDir = path.dirname(relFilePath);
  return content.replace(
    /\]\((\/[A-Za-z0-9._/-]+)(#[^)\s]*)?\)/g,
    (match, urlPath, anchor = '') => {
      if (!REFERENCE_SECTIONS.includes(urlPath.split('/')[1])) return match;
      const target = resolveReferenceLinkTarget(urlPath.slice(1));
      if (!target) return match; // can't resolve — leave as-is
      let rel = path.relative(fileDir, target).split(path.sep).join('/');
      if (!rel.startsWith('.')) rel = `./${rel}`;
      return `](${rel}${anchor})`;
    },
  );
}

function processMarkdown(content, relFilePath) {
  const finish = (body) => rewriteAbsoluteReferenceLinks(rewriteLegacyReferenceLinks(body), relFilePath);
  // TOML frontmatter
  if (content.startsWith('+++')) {
    const end = content.indexOf('\n+++', 3);
    if (end !== -1) {
      const toml = content.slice(3, end);
      const body = content.slice(end + 4).trimStart();
      const parsed = parseTomlFrontmatter(toml);
      const fm = buildDocuFrontmatter(parsed);
      const fmStr = serializeFrontmatter(fm);
      return finish(`---\n${fmStr}\n---\n\n${body}`);
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
      return finish(`---\n${fmStr}\n---\n\n${body}`);
    }
  }
  return finish(content);
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
  // The upstream tarball also ships its own top-level index.md (a landing page
  // authored by the meta-pantavisor CI release pipeline). An index.md at a
  // reference instance's root resolves to /reference, and there is
  // deliberately no landing page there — see the note further down where the
  // reference instance's own generated index would otherwise go.
  'index.md',
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
      fs.writeFileSync(destPath, processMarkdown(raw, relFromRoot));
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

// There is deliberately no landing page at the reference instance's root
// (`/reference`) — it added nothing a reader couldn't get from the
// meta-pantavisor/pantavisor entries directly, so navbar/footer/sidebar/
// homepage links point straight at /reference/pantavisor instead. Written for
// the live `reference` dir and for each frozen `version-*` snapshot.
const destBase = path.basename(DEST);
if (destBase === 'reference' || destBase.startsWith('version-')) {
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
