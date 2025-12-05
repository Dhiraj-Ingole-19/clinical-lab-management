// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// THIS IS THE FIX:
// We are importing 'AuthProvider' as the default export (no curly braces)
// to match the change we made in AuthContext.jsx
import AuthProvider from './context/AuthContext.jsx';

import App from './App.jsx';

const queryClient = new QueryClient();
import { PwaProvider } from './context/PwaContext.jsx';

// FORCE UNREGISTER ALL SERVICE WORKERS (To fix stale cache issues)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      console.log('Unregistering SW:', registration);
      registration.unregister();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PwaProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PwaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);