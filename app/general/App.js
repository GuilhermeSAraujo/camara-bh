import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Loading } from '../components/Loading';
import { router } from './Router';

export function App() {
  return (
    <>
      <Suspense fallback={<Loading name="suspense" />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </>
  );
}
