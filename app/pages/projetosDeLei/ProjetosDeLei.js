import React, { lazy, Suspense } from 'react';

const ProjetosDeLeiContent = lazy(() => import('./projetosDeLeiContent'));

export default function ProjetosDeLei() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProjetosDeLeiContent />
    </Suspense>
  );
}
