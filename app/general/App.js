import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { router } from './Router';

import { Loading } from '../components/Loading';

export function App() {
  return (
    <>
      <RouterProvider router={router}>
        <Suspense fallback={<Loading name="suspense" />} />
      </RouterProvider>

      <Toaster />
    </>
  );
}
