import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  FileText,
  Edit3,
} from 'lucide-react';
import { api } from '../../../api/client';
import { ModalAuditarIncidente } from './ModalAuditarIncidente';

export interface SignalExplicativa {
  tipo: string;
  criterio?: string;
  valor?: any;
  timestamp: string;
  confianza?: number;
  recomendacionForense?: string;
}

export interface Incidente {
  id: string;
  sessionId: string;
  tipo: string;
  severidad: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'DESESTIMADO' | 'FALSO_POSITIVO';
  resumen: string;
  signals?: SignalExplicativa[];
  timestamp: string;
  justificacion?: string;
}

interface Props {
  sessionId: string;
  onIncidenteAuditado?: () => void;
}

const SEVERIDAD_CONFIG = {
  CRITICAL: { label: 'Crítico', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  HIGH: { label: 'Alto', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  MEDIUM: { label: 'Medio', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  LOW: { label: 'Bajo', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export const LineaTiempoIncidentes: React.FC<Props> = ({ sessionId, onIncidenteAuditado }) => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [auditandoId, setAuditandoId] = useState<string | null>(null);
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [incidenteModal, setIncidenteModal] = useState<Incidente | null>(null);

  const cargarIncidentes = async () => {
    if (!sessionId) return;
    setCargando(true);
    try {
      const res = await api.get(`/supervision/incidentes/${sessionId}`);
      setIncidentes(res.data || []);
    } catch {
      setIncidentes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarIncidentes();
  }, [sessionId]);

  const auditarRapido = async (incidenteId: string, estado: string) => {
    setAuditandoId(incidenteId);
    try {
      await api.put(`/supervision/incidentes/${incidenteId}/auditar`, {
        estado,
        justificacion: `Auditado por el supervisor como ${estado} mediante acción rápida en consola`,
      });
      await cargarIncidentes();
      onIncidenteAuditado?.();
    } catch {
      // Ignorar error
    } finally {
      setAuditandoId(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-semibold text-slate-200">Incidentes Correlacionados por Reglas (CU20 / CU22)</h4>
          <span className="text-[10px] font-mono text-slate-500">({incidentes.length})</span>
        </div>
        <button
          onClick={cargarIncidentes}
          disabled={cargando}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Actualizar incidentes"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {incidentes.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs font-mono bg-slate-950/40 rounded-xl border border-slate-800/60">
          Cero anomalías o incidentes reportados en esta sesión. Presione &quot;Ejecutar Correlación (CU20)&quot; para evaluar eventos.
        </div>
      ) : (
        <div className="space-y-2.5">
          {incidentes.map((inc) => {
            const sev = SEVERIDAD_CONFIG[inc.severidad] || SEVERIDAD_CONFIG.LOW;
            const tieneSignals = inc.signals && inc.signals.length > 0;
            const estaExpandido = expandidoId === inc.id;

            return (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono ${sev.badge}`}>
                        {sev.label}
                      </span>
                      <span className="font-semibold text-slate-200 text-xs">{inc.tipo}</span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(inc.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{inc.resumen}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase ${
                        inc.estado === 'CONFIRMADO'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : inc.estado === 'DESESTIMADO'
                          ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          : inc.estado === 'FALSO_POSITIVO'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {inc.estado}
                    </span>

                    <button
                      type="button"
                      onClick={() => setIncidenteModal(inc)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Abrir modal para dictamen forense personalizado"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Justificación si ya fue auditado */}
                {inc.justificacion && (
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-start gap-1.5">
                    <FileText className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Nota Forense:</strong> {inc.justificacion}</span>
                  </div>
                )}

                {/* Botón para expandir señales explicativas */}
                {tieneSignals && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandidoId(estaExpandido ? null : inc.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
                    >
                      <Cpu className="w-3 h-3" />
                      <span>{estaExpandido ? 'Ocultar Señales Explicativas' : `Ver Señales Explicativas (${inc.signals?.length} signals)`}</span>
                      {estaExpandido ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {estaExpandido && (
                      <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-2">
                        {inc.signals?.map((sig, sIdx) => (
                          <div key={sIdx} className="space-y-1 pb-2 border-b border-slate-800/60 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-emerald-400 font-semibold">{sig.tipo}</span>
                              {sig.confianza && (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  {sig.confianza}% confianza
                                </span>
                              )}
                            </div>
                            {sig.criterio && <p className="text-slate-300 text-[10px]">{sig.criterio}</p>}
                            {sig.recomendacionForense && (
                              <p className="text-amber-400/90 text-[10px] flex items-start gap-1">
                                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                                <span>{sig.recomendacionForense}</span>
                              </p>
                            )}
                            {sig.valor && (
                              <pre className="p-1.5 rounded bg-black/60 text-[9px] text-sky-300 overflow-x-auto">
                                {JSON.stringify(sig.valor, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Acciones de auditoría rápida */}
                {inc.estado === 'PENDIENTE' && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => auditarRapido(inc.id, 'FALSO_POSITIVO')}
                      disabled={auditandoId === inc.id}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Falso Positivo</span>
                    </button>
                    <button
                      onClick={() => auditarRapido(inc.id, 'DESESTIMADO')}
                      disabled={auditandoId === inc.id}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3 text-slate-400" />
                      <span>Desestimar</span>
                    </button>
                    <button
                      onClick={() => auditarRapido(inc.id, 'CONFIRMADO')}
                      disabled={auditandoId === inc.id}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>Confirmar Falta</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal interactivo de auditoría con justificación técnica (CU22) */}
      <ModalAuditarIncidente
        incidente={incidenteModal}
        abierto={!!incidenteModal}
        onCerrar={() => setIncidenteModal(null)}
        onAuditado={() => {
          cargarIncidentes();
          onIncidenteAuditado?.();
        }}
      />
    </div>
  );
};
