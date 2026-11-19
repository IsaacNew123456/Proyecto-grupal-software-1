import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProveedorTema } from './context/ContextoTema';
import { ProveedorNotificacion } from './context/ContextoNotificacion';
import { ProveedorAutenticacion } from './context/ContextoAutenticacion';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProveedorTema>
        <ProveedorNotificacion>
          <ProveedorAutenticacion>
            <AppRoutes />
          </ProveedorAutenticacion>
        </ProveedorNotificacion>
      </ProveedorTema>
    </BrowserRouter>
  );
};

export default App;
