import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Cpu,
} from 'lucide-react';
import type { Incidente } from './LineaTiempoIncidentes';
import { api } from '../../../api/client';

interface Props {
  incidente: Incidente | null;
  abierto: boolean;
  onCerrar: () => void;
  onAuditado: () => void;
}

export const ModalAuditarIncidente: React.FC<Props> = ({
  incidente,
  abierto,
  onCerrar,
  onAuditado,
}) => {
  if (!abierto || !incidente) return null;

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<'CONFIRMADO' | 'DESESTIMADO' | 'FALSO_POSITIVO'>(
    incidente.estado === 'PENDIENTE' ? 'CONFIRMADO' : (incidente.estado as any),
  );
  const [justificacion, setJustificacion] = useState(
    incidente.justificacion || '',
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardarAuditoria = async () => {
    if (!justificacion.trim()) {
      setError('Debe ingresar una justificación o nota forense para registrar el dictamen.');
      return;
    }

    setGuardando(true);
    setError(null);
    try {
      await api.put(`/supervision/incidentes/${incidente.id}/auditar`, {
        estado: estadoSeleccionado,
        justificacion: justificacion.trim(),
      });
      onAuditado();
      onCerrar();
    } catch {
      setError('Error al registrar dictamen de auditoría. Intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 text-slate-200">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Auditar Incidente Forense (CU22)</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Dictamen pericial con registro inmutable WORM
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumen del Incidente */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="font-semibold text-emerald-400">{incidente.tipo}</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date(incidente.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{incidente.resumen}</p>

          {incidente.signals && incidente.signals.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <Cpu className="w-3 h-3 text-sky-400" />
              <span>{incidente.signals.length} señal(es) explicativas generadas por motor CU20</span>
            </div>
          )}
        </div>

        {/* Selección de Dictamen */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Dictamen de Auditoría:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setEstadoSeleccionado('CONFIRMADO')}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                estadoSeleccionado === 'CONFIRMADO'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-[11px]">Confirmar Falta</span>
            </button>

            <button
              type="button"
              onClick={() => setEstadoSeleccionado('DESESTIMADO')}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                estadoSeleccionado === 'DESESTIMADO'
                  ? 'bg-slate-700/40 border-slate-500 text-white font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <XCircle className="w-4 h-4 text-slate-400" />
              <span className="text-[11px]">Desestimar</span>
            </button>

            <button
              type="button"
              onClick={() => setEstadoSeleccionado('FALSO_POSITIVO')}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                estadoSeleccionado === 'FALSO_POSITIVO'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">Falso Positivo</span>
            </button>
          </div>
        </div>

        {/* Justificación Forense */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Justificación Técnica / Observaciones:</span>
          </label>
          <textarea
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            rows={3}
            placeholder="Ingrese el motivo forense del dictamen (ej. Reflejo de luz en lentes, uso confirmado de smartphone)..."
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono resize-none"
          />
          {error && <p className="text-[10px] text-rose-400 font-mono">{error}</p>}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardarAuditoria}
            disabled={guardando}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{guardando ? 'Firmando Dictamen...' : 'Registrar Dictamen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
