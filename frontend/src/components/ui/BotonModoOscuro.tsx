import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTema } from '../../context/ContextoTema';

interface Props {
  mostrarTexto?: boolean;
  className?: string;
}

export const BotonModoOscuro: React.FC<Props> = ({ mostrarTexto = false, className = '' }) => {
  const { esOscuro, alternarTema } = useTema();

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`inline-flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border select-none ${
        esOscuro
          ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-400 border-slate-700/80 shadow-2xs'
          : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200/90 shadow-2xs'
      } ${className}`}
    >
      {esOscuro ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 rotate-0" />
      )}
      {mostrarTexto ? (
        <span className="hidden sm:inline">
          {esOscuro ? 'Modo Claro' : 'Modo Oscuro'}
        </span>
      ) : null}
    </button>
  );
};
