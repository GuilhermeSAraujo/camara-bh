// client/main.js
import { Meteor } from 'meteor/meteor';
import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../app/general/App';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
  </div>
);

Meteor.startup(() => {
  const root = createRoot(document.getElementById('app'));
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </StrictMode>
  );
});
