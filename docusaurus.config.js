// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dalamud',
  tagline:
    'Documentation for the Dalamud plugin framework for FINAL FANTASY XIV.',
  favicon: 'img/favicon.ico',

  url: 'https://dalamud.dev',
  baseUrl: '/',

  // Info for GitHub Pages deployment
  organizationName: 'goatcorp',
  projectName: 'dalamud-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./default-sidebars.js'),
          editUrl: 'https://github.com/goatcorp/dalamud-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        id: 'api',
        routeBasePath: '/api',
        lastVersion: isDev ? 'placeholder' : 'master',
        /* "current" = unversioned, we exclude this and only use versioned dirs to make CI easier */
        includeCurrentVersion: false,
        versions: isDev
          ? {
              placeholder: {
                label: 'X.x (Placeholder)',
              },
            }
          : require('./dalamud-versions.json'),
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        docsDir: 'docs',
        docsPluginIdForPreferredVersion: 'api',
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/dalamud-social-card.png',
      navbar: {
        title: 'Dalamud',
        logo: {
          alt: 'Dalamud logo',
          src: 'img/dalamud-logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar',
            position: 'left',
            label: 'API',
            docsPluginId: 'api',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            docsPluginId: 'api',
            dropdownItemsAfter: [
              {
                to: '/versions',
                label: 'All versions',
              },
            ],
          },
          {
            href: 'https://github.com/goatcorp/Dalamud',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/holdshift',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/goatcorp/Dalamud',
              },
            ],
          },
        ],
        copyright: `Final Fantasy XIV © 2010-2023 SQUARE ENIX CO., LTD. All Rights Reserved. We are not affiliated with SQUARE ENIX CO., LTD. in any way.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['csharp'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
