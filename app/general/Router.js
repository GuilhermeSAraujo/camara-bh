import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RoutePaths } from './RoutePaths';

// Lazy load all page components
const Home = lazy(() =>
  import('../pages/home/Home').then((module) => ({ default: module.Home }))
);
const ProjetosDeLei = lazy(() =>
  import('../pages/projetosDeLei/ProjetosDeLei').then((module) => ({
    default: module.ProjetosDeLei,
  }))
);
const ProjetosDeLeiPartidos = lazy(() =>
  import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos').then(
    (module) => ({ default: module.ProjetosDeLeiPartidos })
  )
);
const Vereadores = lazy(() =>
  import('../pages/vereadores/Vereadores').then((module) => ({
    default: module.Vereadores,
  }))
);

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
