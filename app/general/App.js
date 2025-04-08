import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '../components/Layout';
import { RoutePaths } from './RoutePaths';
import { Loading } from '../components/Loading';

const Home = lazy(() => import('../pages/home/Home'));
const ProjetosDeLei = lazy(
  () => import('../pages/projetosDeLei/ProjetosDeLei')
);
const ProjetosDeLeiPartidos = lazy(
  () => import('../pages/projetosDeLeiPartidos/ProjetosDeLeiPartidos')
);
const Vereadores = lazy(() => import('../pages/vereadores/Vereadores'));

export function App() {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<Loading name="suspense" />}>
          <Routes>
            <Route path={RoutePaths.APP} element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path={RoutePaths.PROJETOS_DE_LEI}
                element={<ProjetosDeLei />}
              />
              <Route
                path={RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS}
                element={<ProjetosDeLeiPartidos />}
              />
              <Route path={RoutePaths.VEREADORES} element={<Vereadores />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
      <Toaster />
    </>
  );
}
