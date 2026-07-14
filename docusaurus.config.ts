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
// LOCAL_META=true — only the local tarball is built, skip frozen versions
const activeVersions = process.env.LOCAL_META
  ? [releases.current]
  : releases.versions;
const referenceVersions: {[v: string]: {label: string; path: string}} = {};
for (const version of activeVersions) {
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
        lastVersion: 'current',
        versions: referenceVersions,
        rehypePlugins: [rehypeMaterialIcons],
        // Expand every sidebar category by default instead of only the one
        // containing the current page.
        sidebarCollapsed: false,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {from: '/start', to: '/meta-pantavisor/start'},
          {from: '/install', to: '/meta-pantavisor/how-to-install'},
          {from: '/build', to: '/meta-pantavisor/how-to-build'},
          {from: '/develop', to: '/meta-pantavisor/develop'},
          {from: '/operate', to: '/meta-pantavisor/operate'},
          {from: '/migrate', to: '/meta-pantavisor/migrate'},
          {from: '/security', to: '/meta-pantavisor/security'},
          {from: '/benchmarks', to: '/meta-pantavisor/benchmarks'},
          {from: '/solutions', to: '/meta-pantavisor/solutions'},
          {from: '/troubleshooting', to: '/meta-pantavisor/troubleshooting'},
          {from: '/licensing', to: '/meta-pantavisor/licensing'},
          {from: '/community', to: '/meta-pantavisor/community'},
          {from: '/build/build-system', to: '/meta-pantavisor/how-to-build'},
          {from: '/concepts/meta-pantavisor-overview', to: '/meta-pantavisor/overview'},
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
        searchContextByPaths: [
          {label: 'Pantavisor runtime', path: 'pantavisor'},
          {label: 'meta-pantavisor', path: 'meta-pantavisor'},
          {label: 'PVR CLI', path: 'pvr'},
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
        {
          type: 'dropdown',
          label: 'Reference',
          position: 'left',
          to: '/pantavisor/overview',
          items: [
            {to: '/pantavisor/overview', label: 'Pantavisor runtime'},
            {to: '/meta-pantavisor/overview', label: 'meta-pantavisor'},
            {to: '/pvr', label: 'PVR CLI'},
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
            {label: 'Pantavisor runtime', to: '/pantavisor/overview'},
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
