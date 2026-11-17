import React, { useEffect, useState } from 'react';
import { Play, ShieldCheck, Clock } from 'lucide-react';
import { OpcionDescanso } from './ModalSelectorDescanso';

interface Props {
  descanso: OpcionDescanso;
  inicioTimestamp: number;
  onReanudar: () => void;
}

export const BannerDescansoActivo: React.FC<Props> = ({
  descanso,
  inicioTimestamp,
  onReanudar,
}) => {
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);

  useEffect(() => {
    const calcular = () => {
      const segs = Math.floor((Date.now() - inicioTimestamp) / 1000);
      setSegundosTranscurridos(segs >= 0 ? segs : 0);
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [inicioTimestamp]);

  const minutos = Math.floor(segundosTranscurridos / 60);
  const segundos = segundosTranscurridos % 60;
  const tiempoFormateado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  const excedeProgramado = minutos >= descanso.duracionMin;

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-linear-to-r from-amber-50/90 via-amber-50/40 to-white p-5 shadow-xs animate-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900 font-semibold">
                Pausa en Curso
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {descanso.titulo}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Cámara en reposo. Sensor biométrico pausado para resguardo de privacidad.</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Tiempo en pausa / Programado: {descanso.duracionMin}m
            </span>
            <span className={`text-xl font-bold font-mono ${
              excedeProgramado ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {tiempoFormateado}
            </span>
          </div>

          <button
            onClick={onReanudar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-tight shadow-sm transition-all hover:shadow-emerald-600/20 active:scale-98 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Reanudar Jornada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
