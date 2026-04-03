import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { SiteProvider } from './context/SiteContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SiteProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color:      '#e2e8f0',
                border:     '1px solid rgba(139,92,246,0.3)',
                borderRadius: '10px',
              },
            }}
          />
          <App />
        </SiteProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);