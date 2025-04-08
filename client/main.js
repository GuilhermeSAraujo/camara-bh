import React, { StrictMode } from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../app/general/App';

// Função para lidar com preloading
const setupPreloading = async () => {
  try {
    // Carrega o manifesto de preload
    const response = await fetch('/preload-manifest.json');
    const manifest = await response.json();

    if (manifest.criticalComponents && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        manifest.criticalComponents.forEach((path) => {
          import(path).catch((err) => console.warn('Preload error:', err));
        });
      });
    }
  } catch (error) {
    console.warn('Preload manifest error:', error);
  }
};

Meteor.startup(() => {
  // Inicia o preload
  setupPreloading();

  const root = createRoot(document.getElementById('app'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
