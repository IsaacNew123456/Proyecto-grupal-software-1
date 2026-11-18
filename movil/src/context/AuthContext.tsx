import React, { createContext, useContext, useState, useEffect } from 'react';
import { UsuarioAutenticado, ApiService } from '../services/api';
import { StorageService } from '../services/storage';

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  cargando: boolean;
  esPostulanteBloqueado: boolean;
  iniciarSesion: (correo: string, clave: string) => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
  limpiarBloqueoPostulante: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [esPostulanteBloqueado, setEsPostulanteBloqueado] = useState(false);

  useEffect(() => {
    restaurarSesion();
  }, []);

  const restaurarSesion = async () => {
    try {
      const tokenGuardado = await StorageService.obtenerToken();
      const usuarioGuardado = await StorageService.obtenerUsuario();

      if (tokenGuardado && usuarioGuardado) {
        if (usuarioGuardado.rol === 'POSTULANTE') {
          setEsPostulanteBloqueado(true);
          await StorageService.limpiarTodo();
        } else {
          setToken(tokenGuardado);
          setUsuario(usuarioGuardado);
        }
      }
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (correo: string, clave: string): Promise<boolean> => {
    setCargando(true);
    try {
      const resp = await ApiService.login(correo, clave);

      if (resp.usuario.rol === 'POSTULANTE') {
        setEsPostulanteBloqueado(true);
        await StorageService.limpiarTodo();
        return false;
      }

      setUsuario(resp.usuario);
      setToken(resp.token);
      return true;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    await StorageService.limpiarTodo();
    setUsuario(null);
    setToken(null);
  };

  const limpiarBloqueoPostulante = () => {
    setEsPostulanteBloqueado(false);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        esPostulanteBloqueado,
        iniciarSesion,
        cerrarSesion,
        limpiarBloqueoPostulante,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
