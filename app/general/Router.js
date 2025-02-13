import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { Home } from '../pages/home/Home';
import { RoutePaths } from './RoutePaths';
import { ProjetosDeLei } from '../pages/projetosDeLei/ProjetosDeLei';

export const router = createBrowserRouter([
  {
    path: RoutePaths.APP,
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'projetosDeLei',
        element: <ProjetosDeLei />,
      },
    ],
  },
]);
