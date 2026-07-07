import {readFileSync} from 'fs';
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
const referenceVersions: {[v: string]: {label: string; path: string}} = {};
for (const version of releases.versions) {
  if (version === releases.current) {
    referenceVersions.current = {label: version, path: '/'};
  } else {
    referenceVersions[version] = {label: version, path: `/${version}`};
  }
}

const config: Config = {
  title: 'Pantavisor Docs',
  tagline: 'Pantavisor is PID 1 and owns the full device update',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  // Canonical custom domain. The domain is also pinned via static/CNAME so it
  // survives every GitHub Pages deploy, and mirrored in scripts/generate-llms.mjs
  // (SITE) and static/robots.txt (Sitemap).
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
        // Default docs instance = CURATED, versionless, user-task IA.
        // Hand-authored Markdown in curated/. Never touched by release ingest.
        docs: {
          path: 'curated',
          routeBasePath: '/',
          sidebarPath: './sidebarsCurated.ts',
          rehypePlugins: [rehypeMaterialIcons],
        },
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
        routeBasePath: 'reference',
        sidebarPath: './sidebarsReference.ts',
        lastVersion: 'current',
        versions: referenceVersions,
        rehypePlugins: [rehypeMaterialIcons],
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Old URLs of pages that were merged into other pages.
        redirects: [
          {
            from: '/concepts/meta-pantavisor-overview',
            to: '/build/build-system',
          },
          {from: '/community/support', to: '/community'},
          {from: '/community/projects', to: '/community'},
          {from: '/community/contribute', to: '/community'},
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
        docsRouteBasePath: ['/', 'reference'],
        docsDir: ['curated', 'reference'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        // Scope search results to the section the reader is currently in,
        // detected from the URL. Pages under /reference/pantavisor only
        // search that tree; /reference/meta-pantavisor likewise. Everything
        // else (curated docs: /concepts, /start, etc., plus the /reference
        // landing page) falls through to the default, unscoped context, so
        // those pages search each other but not into either reference tree.
        // Only applies to the *current* reference version — older versioned
        // reference pages (/reference/<version>/...) get their own
        // per-version index and aren't split by these paths.
        searchContextByPaths: [
          {label: 'Pantavisor reference', path: 'reference/pantavisor'},
          {label: 'meta-pantavisor reference', path: 'reference/meta-pantavisor'},
        ],
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
        {to: '/concepts', label: 'Concepts', position: 'left'},
        {to: '/start', label: 'Start', position: 'left'},
        {to: '/migrate', label: 'Migrate', position: 'left'},
        {
          // The reference instance is repo-shaped; surface its top-level
          // sections directly so they are reachable without drilling in.
          type: 'dropdown',
          label: 'Reference',
          position: 'left',
          to: '/reference',
          items: [
            {to: '/reference', label: 'Reference home'},
            {to: '/reference/meta-pantavisor', label: 'meta-pantavisor'},
            {to: '/reference/pantavisor', label: 'pantavisor'},
          ],
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'reference',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
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
            {label: 'Concepts', to: '/concepts'},
            {label: 'Start', to: '/start'},
            {label: 'Migrate to Pantavisor', to: '/migrate'},
            {label: 'Reference', to: '/reference'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Pantacor Website', href: 'https://www.pantacor.com'},
            {label: 'Pantahub Docs', href: 'https://docs.pantahub.com'},
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
