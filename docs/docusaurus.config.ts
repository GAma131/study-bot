import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Study Bot',
  tagline: 'Bot de Telegram para estudiar la certificación de Anthropic',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://GAma131.github.io',
  baseUrl: '/study-bot/',

  organizationName: 'GAma131',
  projectName: 'study-bot',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/GAma131/study-bot/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Study Bot',
      items: [
        {
          to: '/docs/intro',
          position: 'left',
          label: 'Guía',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/GAma131/study-bot',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {label: 'Introducción', to: '/docs/intro'},
            {label: 'Guía de inicio', to: '/docs/setup'},
          ],
        },
        {
          title: 'Más',
          items: [
            {label: 'GitHub', href: 'https://github.com/GAma131/study-bot'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Study Bot.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
