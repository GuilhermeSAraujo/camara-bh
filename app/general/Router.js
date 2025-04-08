import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';

// const Home = React.lazy(() => import('../pages/home/Home'));
// const Layout = React.lazy(() => import('../components/Layout'));
// const ProjetosDeLei = React.lazy(
//   () => import('../pages/projetosDeLei/ProjetosDeLei')
// );
// const ProjetosDeLeiPartidos = React.lazy(
//   () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
// );
// const Vereadores = React.lazy(() => import('../pages/vereadores/Vereadores'));

import Home from '../pages/home/Home';
import Layout from '../components/Layout';
import ProjetosDeLei from '../pages/projetosDeLei/ProjetosDeLei';
import ProjetosDeLeiPartidos from '../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos';
import Vereadores from '../pages/vereadores/Vereadores';

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
