import React, { useState, useEffect } from 'react';
import {
  Monitor,
  ShieldCheck,
  PlayCircle,
  Activity,
  Sparkles,
  RefreshCw,
  User,
  Clock,
  Layers,
  FileSpreadsheet,
  FileText,
  Download,
} from 'lucide-react';
import { ConsolaMosaicoSemaforo } from '../../features/supervision/components/ConsolaMosaicoSemaforo';
import { LineaTiempoIncidentes } from '../../features/supervision/components/LineaTiempoIncidentes';
import { api } from '../../api/client';

interface SesionResumen {
  id: string;
  tipo: string;
  estado: string;
  inicio: string;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
  };
  _count?: {
    eventosConducta: number;
    incidentes: number;
  };
}

export const PaginaConsolaSupervision: React.FC = () => {
  const [sesiones, setSesiones] = useState<SesionResumen[]>([]);
  const [sessionIdAuditoria, setSessionIdAuditoria] = useState('');
  const [indices, setIndices] = useState<any | null>(null);
  const [correlacionando, setCorrelacionando] = useState(false);
  const [generandoDemo, setGenerandoDemo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);

  const cargarSesiones = async () => {
    try {
      const res = await api.get('/supervision/sesiones');
      setSesiones(res.data || []);
      if (res.data && res.data.length > 0 && !sessionIdAuditoria) {
        setSessionIdAuditoria(res.data[0].id);
      }
    } catch {
      setSesiones([]);
    }
  };

  useEffect(() => {
    cargarSesiones();
  }, []);

  const ejecutarCorrelacion = async (targetId?: string) => {
    const sid = targetId || sessionIdAuditoria.trim();
    if (!sid) return;
    setCorrelacionando(true);
    setMensajeExito(null);
    try {
      const resCorrelacion = await api.post(`/supervision/correlacion/${sid}`);
      const resIndices = await api.get(`/supervision/indices/${sid}`);
      setIndices(resIndices.data);
      setMensajeExito(
        `Motor CU20 ejecutado con éxito: ${resCorrelacion.data.total} incidentes correlacionados mediante ventanas deslizantes.`,
      );
    } catch {
      // Ignorar
    } finally {
      setCorrelacionando(false);
    }
  };

  const generarSesionDemo = async () => {
    setGenerandoDemo(true);
    setMensajeExito(null);
    try {
      const res = await api.post('/supervision/sesiones/demo');
      const nuevaId = res.data.sessionId;
      setSessionIdAuditoria(nuevaId);
      await cargarSesiones();
      await ejecutarCorrelacion(nuevaId);
      setMensajeExito(
        '¡Sesión demo generada y correlacionada! Se inyectaron 10 eventos biométricos y se ejecutaron las reglas CU20.',
      );
    } catch {
      // Manejar error silencioso
    } finally {
      setGenerandoDemo(false);
    }
  };

  const descargarExcel = async () => {
    if (!sessionIdAuditoria) return;
    setDescargandoExcel(true);
    try {
      const res = await api.get(`/supervision/reportes/${sessionIdAuditoria}/ergonomico-excel`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-ergonomico-${sessionIdAuditoria.slice(0, 8)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Ignorar error
    } finally {
      setDescargandoExcel(false);
    }
  };

  const descargarPdf = async () => {
    if (!sessionIdAuditoria) return;
    setDescargandoPdf(true);
    try {
      const res = await api.get(`/supervision/reportes/${sessionIdAuditoria}/forense-pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dictamen-forense-${sessionIdAuditoria.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Ignorar error
    } finally {
      setDescargandoPdf(false);
    }
  };

  useEffect(() => {
    if (sessionIdAuditoria) {
      api
        .get(`/supervision/indices/${sessionIdAuditoria}`)
        .then((res) => setIndices(res.data))
        .catch(() => setIndices(null));
    }
  }, [sessionIdAuditoria]);

  const sesionActual = sesiones.find((s) => s.id === sessionIdAuditoria);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-400" />
            <span>Consola de Supervisión en Tiempo Real</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mosaico semáforo SST (CU21) y Motor de Correlación de reglas sobre ventanas deslizantes de 60s (CU20)
          </p>
        </div>

        <button
          onClick={generarSesionDemo}
          disabled={generandoDemo}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:border-emerald-400 transition-all flex items-center gap-1.5 shadow-sm"
          title="Genera una sesión de prueba con eventos de postura, mirada y atajos para probar el motor"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${generandoDemo ? 'animate-spin' : ''}`} />
          <span>{generandoDemo ? 'Generando...' : 'Generar Sesión Demo con Eventos (CU20)'}</span>
        </button>
      </div>

      {/* Mosaico de puestos en vivo (CU21) */}
      <ConsolaMosaicoSemaforo
        onSeleccionarSesion={(sid) => setSessionIdAuditoria(sid)}
        sesionSeleccionadaId={sessionIdAuditoria}
      />

      {/* Panel de correlación multidimensional (CU20) y auditoría (CU22) */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Motor de Correlación Multidimensional (CU20)</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Cruza postura RULA, vector de mirada y eventos en ventanas deslizantes para calificar severidad forense
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Selector de Sesiones */}
            <select
              value={sessionIdAuditoria}
              onChange={(e) => setSessionIdAuditoria(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 min-w-[240px]"
            >
              <option value="">Seleccione una sesión...</option>
              {sesiones.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.usuario ? `${s.usuario.nombre} (${s.tipo})` : `Sesión ${s.id.slice(0, 8)}`} — {new Date(s.inicio).toLocaleTimeString()}
                </option>
              ))}
            </select>

            <button
              onClick={() => cargarSesiones()}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Refrescar lista de sesiones"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => ejecutarCorrelacion()}
              disabled={correlacionando || !sessionIdAuditoria.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40"
            >
              <PlayCircle className={`w-3.5 h-3.5 ${correlacionando ? 'animate-spin' : ''}`} />
              <span>{correlacionando ? 'Evaluando Reglas...' : 'Ejecutar Correlación (CU20)'}</span>
            </button>
          </div>
        </div>

        {/* Mensaje de éxito de la correlación */}
        {mensajeExito && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Metadatos de la sesión activa */}
        {sesionActual && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono">
            <span className="flex items-center gap-1.5 text-slate-200">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              {sesionActual.usuario ? `${sesionActual.usuario.nombre} ${sesionActual.usuario.apellido}` : 'Usuario Demo'}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Layers className="w-3 h-3 text-sky-400" />
              Tipo: {sesionActual.tipo}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" />
              {new Date(sesionActual.inicio).toLocaleString()}
            </span>
            <span className="ml-auto text-emerald-400 font-semibold">
              ID: {sesionActual.id.slice(0, 12)}...
            </span>
          </div>
        )}

        {/* Índices Sintéticos (CU23) */}
        {indices && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Índice de Integridad</span>
                <span className="font-mono font-bold text-white text-base">{indices.indiceIntegridad} / 100</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Bienestar Ergonómico</span>
                <span className="font-mono font-bold text-white text-base">{indices.indiceBienestar} / 100</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <span className="font-mono font-bold text-sm text-amber-400">{indices.totalIncidentes}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Clasificación SST</span>
                <span className="font-mono text-emerald-400 text-xs font-semibold">{indices.estadoSST}</span>
              </div>
            </div>
          </div>
        )}

        {/* Barra de Acciones de Reportes (CU24 y CU25) */}
        {sessionIdAuditoria.trim() && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs">
              <span className="font-semibold text-slate-300 block">Reportes y Certificación de Sesión</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Exportación oficial en Excel corporativo (CU24) y Dictamen Forense PDF con sello SHA-256 (CU25)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={descargarExcel}
                disabled={descargandoExcel}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                title="Descargar matriz ergonómica y métricas RULA en Excel"
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 ${descargandoExcel ? 'animate-spin' : ''}`} />
                <span>{descargandoExcel ? 'Exportando...' : 'Reporte Ergonómico (.xlsx)'}</span>
              </button>

              <button
                onClick={descargarPdf}
                disabled={descargandoPdf}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                title="Descargar dictamen forense con sello criptográfico de integridad SHA-256"
              >
                <FileText className={`w-3.5 h-3.5 ${descargandoPdf ? 'animate-spin' : ''}`} />
                <span>{descargandoPdf ? 'Generando PDF...' : 'Dictamen Forense SHA-256 (.pdf)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Línea de tiempo de incidentes correlacionados con explicabilidad (CU20 y CU22) */}
        {sessionIdAuditoria.trim() && (
          <div className="pt-2">
            <LineaTiempoIncidentes sessionId={sessionIdAuditoria.trim()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaConsolaSupervision;
