import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle,
  ArrowRight,
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
  const navigate = useNavigate();
  const [pestañaActiva, setPestañaActiva] = useState<'mosaico' | 'forense'>('mosaico');
  const [sesiones, setSesiones] = useState<SesionResumen[]>([]);
  const [sessionIdAuditoria, setSessionIdAuditoria] = useState('');
  const [indices, setIndices] = useState<any | null>(null);
  const [correlacionando, setCorrelacionando] = useState(false);
  const [generandoDemo, setGenerandoDemo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

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
        `Motor de correlación ejecutado con éxito: ${resCorrelacion.data.total} incidentes correlacionados mediante ventanas deslizantes.`,
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
      setPestañaActiva('forense');
      await cargarSesiones();
      await ejecutarCorrelacion(nuevaId);
      setMensajeExito(
        '¡Sesión demo generada y correlacionada! Se inyectaron 10 eventos biométricos y se ejecutaron las reglas de correlación.',
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

  const cerrarSesionActual = async () => {
    if (!sessionIdAuditoria) return;
    setCerrandoSesion(true);
    setMensajeExito(null);
    try {
      const res = await api.post(`/supervision/sesiones/${sessionIdAuditoria}/cerrar`);
      setIndices(res.data.indices);
      setMensajeExito(
        `Sesión cerrada formalmente. Índice de Integridad persistido: ${res.data.indices.indiceIntegridad}/100.`,
      );
      await cargarSesiones();
    } catch {
      // Ignorar error
    } finally {
      setCerrandoSesion(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-600" />
            <span>Consola de Supervisión en Tiempo Real</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Mosaico semáforo SST y Motor de Correlación de reglas sobre ventanas deslizantes de 60s
          </p>
        </div>

        <button
          onClick={generarSesionDemo}
          disabled={generandoDemo}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          title="Genera una sesión de prueba con eventos de postura, mirada y atajos para probar el motor"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-600 ${generandoDemo ? 'animate-spin' : ''}`} />
          <span>{generandoDemo ? 'Generando...' : 'Generar Sesión Demo con Eventos'}</span>
        </button>
      </div>

      {/* Selector de Pestañas / Separación de Casos de Uso */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setPestañaActiva('mosaico')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            pestañaActiva === 'mosaico'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Mosaico Semáforo en Tiempo Real</span>
        </button>

        <button
          onClick={() => setPestañaActiva('forense')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            pestañaActiva === 'forense'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Análisis y Correlación Forense</span>
          {sessionIdAuditoria && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
              Sesión activa
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(sessionIdAuditoria ? `/reportes?sessionId=${sessionIdAuditoria}` : '/reportes')}
          className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 text-xs font-medium transition-all shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Centro de Reportes</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* PESTAÑA 1: Mosaico Semáforo en Vivo */}
      {pestañaActiva === 'mosaico' && (
        <div className="space-y-4">
          <ConsolaMosaicoSemaforo
            onSeleccionarSesion={(sid) => {
              setSessionIdAuditoria(sid);
              setPestañaActiva('forense');
            }}
            sesionSeleccionadaId={sessionIdAuditoria}
          />
        </div>
      )}

      {/* PESTAÑA 2: Panel de Correlación Forense */}
      {pestañaActiva === 'forense' && (
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Motor de Correlación Multidimensional</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Cruza postura RULA, vector de mirada y eventos en ventanas deslizantes para calificar severidad forense
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Selector de Sesiones */}
              <select
                value={sessionIdAuditoria}
                onChange={(e) => setSessionIdAuditoria(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white min-w-[240px] cursor-pointer"
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
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Refrescar lista de sesiones"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => ejecutarCorrelacion()}
                disabled={correlacionando || !sessionIdAuditoria.trim()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-40 cursor-pointer"
              >
                <PlayCircle className={`w-3.5 h-3.5 ${correlacionando ? 'animate-spin' : ''}`} />
                <span>{correlacionando ? 'Evaluando...' : 'Ejecutar Correlación'}</span>
              </button>

              <button
                onClick={() => cerrarSesionActual()}
                disabled={cerrandoSesion || !sessionIdAuditoria.trim()}
                className="px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-40 cursor-pointer"
                title="Cierra formalmente la sesión y persiste los índices sintéticos de integridad y bienestar"
              >
                <CheckCircle className={`w-3.5 h-3.5 text-emerald-600 ${cerrandoSesion ? 'animate-spin' : ''}`} />
                <span>{cerrandoSesion ? 'Cerrando...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>

          {/* Mensaje de éxito de la correlación */}
          {mensajeExito && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mensajeExito}</span>
            </div>
          )}

          {/* Metadatos de la sesión activa */}
          {sesionActual && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <span className="flex items-center gap-1.5 text-slate-900 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {sesionActual.usuario ? `${sesionActual.usuario.nombre} ${sesionActual.usuario.apellido}` : 'Usuario Demo'}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Layers className="w-3 h-3 text-sky-600" />
                Tipo: {sesionActual.tipo}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3 h-3 text-amber-600" />
                {new Date(sesionActual.inicio).toLocaleString()}
              </span>
              <span className="ml-auto text-emerald-700 font-semibold">
                ID: {sesionActual.id.slice(0, 12)}...
              </span>
            </div>
          )}

          {/* Índices Sintéticos */}
          {indices && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Índice de Integridad</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{indices.indiceIntegridad} / 100</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100/70 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Bienestar Ergonómico</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{indices.indiceBienestar} / 100</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700">
                  <span className="font-mono font-bold text-sm text-amber-800">{indices.totalIncidentes}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Clasificación SST</span>
                  <span className="font-mono text-emerald-700 text-xs font-semibold">{indices.estadoSST}</span>
                </div>
              </div>
            </div>
          )}

          {/* Enlace y Acciones hacia Centro de Reportes */}
          {sessionIdAuditoria.trim() && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Reportes y Certificación de Sesión</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Exportación oficial en Excel corporativo y Dictamen Forense PDF con sello SHA-256
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={descargarExcel}
                  disabled={descargandoExcel}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="Descargar matriz ergonómica y métricas RULA en Excel"
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 ${descargandoExcel ? 'animate-spin' : ''}`} />
                  <span>{descargandoExcel ? 'Exportando...' : 'Reporte (.xlsx)'}</span>
                </button>

                <button
                  onClick={descargarPdf}
                  disabled={descargandoPdf}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="Descargar dictamen forense con sello criptográfico de integridad SHA-256"
                >
                  <FileText className={`w-3.5 h-3.5 ${descargandoPdf ? 'animate-spin' : ''}`} />
                  <span>{descargandoPdf ? 'Generando PDF...' : 'Dictamen (.pdf)'}</span>
                </button>

                <button
                  onClick={() => navigate(`/reportes?sessionId=${sessionIdAuditoria.trim()}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Ir al Centro de Reportes completo"
                >
                  <span>Centro de Reportes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Línea de tiempo de incidentes correlacionados con explicabilidad */}
          {sessionIdAuditoria.trim() && (
            <div className="pt-2">
              <LineaTiempoIncidentes
                sessionId={sessionIdAuditoria.trim()}
                onIncidenteAuditado={() => {
                  api
                    .get(`/supervision/indices/${sessionIdAuditoria.trim()}`)
                    .then((res) => setIndices(res.data))
                    .catch(() => {});
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginaConsolaSupervision;
