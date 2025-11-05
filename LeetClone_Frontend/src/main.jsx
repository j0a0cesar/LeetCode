import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0e0e0e',
              color: '#e5e7eb',
              border: '1px solid rgba(255,255,255,0.08)',
            },
            success: {
              style: { background: '#0e0e0e', color: '#e5e7eb' },
            },
            error: {
              style: { background: '#1a0b0b', color: '#fecaca' },
            },
          }}
        />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
