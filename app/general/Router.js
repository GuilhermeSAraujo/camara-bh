import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../pages/home/Home';
import { ProjetosDeLei } from '../pages/projetosDeLei/ProjetosDeLei';
import { ProjetosDeLeiPartidos } from '../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos';
import { Vereadores } from '../pages/vereadores/Vereadores';
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
      {
        path: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
        element: <ProjetosDeLeiPartidos />,
      },
      {
        path: RoutePaths.VEREADORES,
        element: <Vereadores />,
      },
    ],
  },
]);
