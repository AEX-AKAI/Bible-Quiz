import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register Service Worker in production; unregister and clear stale caches in development
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New update available; prompt reload');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
    });
  } else {
    // Development mode: Unregister any existing service worker to guarantee fresh assets and instant HMR on mobile
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[Dev] Unregistered stale service worker for fresh mobile testing');
          }
        });
      }
    });

    // Also clear CacheStorage from previous builds if present
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          if (key.startsWith('bible-quiz')) {
            caches.delete(key);
          }
        }
      });
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
