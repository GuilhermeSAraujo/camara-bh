import React, { StrictMode, Suspense } from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../app/general/App';

// Function to handle preloading
const setupPreloading = async () => {
  try {
    // Load the preload manifest
    const response = await fetch('/preload-manifest.json');
    const manifest = await response.json();

    if (manifest.criticalComponents && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        manifest.criticalComponents.forEach((path) => {
          import(path)
            .then((v) => console.log('component', path, 'loaded'))
            .catch((err) => console.warn('Preload error:', err));
        });
      });
    }
  } catch (error) {
    console.warn('Preload manifest error:', error);
  }
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
  </div>
);

Meteor.startup(() => {
  // Start preloading
  setupPreloading();

  const root = createRoot(document.getElementById('app'));
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </StrictMode>
  );
});
