import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';
import { router } from './Router';
import { Loading } from '../components/Loading';

export function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </>
  );
}
