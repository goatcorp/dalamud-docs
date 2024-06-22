// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

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

  // broken links check can cause the build to hang for a long time
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Some API comments contain curly brackets \{expression\} which are in the new mdx evaluated as expressions
  // 'detect' uses mdx for .mdx files and CommonMark
  markdown: {
    format: 'detect',
  },

  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },

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
        blog: {
          path: 'news',
          routeBasePath: '/news',
          showReadingTime: true,
        },
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'img/dalamud-social-card.png',
      navbar: {
        title: 'Dalamud.dev',
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
            to: 'news',
            label: 'News',
            position: 'left',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            docsPluginId: 'api',
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
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      algolia: {
        appId: 'FA3MQDJLPG',
        apiKey: 'eeb9f0346ff4c16a95d22a5a0ecced34',
        indexName: 'dalamud',
      },
    },
};

module.exports = config;
