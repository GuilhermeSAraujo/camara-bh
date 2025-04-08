import React, { lazy, Suspense } from 'react';
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

// Loading component to show while chunks are loading
const LoadingFallback = () => <div>Carregando...</div>;

export const router = createBrowserRouter([
  {
    path: RoutePaths.APP,
    element: <Layout />,
    children: [
      {
        path: RoutePaths.APP,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
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
