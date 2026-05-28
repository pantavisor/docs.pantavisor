import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Pantacor Docs',
  tagline: 'Documentation for Pantavisor and meta-pantavisor',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://pantavisor.github.io',
  baseUrl: '/docs.pantavisor/',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  markdown: {
    // Parse .md files as standard CommonMark (not MDX) so existing HTML
    // in docs (class= attributes, <!-- comments -->, <br> tags) passes through.
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

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Versioning: snapshot with `npx docusaurus docs:version <X>`
          // when a new docs-vX folder arrives and replaces docs/.
          lastVersion: 'current',
          versions: {
            current: {
              label: '028-rc11',
              path: '/',
            },
            '028-rc10': {
              label: '028-rc10',
              path: '/028-rc10',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Pantacor Docs',
      logo: {
        alt: 'Pantacor Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/pantacor',
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
            {label: 'Pantavisor', to: '/pantavisor/overview/pantavisor-architecture'},
            {label: 'meta-pantavisor', to: '/meta-pantavisor/learn'},
            {label: 'PVR SDK', to: '/pvr-sdk/README'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Pantacor Website', href: 'https://www.pantacor.com'},
            {label: 'GitHub', href: 'https://github.com/pantacor'},
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
