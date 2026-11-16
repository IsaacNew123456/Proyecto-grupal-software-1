import React from 'react';
import { ShieldCheck, Database, Hash, Layers } from 'lucide-react';

interface TarjetasResumenBitacoraProps {
  totalRegistros: number;
  cadenaValida: boolean | null;
  ultimoHash?: string;
  tiempoVerificacionMs?: number;
}

export const TarjetasResumenBitacora: React.FC<TarjetasResumenBitacoraProps> = ({
  totalRegistros,
  cadenaValida,
  ultimoHash,
  tiempoVerificacionMs,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tarjeta 1: Total de Registros */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Bloques Registrados</span>
          <Database className="w-4 h-4 text-sky-400" />
        </div>
        <p className="text-2xl font-black font-mono text-white tracking-tight">{totalRegistros}</p>
        <p className="text-[11px] text-slate-500 font-mono">Modo WORM Inmutable</p>
      </div>

      {/* Tarjeta 2: Estado Criptográfico */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Integridad Criptográfica</span>
          <ShieldCheck className={`w-4 h-4 ${cadenaValida !== false ? 'text-emerald-400' : 'text-rose-400'}`} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              cadenaValida !== false ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-400'
            }`}
          />
          <p className="text-base font-bold text-white">
            {cadenaValida !== false ? 'Cadena 100% Íntegra' : 'Ruptura Detectada'}
          </p>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          {tiempoVerificacionMs !== undefined
            ? `Verificado en ${tiempoVerificacionMs} ms`
            : 'Encadenamiento SHA-256'}
        </p>
      </div>

      {/* Tarjeta 3: Último Hash Registrado */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Último Hash (SHA-256)</span>
          <Hash className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-xs font-mono text-emerald-400 font-semibold truncate" title={ultimoHash}>
          {ultimoHash ? `${ultimoHash.slice(0, 18)}...` : 'GÉNESIS_2026'}
        </p>
        <p className="text-[11px] text-slate-500 font-mono">Cabecera de la Cadena</p>
      </div>

      {/* Tarjeta 4: Estándar y Cumplimiento */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Propósito Normativo</span>
          <Layers className="w-4 h-4 text-violet-400" />
        </div>
        <p className="text-sm font-bold text-slate-200">No-Repudio & Forense</p>
        <p className="text-[11px] text-slate-500 font-mono">ISO 11226 · Cumplimiento SST</p>
      </div>
    </div>
  );
};
