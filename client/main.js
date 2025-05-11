// client/main.js
import { Meteor } from 'meteor/meteor';
import React, { StrictMode, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../app/general/App';

// Define critical chunks to preload
const CRITICAL_CHUNKS = [
  // Add your critical chunks here - adjust paths based on your build output
  '/app/ui/Sidebar.js',
  '/app/ui/Breadcrumb.js',
  '/app/pages/projetosDeLei/ProjetosDeLei.js',
  '/app/pages/projetosDeLei/ProjetosDeLeiList.js',
];

// Helper to add preload link tags to head
const addPreloadLinks = (paths, type = 'script') => {
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = path;
    link.crossOrigin = 'anonymous'; // Add if needed for CORS
    document.head.appendChild(link);
  });
};

// Helper to add prefetch link tags to head (lower priority than preload)
const addPrefetchLinks = (paths, type = 'script') => {
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = type;
    link.href = path;
    document.head.appendChild(link);
  });
};

// Component to handle dynamic imports during idle time
const AssetPreloader = () => {
  useEffect(() => {
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(
        () => {
          // Dynamic imports during idle time
          import('../app/components/ui/AppSidebar').catch((err) =>
            console.warn('Prefetch error:', err)
          );

          import('../app/pages/projetosDeLei/ProjetosDeLei').catch((err) =>
            console.warn('Prefetch error:', err)
          );

          import('../app/pages/projetosDeLei/ProjetosDeLeiList').catch((err) =>
            console.warn('Prefetch error:', err)
          );
        },
        { timeout: 2000 }
      );

      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleCallback);
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
  </div>
);

// Enhanced App wrapper with preloading
const EnhancedApp = () => (
  <>
    <AssetPreloader />
    <App />
  </>
);

Meteor.startup(() => {
  // Add preload links as early as possible
  addPreloadLinks(CRITICAL_CHUNKS);

  // Add prefetch for less critical resources
  addPrefetchLinks([
    '/app/components/ui/ChartDetailsModal.js',
    '/app/components/TextToSpeech.js',
    '/app/components/ui/AppSidebar.js',
    '/app/components/ui/Breadcrumb.js',
    '/app/pages/projetosDeLei/ProjetosDeLei.js',
    '/app/pages/projetosDeLei/ProjetosDeLeiList.js',
  ]);

  const root = createRoot(document.getElementById('app'));
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <EnhancedApp />
      </Suspense>
    </StrictMode>
  );
});
