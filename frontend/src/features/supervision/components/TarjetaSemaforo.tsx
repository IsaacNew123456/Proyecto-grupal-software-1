import React from 'react';
import { WifiOff, AlertTriangle, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';
import type { PuestoMonitoreo } from '../hooks/useWebSocketSupervisor';

interface Props {
  puesto: PuestoMonitoreo;
  onSeleccionar?: (sessionId: string) => void;
  seleccionado?: boolean;
}

const CONFIG_SEMAFORO = {
  VERDE: {
    label: 'Óptimo',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-500/60',
    dotClass: 'bg-emerald-400 shadow-sm shadow-emerald-400/50',
    Icono: CheckCircle2,
  },
  AMARILLO: {
    label: 'Atención / Distracción',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cardBorder: 'border-amber-500/30 hover:border-amber-500/60',
    dotClass: 'bg-amber-400',
    Icono: AlertTriangle,
  },
  NARANJA: {
    label: 'Riesgo Ergonómico',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    cardBorder: 'border-orange-500/30 hover:border-orange-500/60',
    dotClass: 'bg-orange-400',
    Icono: AlertTriangle,
  },
  ROJO: {
    label: 'Anomalía Crítica',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cardBorder: 'border-rose-500/40 hover:border-rose-500/70',
    dotClass: 'bg-rose-400 animate-pulse',
    Icono: ShieldAlert,
  },
  GRIS: {
    label: 'Desconectado',
    badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    cardBorder: 'border-slate-800 hover:border-slate-700 opacity-80',
    dotClass: 'bg-slate-500',
    Icono: WifiOff,
  },
};

export const TarjetaSemaforo: React.FC<Props> = ({ puesto, onSeleccionar, seleccionado }) => {
  const cfg = CONFIG_SEMAFORO[puesto.estado] || CONFIG_SEMAFORO.GRIS;
  const IconoEstado = cfg.Icono;

  return (
    <div
      onClick={() => onSeleccionar?.(puesto.sessionId)}
      className={`relative rounded-xl bg-slate-900/70 border ${cfg.cardBorder} p-3.5 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        seleccionado ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/10' : ''
      }`}
      title="Haga clic para auditar esta sesión en la línea de tiempo inferior"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
              <h4 className="text-xs font-semibold text-slate-200 truncate">{puesto.usuarioNombre}</h4>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              {puesto.tipo} • {puesto.sessionId.slice(0, 8)}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono shrink-0 ${cfg.badgeClass}`}>
            <IconoEstado className="w-2.5 h-2.5" />
            <span>{cfg.label}</span>
          </div>
        </div>

        {/* Métricas ergonómicas y postura */}
        <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-t border-slate-800/60 font-mono">
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Riesgo RULA</span>
            <span className={`font-bold ${puesto.rulaScore && puesto.rulaScore >= 5 ? 'text-amber-400' : 'text-slate-300'}`}>
              {puesto.rulaScore !== undefined ? `${puesto.rulaScore} pts` : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Pitch Ocular</span>
            <span className="font-bold text-slate-300">
              {puesto.pitchEfectivo !== undefined ? `${puesto.pitchEfectivo.toFixed(1)}°` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div>
        {/* Motivo de Alerta */}
        {puesto.motivoAlerta && (
          <div
            className={`mt-2 text-[9px] font-mono rounded px-2 py-1 leading-tight line-clamp-2 ${
              puesto.estado === 'GRIS'
                ? 'text-slate-400 bg-slate-800/80 border border-slate-700/60'
                : 'text-rose-300 bg-rose-500/10 border border-rose-500/20'
            }`}
          >
            {puesto.motivoAlerta}
          </div>
        )}

        {/* Estado del Watchdog */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-slate-400" />
            <span>{puesto.estado === 'GRIS' ? 'Watchdog > 15s' : 'Telemetría activa'}</span>
          </span>
          <span className="text-emerald-400/80 hover:text-emerald-300 transition-colors">Auditar →</span>
        </div>
      </div>
    </div>
  );
};
