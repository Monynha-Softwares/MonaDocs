// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MonaDocs',
  tagline: 'Documentação Central da Monynha Softwares',
  // Use an SVG favicon for crisp rendering on modern browsers
  // If you need .ico for legacy support, add `static/img/favicon.ico` and update this line.
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.monynha.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Monynha-Softwares', // Usually your GitHub org/user name.
  projectName: 'MonaDocs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Monynha-Softwares/MonaDocs/edit/dev/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Monynha-Softwares/MonaDocs/edit/dev/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'MonaDocs',
        logo: {
          alt: 'Monynha Softwares Logo',
          src: 'img/logo.svg',
        },
        items: [
          // Explicit dropdown exposing main documentation areas so the mobile menu
          // shows all relevant links (projects, technologies, guidelines, etc.).
          {
            label: 'Documentação',
            position: 'left',
            items: [
              { to: '/docs/intro', label: 'Introdução' },
              { to: '/docs/projetos/boteco-pro', label: 'Projetos' },
              { to: '/docs/technologies/frontend-stack', label: 'Tecnologias' },
              { to: '/docs/guidelines/ux-guidelines', label: 'Guidelines' },
              { to: '/docs/identity/brand-guidelines', label: 'Identidade' },
              { to: '/docs/contribution/contributing', label: 'Contribuição' },
              { to: '/docs/architecture/backend-architecture', label: 'Arquitetura' },
            ],
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            label: 'Empresa',
            position: 'right',
            items: [
              { label: 'Monynha.com', href: 'https://monynha.com' },
              { label: 'Projetos', href: 'https://monynha.com/projetos' },
              { label: 'Portfólio', href: 'https://marcelo.monynha.com/portifolio' },
            ],
          },
          {
            href: 'https://github.com/Monynha-Softwares',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentação',
            items: [
              {
                label: 'Introdução',
                to: '/docs/intro',
              },
              {
                label: 'Projetos',
                to: '/docs/projetos/boteco-pro',
              },
              {
                label: 'Tecnologias',
                to: '/docs/tecnologias/typescript',
              },
            ],
          },
          {
            title: 'Empresa',
            items: [
              {
                label: 'Monynha.com',
                href: 'https://monynha.com',
              },
              {
                label: 'Projetos',
                href: 'https://monynha.com/projetos',
              },
              {
                label: 'Portfólio',
                href: 'https://marcelo.monynha.com/portifolio',
              },
            ],
          },
          {
            title: 'Comunidade',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Monynha-Softwares',
              },
              {
                label: 'Monynha Online',
                href: 'https://monynha.online',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Monynha Softwares. Construído com Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
