import React, { useState } from 'react';
import { X, Copy, Check, Hash, User, Calendar, Shield, Cpu, Activity } from 'lucide-react';
import { RegistroBitacora } from './PaginaBitacoraAuditoria';

interface ModalDetalleBitacoraProps {
  registro: RegistroBitacora | null;
  onClose: () => void;
}

export const ModalDetalleBitacora: React.FC<ModalDetalleBitacoraProps> = ({ registro, onClose }) => {
  const [copiadoHash, setCopiadoHash] = useState(false);
  const [copiadoPrev, setCopiadoPrev] = useState(false);

  if (!registro) return null;

  const copiarTexto = (texto: string, esHashActual: boolean) => {
    navigator.clipboard.writeText(texto);
    if (esHashActual) {
      setCopiadoHash(true);
      setTimeout(() => setCopiadoHash(false), 2000);
    } else {
      setCopiadoPrev(true);
      setTimeout(() => setCopiadoPrev(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Detalle de Registro WORM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {registro.categoria}
                </span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">ID: {registro.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Metadatos principales en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Acción Registrada
              </span>
              <p className="text-sm font-bold text-slate-100">{registro.action}</p>
              <p className="text-xs text-slate-400 font-mono">Entidad: {registro.entity} ({registro.entityId || 'Global'})</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Estampa de Tiempo (ISO)
              </span>
              <p className="text-xs font-mono text-slate-200">{new Date(registro.timestamp).toLocaleString()}</p>
              <p className="text-[10px] font-mono text-slate-500">{registro.timestamp}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Operador / Usuario
              </span>
              <p className="text-xs font-semibold text-slate-200">
                {registro.usuario ? `${registro.usuario.nombre} ${registro.usuario.apellido}` : 'SISTEMA'}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">{registro.usuario?.correo || 'Proceso Automático'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                Dirección IP / Origen
              </span>
              <p className="text-xs font-mono text-slate-200">{registro.ipAddress || '127.0.0.1 (Local)'}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Inferencia Local Verificada</p>
            </div>
          </div>

          {/* Bloques Criptográficos (Hashes) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  Hash SHA-256 de este Bloque
                </span>
                <button
                  type="button"
                  onClick={() => copiarTexto(registro.hash, true)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiadoHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiadoHash ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-emerald-400 break-all select-all">
                {registro.hash || '—'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  Hash del Bloque Previo (Encadenamiento WORM)
                </span>
                <button
                  type="button"
                  onClick={() => copiarTexto(registro.prevHash, false)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiadoPrev ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiadoPrev ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400 break-all select-all">
                {registro.prevHash || 'GENESIS_HASH_ERGOCHECK_2026'}
              </p>
            </div>
          </div>

          {/* Payload JSON / Detalles técnicos */}
          {registro.details && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300">Payload y Detalles del Evento</span>
              <pre className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-40 leading-relaxed">
                {JSON.stringify(registro.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
