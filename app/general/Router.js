import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';

const Home = React.lazy(() => import('../pages/home/Home'));
const Layout = React.lazy(() => import('../components/Layout'));
const ProjetosDeLei = React.lazy(
  () => import('../pages/projetosDeLei/ProjetosDeLei')
);
const ProjetosDeLeiPartidos = React.lazy(
  () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
);
const SearchProjetoDeLei = React.lazy(
  () => import('../pages/searchProjetoDeLei/SearchProjetoDeLei')
);
const Vereadores = React.lazy(() => import('../pages/vereadores/Vereadores'));

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
        path: RoutePaths.BUSCAR,
        element: <SearchProjetoDeLei />,
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
