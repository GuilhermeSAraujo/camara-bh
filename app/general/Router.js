import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RoutePaths } from './RoutePaths';

// Lazy load das páginas com export default
const Home = lazy(() => import('../pages/home/Home'));
const ProjetosDeLei = lazy(
  () => import('../pages/projetosDeLei/ProjetosDeLei')
);
const ProjetosDeLeiPartidos = lazy(
  () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
);
const Vereadores = lazy(() => import('../pages/vereadores/Vereadores'));

// Componente de loading
const LoadingFallback = () => <div>Carregando...</div>;

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
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProjetosDeLei />
          </Suspense>
        ),
      },
      {
        path: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProjetosDeLeiPartidos />
          </Suspense>
        ),
      },
      {
        path: RoutePaths.VEREADORES,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Vereadores />
          </Suspense>
        ),
      },
    ],
  },
]);
