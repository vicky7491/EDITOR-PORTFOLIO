import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast container — used throughout admin panel */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a2e',
              color:      '#e2e8f0',
              border:     '1px solid rgba(139,92,246,0.3)',
              borderRadius: '10px',
              fontSize:   '14px',
            },
            success: {
              iconTheme: { primary: '#8b5cf6', secondary: '#1a1a2e' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1a1a2e' },
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);