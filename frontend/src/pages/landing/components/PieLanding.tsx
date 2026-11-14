import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { LogoErgoCheck } from '../../../components/ui/LogoErgoCheck';

export const PieLanding: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
              <LogoErgoCheck className="w-5 h-5" size={20} />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">ErgoCheck AI</span>
              <span className="text-xs text-slate-400 block">Salud Biomecánica & Supervisión Proctoring</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#modulos" className="hover:text-white transition-colors">
              Módulos
            </a>
            <a href="#privacidad" className="hover:text-white transition-colors">
              Zero-Image Retention
            </a>
            <a href="#planes" className="hover:text-white transition-colors">
              Planes
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="hover:text-white transition-colors">
              Registrar Empresa
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Arquitectura Edge AI conforme a ISO 11226 y seguridad criptográfica SHA-256.</span>
          </div>
          <p>© {new Date().getFullYear()} ErgoCheck AI. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
