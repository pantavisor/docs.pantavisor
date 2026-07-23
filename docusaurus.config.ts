import {readFileSync, existsSync} from 'fs';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rehypeMaterialIcons from './src/plugins/rehype-material-icons.mjs';

// Reference versions are derived from releases.json (the single source of
// truth). scripts/sync-reference.mjs generates the matching reference/ and
// reference_versioned_docs/ at build time; none of it is committed.
const releases = JSON.parse(readFileSync('./releases.json', 'utf8')) as {
  current: string;
  versions: string[];
};
// LOCAL_META=true — only the local tarball is built, skip frozen versions
const activeVersions = process.env.LOCAL_META
  ? [releases.current]
  : releases.versions;
// The latest stable (non-RC, non-development) release is served unprefixed
// at the site root. `versions` is newest-first, so the first non-RC entry
// is always the current stable release — this tracks whichever version that
// is (028 today, 029 once it ships, ...) without hardcoding a version here.
// Falls back to `current` itself if every entry happens to be an RC/dev
// build, so `rootVersionKey` is never left unresolved.
const latestStableVersion =
  activeVersions.find((v) => v !== 'development' && !v.includes('rc')) ?? releases.current;
const rootVersionKey = latestStableVersion === releases.current ? 'current' : latestStableVersion;

const referenceVersions: {[v: string]: {label: string; path: string}} = {};
for (const version of activeVersions) {
  const isRoot = version === latestStableVersion;
  if (version === releases.current) {
    referenceVersions.current = {label: version, path: isRoot ? '/' : `/${version}`};
  } else if (isRoot) {
    referenceVersions[version] = {label: version, path: '/'};
  } else if (existsSync(`reference_versioned_docs/version-${version}`)) {
    referenceVersions[version] = {label: version, path: `/${version}`};
  }
}

const stableVersions = [
  ...(!releases.current.includes('rc') ? ['current'] : []),
  ...activeVersions.filter(
    (v) => v !== releases.current && !v.includes('rc') && v !== 'development',
  ),
];
const rcVersions = [
  ...(releases.current.includes('rc') ? ['current'] : []),
  ...activeVersions.filter(
    (v) => v !== releases.current && v.includes('rc'),
  ),
];
const hasDevelopment = existsSync('reference_versioned_docs/version-development');

const config: Config = {
  title: 'Pantavisor Docs',
  tagline: 'Pantavisor is PID 1 and owns the full device update',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  // Canonical custom domain. The domain is also pinned via static/CNAME so it
  // survives every GitHub Pages deploy, and mirrored in static/robots.txt
  // (Sitemap).
  url: 'https://docs.pantavisor.io',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  markdown: {
    // By extension: .md → CommonMark (reference content with raw HTML/braces
    // passes through), .mdx → MDX (authored curated content with admonitions).
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.x/css/materialdesignicons.min.css',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        // Landing page is at src/pages/index.mdx. Docs are via the reference
        // plugin below (id: 'reference').
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        // REFERENCE instance = generated, versioned, repo-shaped content.
        // migrate-docs.js writes the current version into reference/.
        id: 'reference',
        path: 'reference',
        routeBasePath: '/',
        sidebarPath: './sidebarsReference.ts',
        lastVersion: rootVersionKey,
        versions: referenceVersions,
        rehypePlugins: [rehypeMaterialIcons],
        // Expand every sidebar category by default instead of only the one
        // containing the current page.
        sidebarCollapsed: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {from: '/concepts/meta-pantavisor-overview', to: '/meta-pantavisor/overview'},
          // Repo root → first child
          {from: '/pantavisor', to: '/pantavisor/overview'},
          {from: '/meta-pantavisor', to: '/meta-pantavisor/overview'},
        ],
      },
    ],
  ],

  themes: [
    [
      // Offline local search (no external service). Indexes both the curated
      // and reference docs instances.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: ['/'],
        docsDir: ['reference'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    image: 'images/Pantacor_Logo_Black.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Pantavisor Docs',
      logo: {
        alt: 'Pantavisor',
        src: 'images/logo-icon.svg',        // light theme (dark icon)
        srcDark: 'images/logo-icon-white.svg', // dark theme (white icon)
        width: 32,
        height: 32,
      },
      items: [
        {type: 'custom-versionAwareLink', to: '/meta-pantavisor/getting-started/start', label: 'Getting Started', position: 'left', customComponent: 'VersionAwareLink'},
        {type: 'custom-versionAwareLink', to: '/pantavisor/overview', label: 'Pantavisor Runtime', position: 'left', customComponent: 'VersionAwareLink'},
        {type: 'custom-versionAwareLink', to: '/meta-pantavisor/overview', label: 'meta-pantavisor', position: 'left', customComponent: 'VersionAwareLink'},
        {type: 'custom-versionAwareLink', to: '/pvr', label: 'PVR CLI', position: 'left', customComponent: 'VersionAwareLink'},
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'reference',
          position: 'right',
          dropdownActiveClassDisabled: true,
          versions: stableVersions,
          label: 'Stable',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'reference',
          position: 'right',
          dropdownActiveClassDisabled: true,
          versions: rcVersions,
          label: 'RC',
        },
        ...(hasDevelopment
          ? [{type: 'custom-developmentLink', to: '/development/pantavisor/overview/', label: 'Development', position: 'right' as const}]
          : []),
        {
          href: 'https://github.com/pantavisor',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/meta-pantavisor/getting-started/start'},
            {label: 'Pantavisor Runtime', to: '/pantavisor/overview'},
            {label: 'meta-pantavisor', to: '/meta-pantavisor/overview'},
            {label: 'PVR CLI', to: '/pvr'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Pantacor Website', href: 'https://www.pantacor.com'},
            {label: 'GitHub', href: 'https://github.com/pantavisor'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pantacor Ltd. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
