import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Video, CheckCircle2 } from 'lucide-react';

export const HeroLanding: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#F8FAFC] border-b border-slate-200/80">
      {/* Fondo con cuadrícula sutil */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Arquitectura Edge AI · Norma ISO 11226 · Privacidad Zero-Image</span>
          </div>

          {/* Titular Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Salud Ergonómica y Supervisión Anti-Fraude{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              100% en el Navegador
            </span>
          </h1>

          {/* Subtítulo Descriptivo */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Plataforma B2B para evaluación postural RULA en puestos de teletrabajo y proctoring
            inteligente en exámenes psicotécnicos. Procesamiento biométrico efímero en RAM que jamás
            graba ni transmite video a la nube.
          </p>

          {/* Botones de Llamado a la Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/registro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm hover:shadow transition-all group"
            >
              <span>Comenzar Prueba Gratuita</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <span>Acceso de Usuarios</span>
            </Link>
          </div>

          {/* Garantías de Seguridad */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sin instalar aplicaciones nativas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consentimiento legal digital obligatorio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Aislamiento multi-tenant estricto</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Visual de Telemetría Biomecánica en Vivo */}
        <div className="mt-14 max-w-4xl mx-auto bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Sensor Biomecánico Edge AI Activo
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">ISO 11226 · RULA Engine v2</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-1">Puntuación RULA</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">2 / 7</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">Postura Aceptable</span>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-1">Orientación Cabeza</span>
              <span className="text-2xl font-bold font-mono text-slate-100">PnP 0°</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Enfoque Frontal</span>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-1">Transmisión de Video</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">0 KB</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">Cero Video Persistido</span>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-1">Integridad WORM</span>
              <span className="text-2xl font-bold font-mono text-slate-100">SHA-256</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cadena Verificada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
