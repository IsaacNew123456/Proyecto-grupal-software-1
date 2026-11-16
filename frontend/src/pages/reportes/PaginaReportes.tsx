import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Search,
  RefreshCw,
  User,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
} from 'lucide-react';
import { api } from '../../api/client';

interface SesionReporte {
  id: string;
  tipo: string;
  estado: string;
  inicio: string;
  fin?: string;
  scoreIntegridad?: number;
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

export const PaginaReportes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sesiones, setSesiones] = useState<SesionReporte[]>([]);
  const [sessionIdSeleccionada, setSessionIdSeleccionada] = useState<string>(
    searchParams.get('sessionId') || '',
  );
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarSesiones = async () => {
    setCargando(true);
    try {
      const res = await api.get('/supervision/sesiones');
      setSesiones(res.data || []);
      if (!sessionIdSeleccionada && res.data && res.data.length > 0) {
        setSessionIdSeleccionada(res.data[0].id);
      }
    } catch {
      setSesiones([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSesiones();
  }, []);

  useEffect(() => {
    const urlSid = searchParams.get('sessionId');
    if (urlSid) {
      setSessionIdSeleccionada(urlSid);
    }
  }, [searchParams]);

  const descargarExcel = async (targetId?: string) => {
    const sid = targetId || sessionIdSeleccionada.trim();
    if (!sid) return;
    setDescargandoExcel(true);
    setMensajeExito(null);
    try {
      const res = await api.get(`/supervision/reportes/${sid}/ergonomico-excel`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-ergonomico-${sid.slice(0, 8)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMensajeExito('Reporte ergonómico generado y descargado exitosamente en Excel (.xlsx)');
    } catch {
      // Manejar error silencioso
    } finally {
      setDescargandoExcel(false);
    }
  };

  const descargarPdf = async (targetId?: string) => {
    const sid = targetId || sessionIdSeleccionada.trim();
    if (!sid) return;
    setDescargandoPdf(true);
    setMensajeExito(null);
    try {
      const res = await api.get(`/supervision/reportes/${sid}/forense-pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dictamen-forense-${sid.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMensajeExito('Dictamen forense pericial generado y descargado con sello SHA-256 (.pdf)');
    } catch {
      // Manejar error silencioso
    } finally {
      setDescargandoPdf(false);
    }
  };

  const sesionesFiltradas = sesiones.filter((s) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    const nombre = `${s.usuario?.nombre || ''} ${s.usuario?.apellido || ''}`.toLowerCase();
    const correo = (s.usuario?.correo || '').toLowerCase();
    const id = s.id.toLowerCase();
    const tipo = s.tipo.toLowerCase();
    return nombre.includes(q) || correo.includes(q) || id.includes(q) || tipo.includes(q);
  });

  const sesionActual = sesiones.find((s) => s.id === sessionIdSeleccionada);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Centro de Reportes y Dictámenes Certificados</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exportación oficial de auditorías biomecánicas corporativas en Excel y expedientes forenses con sello criptográfico SHA-256
          </p>
        </div>

        <button
          onClick={() => navigate('/consola-supervision')}
          className="px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>Ir a Consola en Tiempo Real</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* Mensaje de Éxito */}
      {mensajeExito && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{mensajeExito}</span>
        </div>
      )}

      {/* Tarjetas Principales de Descarga Oficial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tarjeta Reporte Ergonómico Excel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                Formato Corporativo • Multi-pestaña
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reporte Ergonómico Corporativo (.xlsx)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Matriz analítica para Comités de SST y Medicina Laboral. Incluye carátula ejecutiva, resumen estadístico de postura, bitácora detallada de ángulos articulares y desglose de alertas RULA.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Sesión seleccionada:</span>
                <span className="font-semibold text-slate-800">{sessionIdSeleccionada ? sessionIdSeleccionada.slice(0, 12) + '...' : 'Ninguna'}</span>
              </div>
              {sesionActual && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Evaluado:</span>
                  <span className="text-slate-800">{sesionActual.usuario ? `${sesionActual.usuario.nombre} ${sesionActual.usuario.apellido}` : 'Usuario Demo'}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => descargarExcel()}
            disabled={descargandoExcel || !sessionIdSeleccionada.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{descargandoExcel ? 'Generando Excel multi-pestaña...' : 'Descargar Reporte Ergonómico Excel'}</span>
          </button>
        </div>

        {/* Tarjeta Dictamen Forense PDF */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-semibold">
                Dictamen Pericial • Sello SHA-256
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dictamen Forense con Sello Criptográfico (.pdf)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Expediente individual pericial con dictamen legal. Contiene índice sintético de integridad, cronología de incidentes correlacionados, trazabilidad de atajos de teclado y sello de integridad SHA-256.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Score de Integridad:</span>
                <span className="font-bold text-emerald-700">
                  {sesionActual?.scoreIntegridad !== undefined ? `${sesionActual.scoreIntegridad} / 100` : 'Auditado'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Garantía Legal:</span>
                <span className="text-slate-800">No-repudio & Cadena WORM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => descargarPdf()}
            disabled={descargandoPdf || !sessionIdSeleccionada.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{descargandoPdf ? 'Generando Dictamen Certificado...' : 'Descargar Dictamen Forense PDF'}</span>
          </button>
        </div>
      </div>

      {/* Directorio de Sesiones Disponibles para Exportación */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs space-y-3 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Directorio de Sesiones para Exportación</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Haga clic en cualquier sesión para seleccionarla y descargar sus reportes asociados
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por usuario o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              onClick={cargarSesiones}
              disabled={cargando}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Refrescar lista"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabla de Sesiones */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-mono font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Sesión / Evaluado</th>
                <th className="py-3 px-3.5">Tipo</th>
                <th className="py-3 px-3.5">Fecha y Hora</th>
                <th className="py-3 px-3.5">Estado</th>
                <th className="py-3 px-3.5">Integridad</th>
                <th className="py-3 px-3.5 text-right">Descargas Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sesionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron sesiones registradas para exportar.
                  </td>
                </tr>
              ) : (
                sesionesFiltradas.map((s) => {
                  const esSeleccionada = sessionIdSeleccionada === s.id;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSessionIdSeleccionada(s.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        esSeleccionada ? 'bg-emerald-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${esSeleccionada ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {s.usuario ? `${s.usuario.nombre} ${s.usuario.apellido}` : 'Evaluado Demo'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {s.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                          {s.tipo}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">
                        {new Date(s.inicio).toLocaleString()}
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                            s.estado === 'COMPLETADA'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {s.estado}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 font-mono text-[11px]">
                        <span className="text-emerald-700 font-bold">
                          {s.scoreIntegridad !== undefined ? `${s.scoreIntegridad} pts` : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => descargarExcel(s.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Descargar Excel (.xlsx)"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => descargarPdf(s.id)}
                            className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                            title="Descargar Dictamen Forense PDF (.pdf)"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PaginaReportes;
