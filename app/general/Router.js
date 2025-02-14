import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { Home } from '../pages/home/Home';
import { ProjetosDeLei } from '../pages/projetosDeLei/ProjetosDeLei';
import { RoutePaths } from './RoutePaths';

export const router = createBrowserRouter([
  {
    path: RoutePaths.APP,
    element: <Layout />,
    children: [
      {
        path: RoutePaths.APP,
        element: <Home />,
      },
      {
        path: RoutePaths.PROJETOS_DE_LEI,
        element: <ProjetosDeLei />,
      },
    ],
  },
]);
