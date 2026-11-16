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
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bloques Registrados</span>
          <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
            <Database className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-2xl font-black font-mono text-slate-900 tracking-tight">{totalRegistros}</p>
        <p className="text-[11px] text-slate-400 font-mono">Modo WORM Inmutable</p>
      </div>

      {/* Tarjeta 2: Estado Criptográfico */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Integridad Criptográfica</span>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
            cadenaValida !== false
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              cadenaValida !== false ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500'
            }`}
          />
          <p className="text-sm font-bold text-slate-900">
            {cadenaValida !== false ? 'Cadena 100% Íntegra' : 'Ruptura Detectada'}
          </p>
        </div>
        <p className="text-[11px] text-slate-400 font-mono">
          {tiempoVerificacionMs !== undefined
            ? `Verificado en ${tiempoVerificacionMs} ms`
            : 'Encadenamiento SHA-256'}
        </p>
      </div>

      {/* Tarjeta 3: Último Hash Registrado */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Último Hash (SHA-256)</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Hash className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-xs font-mono text-emerald-700 font-bold truncate" title={ultimoHash}>
          {ultimoHash ? `${ultimoHash.slice(0, 18)}...` : 'GÉNESIS_2026'}
        </p>
        <p className="text-[11px] text-slate-400 font-mono">Cabecera de la Cadena</p>
      </div>

      {/* Tarjeta 4: Estándar y Cumplimiento */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Propósito Normativo</span>
          <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-sm font-bold text-slate-900">No-Repudio & Forense</p>
        <p className="text-[11px] text-slate-400 font-mono">ISO 11226 · Cumplimiento SST</p>
      </div>
    </div>
  );
};
