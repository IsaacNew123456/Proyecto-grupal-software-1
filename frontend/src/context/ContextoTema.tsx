import React, { createContext, useContext, useEffect, useState } from 'react';

export type Tema = 'claro' | 'oscuro';

interface ContextoTemaTipo {
  tema: Tema;
  alternarTema: () => void;
  esOscuro: boolean;
}

const ContextoTema = createContext<ContextoTemaTipo>({} as ContextoTemaTipo);

export const ProveedorTema: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<Tema>(() => {
    try {
      const guardado = localStorage.getItem('ergocheck_tema');
      if (guardado === 'oscuro' || guardado === 'claro') {
        return guardado;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
    } catch {
      return 'claro';
    }
  });

  useEffect(() => {
    const raiz = document.documentElement;
    if (tema === 'oscuro') {
      raiz.classList.add('dark');
      raiz.setAttribute('data-theme', 'dark');
    } else {
      raiz.classList.remove('dark');
      raiz.setAttribute('data-theme', 'light');
    }

    try {
      localStorage.setItem('ergocheck_tema', tema);
    } catch {
      // Ignorar en caso de restricciones de almacenamiento
    }
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
  };

  return (
    <ContextoTema.Provider
      value={{
        tema,
        alternarTema,
        esOscuro: tema === 'oscuro',
      }}
    >
      {children}
    </ContextoTema.Provider>
  );
};

export const useTema = () => useContext(ContextoTema);
