import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProgressProvider } from './context/ProgressContext.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <App />
          <Toaster position="top-right" richColors />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
