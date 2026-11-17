import React from 'react';
import { Coffee, Utensils, Sparkles, UserCheck, Clock } from 'lucide-react';
import { OpcionDescanso } from './ModalSelectorDescanso';

export interface RegistroPausa {
  id: string;
  opcion: OpcionDescanso;
  horaInicio: string;
  duracionSegundos: number;
}

interface Props {
  historial: RegistroPausa[];
}

export const HistorialPausasTeletrabajo: React.FC<Props> = ({ historial }) => {
  const formatearDuracion = (segs: number) => {
    const mins = Math.floor(segs / 60);
    const s = segs % 60;
    if (mins === 0) return `${s}s`;
    return `${mins}m ${s > 0 ? `${s}s` : ''}`;
  };

  const obtenerIcono = (categoria: OpcionDescanso['categoria']) => {
    switch (categoria) {
      case 'activa':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'comida':
        return <Utensils className="w-4 h-4 text-blue-600" />;
      case 'hidratacion':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'personal':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Bitácora de Pausas de la Jornada
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          {historial.length} {historial.length === 1 ? 'pausa' : 'pausas'}
        </span>
      </div>

      {historial.length === 0 ? (
        <div className="py-8 text-center">
          <Coffee className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Sin pausas registradas en esta jornada
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Las pausas de comida, café y estiramiento aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {historial.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                  {obtenerIcono(item.opcion.categoria)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    {item.opcion.titulo}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Inició a las {item.horaInicio}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-800">
                  {formatearDuracion(item.duracionSegundos)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  prog: {item.opcion.duracionMin}m
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
