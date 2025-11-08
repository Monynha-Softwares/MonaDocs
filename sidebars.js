// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // Custom sidebar with proper ordering
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Projetos',
      link: {
        type: 'generated-index',
        description: 'Documentação dos projetos Monynha (visões gerais, stacks e guias).',
      },
      items: [
        'projects/boteco-pro/index',
        'projects/artleo-creative-spaces/index',
        'projects/boteco-pt/index',
        'projects/facodi/index',
        'projects/monynha-com/index',
        'projects/monynha-online/index',
        'projects/monynha-tech/index',
        'projects/sweet-price/index'
      ]
    },
    {
      type: 'category',
      label: 'Technologies',
      link: {
        type: 'generated-index',
        description: 'Technology stack documentation covering frontend, backend, DevOps tools, and development practices.',
      },
      items: [
        'technologies/frontend-stack',
        'technologies/backend-stack',
        'technologies/devops-tools'
      ]
    },
    {
      type: 'category',
      label: 'Guidelines',
      link: {
        type: 'generated-index',
        description: 'Development guidelines including UX principles, accessibility standards, code conventions, and security practices.',
      },
      items: [
        'guidelines/ux-guidelines',
        'guidelines/accessibility',
        'guidelines/code-conventions',
        'guidelines/security'
      ]
    },
    {
      type: 'category',
      label: 'Identity',
      link: {
        type: 'generated-index',
        description: 'Visual identity and UI component documentation including brand guidelines and component libraries.',
      },
      items: [
        'identity/brand-guidelines',
        'identity/ui-components'
      ]
    },
    {
      type: 'category',
      label: 'Contribution',
      link: {
        type: 'generated-index',
        description: 'Contribution guidelines, development workflow, and governance model for the Monynha Softwares community.',
      },
      items: [
        'contribution/contributing',
        'contribution/governance'
      ]
    },
    {
      type: 'category',
      label: 'Architecture',
      link: {
        type: 'generated-index',
        description: 'Technical architecture documentation covering monorepo structure, backend systems, and CI/CD pipelines.',
      },
      items: [
        'architecture/monorepo-structure',
        'architecture/backend-architecture',
        'architecture/ci-cd'
      ]
    }
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
