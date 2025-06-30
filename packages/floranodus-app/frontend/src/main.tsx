import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { assetService } from './services/assetService';

// Console Ninja enhanced logging
console.log('🚀 Floranodus starting...', {
  environment: import.meta.env.MODE,
  timestamp: new Date().toISOString(),
  features: {
    figmaMCP: true,
    webSocket: true,
    localAI: true
  }
});

// Initialize asset service
assetService.loadAssetManifest().then(() => {
  console.log('✅ Assets loaded');
});

// React Flow initialization
console.log('%c[React Flow] Initializing canvas...', 'color: #4a9eff; font-weight: bold');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Performance monitoring with Console Ninja
if (import.meta.env.DEV) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('⚡ Performance:', {
        name: entry.name,
        duration: `${entry.duration.toFixed(2)}ms`,
        type: entry.entryType
      });
    }
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// Performance timing
console.time('NodeRender');
console.timeEnd('NodeRender'); 