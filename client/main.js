import React, { StrictMode } from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../app/general/App';

const preloadCriticalComponents = () => {
  const criticalComponents = [
    '../app/pages/projetosDeLei/ProjetosDeLeiList',
    '../app/components/ui/ChartDetailsModal',
  ];

  // Inicia o preload após o carregamento da página
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalComponents.forEach((component) => {
        import(component);
      });
    });
  } else {
    // Fallback para browsers que não suportam requestIdleCallback
    setTimeout(() => {
      criticalComponents.forEach((component) => {
        import(component);
      });
    }, 1000);
  }
};

Meteor.startup(() => {
  // Inicia o preload
  preloadCriticalComponents();

  const root = createRoot(document.getElementById('app'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
