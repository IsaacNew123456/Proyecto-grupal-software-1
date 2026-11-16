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
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cardBorder: 'border-slate-200 hover:border-emerald-400',
    dotClass: 'bg-emerald-500 shadow-sm shadow-emerald-500/30',
    Icono: CheckCircle2,
  },
  AMARILLO: {
    label: 'Atención / Distracción',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    cardBorder: 'border-slate-200 hover:border-amber-400',
    dotClass: 'bg-amber-500',
    Icono: AlertTriangle,
  },
  NARANJA: {
    label: 'Riesgo Ergonómico',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    cardBorder: 'border-slate-200 hover:border-orange-400',
    dotClass: 'bg-orange-500',
    Icono: AlertTriangle,
  },
  ROJO: {
    label: 'Anomalía Crítica',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    cardBorder: 'border-rose-200 hover:border-rose-400',
    dotClass: 'bg-rose-500 animate-pulse',
    Icono: ShieldAlert,
  },
  GRIS: {
    label: 'Desconectado',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    cardBorder: 'border-slate-200 hover:border-slate-300 opacity-90',
    dotClass: 'bg-slate-400',
    Icono: WifiOff,
  },
};

export const TarjetaSemaforo: React.FC<Props> = ({ puesto, onSeleccionar, seleccionado }) => {
  const cfg = CONFIG_SEMAFORO[puesto.estado] || CONFIG_SEMAFORO.GRIS;
  const IconoEstado = cfg.Icono;

  return (
    <div
      onClick={() => onSeleccionar?.(puesto.sessionId)}
      className={`relative rounded-2xl bg-white border ${cfg.cardBorder} p-3.5 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md ${
        seleccionado ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-sm' : ''
      }`}
      title="Haga clic para auditar esta sesión en la línea de tiempo inferior"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
              <h4 className="text-xs font-semibold text-slate-900 truncate">{puesto.usuarioNombre}</h4>
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
        <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-t border-slate-100 font-mono">
          <div>
            <span className="text-slate-400 text-[9px] block uppercase">Riesgo RULA</span>
            <span className={`font-bold ${puesto.rulaScore && puesto.rulaScore >= 5 ? 'text-amber-700' : 'text-slate-800'}`}>
              {puesto.rulaScore !== undefined ? `${puesto.rulaScore} pts` : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[9px] block uppercase">Pitch Ocular</span>
            <span className="font-bold text-slate-800">
              {puesto.pitchEfectivo !== undefined ? `${puesto.pitchEfectivo.toFixed(1)}°` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div>
        {/* Motivo de Alerta */}
        {puesto.motivoAlerta && (
          <div
            className={`mt-2 text-[9px] font-mono rounded-lg px-2 py-1 leading-tight line-clamp-2 ${
              puesto.estado === 'GRIS'
                ? 'text-slate-600 bg-slate-100 border border-slate-200'
                : 'text-rose-700 bg-rose-50 border border-rose-200'
            }`}
          >
            {puesto.motivoAlerta}
          </div>
        )}

        {/* Estado del Watchdog */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-slate-400" />
            <span>{puesto.estado === 'GRIS' ? 'Watchdog > 15s' : 'Telemetría activa'}</span>
          </span>
          <span className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Auditar →</span>
        </div>
      </div>
    </div>
  );
};
