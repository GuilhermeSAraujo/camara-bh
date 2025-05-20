// router.js
import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
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
const VereadorDetalhes = React.lazy(
  () => import('../pages/vereadorDetalhes/VereadorDetalhes')
);

export const router = createBrowserRouter([
  {
    element: <SuspenseLayout />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: RoutePaths.BUSCAR, element: <SearchProjetoDeLei /> },
          { path: RoutePaths.PROJETOS_DE_LEI, element: <ProjetosDeLei /> },
          {
            path: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
            element: <ProjetosDeLeiPartidos />,
          },
          { path: RoutePaths.VEREADORES, element: <Vereadores /> },
          { path: RoutePaths.VEREADOR, element: <VereadorDetalhes /> },
        ],
      },
    ],
  },
]);

function SuspenseLayout() {
  return (
    <Suspense fallback={<div>Carregando seção…</div>}>
      <Outlet />
    </Suspense>
  );
}
