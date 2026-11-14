import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { LogoErgoCheck } from '../../../components/ui/LogoErgoCheck';

export const CabeceraLanding: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Marca y Logotipo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <LogoErgoCheck className="w-5 h-5" size={20} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">ErgoCheck AI</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                SST & Proctoring
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Plataforma Empresarial</span>
          </div>
        </Link>

        {/* Enlaces de Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#modulos" className="hover:text-slate-900 transition-colors">
            Módulos del Sistema
          </a>
          <a href="#privacidad" className="hover:text-slate-900 transition-colors">
            Privacidad Zero-Image
          </a>
          <a href="#planes" className="hover:text-slate-900 transition-colors">
            Planes y Precios
          </a>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ISO 11226 / RULA</span>
          </div>
        </nav>

        {/* Acciones de Entrada */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow transition-all"
          >
            <span>Registrar Empresa</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>

        {/* Botón de Menú Móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#modulos"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm font-medium text-slate-700 hover:text-slate-900 py-1.5"
          >
            Módulos del Sistema
          </a>
          <a
            href="#privacidad"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm font-medium text-slate-700 hover:text-slate-900 py-1.5"
          >
            Privacidad Zero-Image
          </a>
          <a
            href="#planes"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm font-medium text-slate-700 hover:text-slate-900 py-1.5"
          >
            Planes y Precios
          </a>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900"
            >
              Registrar Empresa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
