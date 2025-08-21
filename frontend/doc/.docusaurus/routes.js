import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/doc/markdown-page',
    component: ComponentCreator('/doc/markdown-page', '4d6'),
    exact: true
  },
  {
    path: '/doc/docs',
    component: ComponentCreator('/doc/docs', 'a9f'),
    routes: [
      {
        path: '/doc/docs',
        component: ComponentCreator('/doc/docs', '905'),
        routes: [
          {
            path: '/doc/docs',
            component: ComponentCreator('/doc/docs', 'e57'),
            routes: [
              {
                path: '/doc/docs/advanced-features',
                component: ComponentCreator('/doc/docs/advanced-features', 'eb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/api',
                component: ComponentCreator('/doc/docs/api', '02e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/contact',
                component: ComponentCreator('/doc/docs/contact', '5d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/contributing',
                component: ComponentCreator('/doc/docs/contributing', 'f1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/database-schema',
                component: ComponentCreator('/doc/docs/database-schema', '3a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/faq',
                component: ComponentCreator('/doc/docs/faq', '1e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/frontend-components',
                component: ComponentCreator('/doc/docs/frontend-components', '2f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/intro',
                component: ComponentCreator('/doc/docs/intro', 'e04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/doc/docs/state-management',
                component: ComponentCreator('/doc/docs/state-management', '388'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/doc/',
    component: ComponentCreator('/doc/', 'fb8'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
