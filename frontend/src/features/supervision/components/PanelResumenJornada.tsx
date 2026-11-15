import React from 'react';
import { CheckCircle, Clock, Coffee, Activity, RotateCcw } from 'lucide-react';
import { RegistroPausa } from './HistorialPausasTeletrabajo';

interface Props {
  horaInicio: string;
  horaFin: string;
  tiempoActivoSeg: number;
  tiempoOciosoSeg: number;
  tiempoDescansoSeg: number;
  historialPausas: RegistroPausa[];
  onReiniciar: () => void;
}

export const PanelResumenJornada: React.FC<Props> = ({
  horaInicio,
  horaFin,
  tiempoActivoSeg,
  tiempoDescansoSeg,
  historialPausas,
  onReiniciar,
}) => {
  const formatoTiempo = (segsTotales: number) => {
    const horas = Math.floor(segsTotales / 3600);
    const mins = Math.floor((segsTotales % 3600) / 60);
    const segs = segsTotales % 60;
    if (horas > 0) return `${horas}h ${mins}m ${segs}s`;
    if (mins > 0) return `${mins}m ${segs}s`;
    return `${segs}s`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 space-y-6 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
          Jornada Completada con Éxito
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-2">
          Resumen Diario de Teletrabajo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Tus marcas de tiempo y balances de foco han sido consolidados localmente.
        </p>
      </div>

      {/* Grid de Métricas Finales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Ingreso</span>
          </div>
          <p className="text-lg font-mono font-bold text-slate-900 mt-1">{horaInicio}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Salida</span>
          </div>
          <p className="text-lg font-mono font-bold text-slate-900 mt-1">{horaFin}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Foco Activo</span>
          </div>
          <p className="text-lg font-mono font-bold text-emerald-700 mt-1">
            {formatoTiempo(tiempoActivoSeg)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>Pausas ({historialPausas.length})</span>
          </div>
          <p className="text-lg font-mono font-bold text-slate-900 mt-1">
            {formatoTiempo(tiempoDescansoSeg)}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onReiniciar}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-tight shadow-sm active:scale-98 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Iniciar Nueva Jornada</span>
        </button>
      </div>
    </div>
  );
};
