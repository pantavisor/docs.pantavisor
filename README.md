# docs.pantacor.io

Official documentation site for the [Pantacor](https://www.pantacor.com) ecosystem, built with [Docusaurus](https://docusaurus.io/).

The site covers projects:

- **Pantavisor** — the open-source, container-based embedded Linux runtime
- **meta-pantavisor** — the Yocto/OpenEmbedded layer for building Pantavisor images

The site is versioned: each release of the docs corresponds to a Pantavisor release (e.g. `028-rc11`). A version dropdown in the navbar lets readers switch between releases.

---

## Repository layout

```
releases/           # Source markdown for every release (one folder per version)
│   028-rc10/       # Older frozen release
│   028-rc11/       # Latest release
│
docs/               # Current version served by Docusaurus (generated from releases/<latest>)
versioned_docs/     # Frozen older versions (generated from releases/<older>)
versioned_sidebars/ # Auto-generated sidebar config for each frozen version
versions.json       # List of frozen version names
migrate-docs.js     # Migration script — converts a releases/<version>/ folder into Docusaurus format
docusaurus.config.ts
sidebars.ts
src/                # Custom React components and CSS
static/             # Static assets (images, favicon, etc.)
```

> **Rule of thumb:** never edit `docs/` or `versioned_docs/` by hand. Always edit the source in `releases/` and re-run the migration script.

---

## Local development

```bash
npm install
npm start          # dev server at http://localhost:3000 with hot-reload
npm run build      # production build → build/
npm run serve      # serve the production build locally
```

---

## Adding a new release

When a new release folder arrives (e.g. `releases/028-rc12`):

### 1. Freeze the current version

```bash
npx docusaurus docs:version 028-rc11
```

This snapshots `docs/` into `versioned_docs/version-028-rc11/` and appends `028-rc11` to `versions.json`.

### 2. Migrate the new release into `docs/`

```bash
node migrate-docs.js 028-rc12 docs
```

The script converts the source markdown into Docusaurus format:
- TOML `+++` frontmatter → YAML `---`
- `_index.md` → `index.md`
- `weight` / `nav_order` → `sidebar_position`
- Binary assets (images) are copied as-is

Restore the landing page after migration (the script replaces `docs/` entirely):

```bash
# docs/index.md is wiped by the migration — recreate it or keep a copy outside releases/
```

### 3. Update the version label in `docusaurus.config.ts`

```ts
versions: {
  current: {
    label: '028-rc12',   // ← update this
    path: '/',
  },
  // frozen versions are picked up automatically from versions.json
},
```

### 4. Commit and deploy

```bash
git add .
git commit -m "docs: add release 028-rc12"
```

---

## How versioning works

Docusaurus versioning maps to this directory layout:

| What Docusaurus calls it | This repo | URL path |
|---|---|---|
| `current` (editable) | `docs/` | `/` |
| Frozen version `028-rc10` | `versioned_docs/version-028-rc10/` | `/028-rc10/...` |

The version dropdown in the navbar is provided by `docsVersionDropdown` in `docusaurus.config.ts` and renders automatically once two or more versions exist.

## Broken links / warnings

Some source documents contain cross-repository links (e.g. `../../pantavisor-src/docs/...`) that cannot be resolved within this site. These are emitted as **warnings**, not errors, and do not block the build. They are a known limitation of the source material.
