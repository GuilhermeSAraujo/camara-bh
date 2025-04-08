// Router.js
import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';

// Ensure each module exports a default component (or remap via .then)
// const Home = lazy(() => import('../pages/home/Home'));
const Layout = lazy(() => import('../components/Layout'));
// const ProjetosDeLei = lazy(
//   () => import('../pages/projetosDeLei/ProjetosDeLei')
// );
// const ProjetosDeLeiPartidos = lazy(
//   () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
// );
// const Vereadores = lazy(() => import('../pages/vereadores/Vereadores'));

export const router = createBrowserRouter([
  {
    path: RoutePaths.APP,
    element: <Layout />,
    children: [
      {
        path: RoutePaths.APP,
        Component: lazy(() => import('../pages/home/Home')),
        // element: <Home />,
      },
      {
        path: RoutePaths.PROJETOS_DE_LEI,
        Component: lazy(() => import('../pages/projetosDeLei/ProjetosDeLei')),
        // element: <ProjetosDeLei />,
      },
      {
        path: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
        Component: lazy(
          () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
        ),
        // element: <ProjetosDeLeiPartidos />,
      },
      {
        path: RoutePaths.VEREADORES,
        Component: lazy(() => import('../pages/vereadores/Vereadores')),
        // element: <Vereadores />,
      },
    ],
  },
]);
