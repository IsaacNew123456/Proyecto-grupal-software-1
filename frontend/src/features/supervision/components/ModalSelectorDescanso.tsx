import React from 'react';
import { X, Sparkles, Utensils, Coffee, UserCheck } from 'lucide-react';

export interface OpcionDescanso {
  id: string;
  titulo: string;
  descripcion: string;
  duracionMin: number;
  categoria: 'activa' | 'comida' | 'hidratacion' | 'personal';
}

const OPCIONES_DESCANSO: OpcionDescanso[] = [
  {
    id: 'estiramiento',
    titulo: 'Pausa Activa / Estiramiento',
    descripcion: 'Ejercicios breves de cuello, muñecas y descanso visual.',
    duracionMin: 10,
    categoria: 'activa',
  },
  {
    id: 'almuerzo',
    titulo: 'Almuerzo / Cena',
    descripcion: 'Pausa principal de alimentación y desconexión laboral.',
    duracionMin: 45,
    categoria: 'comida',
  },
  {
    id: 'cafe',
    titulo: 'Café / Hidratación',
    descripcion: 'Interrupción breve para hidratación o café.',
    duracionMin: 10,
    categoria: 'hidratacion',
  },
  {
    id: 'personal',
    titulo: 'Pausa Personal / Sanitaria',
    descripcion: 'Atención de necesidades sanitarias o personales.',
    duracionMin: 10,
    categoria: 'personal',
  },
];

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onSeleccionar: (opcion: OpcionDescanso) => void;
}

export const ModalSelectorDescanso: React.FC<Props> = ({
  abierto,
  onCerrar,
  onSeleccionar,
}) => {
  if (!abierto) return null;

  const obtenerIcono = (categoria: OpcionDescanso['categoria']) => {
    switch (categoria) {
      case 'activa':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'comida':
        return <Utensils className="w-5 h-5 text-blue-600" />;
      case 'hidratacion':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'personal':
        return <UserCheck className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Programar Descanso Laboral
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              La cámara entrará en reposo para preservar tu privacidad durante la pausa.
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Opciones */}
        <div className="p-6 space-y-3">
          {OPCIONES_DESCANSO.map((op) => (
            <button
              key={op.id}
              onClick={() => onSeleccionar(op)}
              className="w-full flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all text-left group"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 group-hover:bg-white group-hover:shadow-2xs transition-all shrink-0">
                {obtenerIcono(op.categoria)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {op.titulo}
                  </h4>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                    {op.duracionMin} min
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {op.descripcion}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Pie */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>El tiempo de pausa se computará en tu balance diario</span>
          <button
            onClick={onCerrar}
            className="px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
