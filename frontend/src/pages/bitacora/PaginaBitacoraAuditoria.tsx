import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Hash,
  Lock,
  Search,
  Filter,
  FileCode,
  Eye,
} from 'lucide-react';
import { api } from '../../api/client';
import { ModalDetalleBitacora } from './ModalDetalleBitacora';
import { TarjetasResumenBitacora } from './TarjetasResumenBitacora';

export interface RegistroBitacora {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  categoria: string;
  hash: string;
  prevHash: string;
  timestamp: string;
  ipAddress?: string;
  details?: any;
  usuario?: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
}

export const PaginaBitacoraAuditoria: React.FC = () => {
  const [registros, setRegistros] = useState<RegistroBitacora[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [resultadoIntegridad, setResultadoIntegridad] = useState<{
    valida: boolean;
    totalRegistros: number;
    tiempoVerificacionMs?: number;
    ultimoHash?: string;
  } | null>(null);

  // Filtros
  const [categoria, setCategoria] = useState<string>('TODAS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [limite, setLimite] = useState<number>(50);

  // Modal de detalle
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroBitacora | null>(null);

  const cargarBitacora = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (categoria !== 'TODAS') params.append('categoria', categoria);
      if (busqueda.trim()) params.append('busqueda', busqueda.trim());
      params.append('limit', String(limite));

      const res = await api.get(`/supervision/bitacora?${params.toString()}`);
      if (res.data && Array.isArray(res.data.registros)) {
        setRegistros(res.data.registros);
        setTotalRegistros(res.data.total);
      } else if (Array.isArray(res.data)) {
        setRegistros(res.data);
        setTotalRegistros(res.data.length);
      }
    } catch {
      setRegistros([]);
      setTotalRegistros(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarBitacora();
  }, [categoria, limite]);

  const manejarBusquedaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cargarBitacora();
  };

  const verificarCadena = async () => {
    setVerificando(true);
    try {
      const res = await api.get('/supervision/bitacora/verificar');
      setResultadoIntegridad(res.data);
    } catch {
      setResultadoIntegridad({ valida: false, totalRegistros: 0 });
    } finally {
      setVerificando(false);
    }
  };

  const exportarCsv = async () => {
    try {
      const params = categoria !== 'TODAS' ? `?categoria=${categoria}` : '';
      const res = await api.get(`/supervision/bitacora/exportar${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bitacora-inmutable-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Ignorar error
    }
  };

  const exportarJson = async () => {
    try {
      const params = categoria !== 'TODAS' ? `?categoria=${categoria}` : '';
      const res = await api.get(`/supervision/bitacora/exportar-json${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bitacora-inmutable-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Ignorar error
    }
  };

  const obtenerEstiloCategoria = (cat: string) => {
    switch (cat) {
      case 'EVENTOS_TECNICOS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ACCESOS_DATOS':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CAMBIOS_POLITICAS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SEGURIDAD':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'AUDITORIA':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SUPERVISION':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'ERGONOMIA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'LEGAL_COMPLIANCE':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>Bitácora Inmutable de Auditoría (WORM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro encadenado con SHA-256 (CU26): consulta, exportación CSV/JSON y verificación matemática no-repudio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={verificarCadena}
            disabled={verificando}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{verificando ? 'Auditando Cadena...' : 'Verificar Integridad SHA-256'}</span>
          </button>

          <button
            onClick={exportarCsv}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Descargar en formato CSV para Excel"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportarJson}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Descargar en formato JSON con metadatos criptográficos"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={cargarBitacora}
            disabled={cargando}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Recargar registros"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tarjetas Resumen */}
      <TarjetasResumenBitacora
        totalRegistros={totalRegistros}
        cadenaValida={resultadoIntegridad ? resultadoIntegridad.valida : null}
        ultimoHash={registros[0]?.hash || resultadoIntegridad?.ultimoHash}
        tiempoVerificacionMs={resultadoIntegridad?.tiempoVerificacionMs}
      />

      {/* Alerta de Verificación Criptográfica */}
      {resultadoIntegridad && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition-all ${
            resultadoIntegridad.valida
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-2xs'
              : 'bg-rose-50 border-rose-200 text-rose-900 shadow-2xs'
          }`}
        >
          {resultadoIntegridad.valida ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <div>
            <p className="font-bold text-sm">
              {resultadoIntegridad.valida
                ? 'Cadena Criptográfica Íntegra y Certificada'
                : 'Alerta de Seguridad: Ruptura de Integridad en Bitácora'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {resultadoIntegridad.valida
                ? `Se verificaron matemáticamente ${resultadoIntegridad.totalRegistros} bloques encadenados sin discrepancias de hash.`
                : 'Se detectó que uno o más registros fueron modificados fuera del sistema o la secuencia prevHash no coincide.'}
            </p>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={manejarBusquedaSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por acción, usuario, entidad o hash..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              <option value="TODAS">Todas las categorías</option>
              <option value="EVENTOS_TECNICOS">Eventos Técnicos (RF50)</option>
              <option value="ACCESOS_DATOS">Accesos a Datos (RF50)</option>
              <option value="CAMBIOS_POLITICAS">Cambios de Políticas (RF50)</option>
              <option value="SEGURIDAD">Seguridad</option>
              <option value="AUDITORIA">Auditoría</option>
              <option value="SUPERVISION">Supervisión</option>
              <option value="ERGONOMIA">Ergonomía</option>
              <option value="LEGAL_COMPLIANCE">Legal & Compliance</option>
            </select>
          </div>

          <select
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
          >
            <option value={25}>Mostrar 25</option>
            <option value={50}>Mostrar 50</option>
            <option value={100}>Mostrar 100</option>
            <option value={200}>Mostrar 200</option>
          </select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-mono font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Acción</th>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4">Entidad</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Hash SHA-256</th>
                <th className="py-3.5 px-4 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {cargando ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    Cargando registros inmutables...
                  </td>
                </tr>
              ) : registros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No se encontraron registros en la bitácora con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                registros.map((reg) => (
                  <tr
                    key={reg.id}
                    onClick={() => setRegistroSeleccionado(reg)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-xs whitespace-nowrap font-medium">
                      {new Date(reg.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {reg.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {reg.usuario ? (
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {reg.usuario.nombre} {reg.usuario.apellido}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{reg.usuario.correo}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono font-medium">SISTEMA</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 font-medium">
                      {reg.entity}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${obtenerEstiloCategoria(reg.categoria)}`}>
                        {reg.categoria}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] truncate max-w-[160px]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-[11px] text-emerald-800 font-medium" title={reg.hash}>
                        <Hash className="w-3 h-3 shrink-0 text-emerald-600" />
                        {reg.hash ? `${reg.hash.slice(0, 14)}...` : '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegistroSeleccionado(reg);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
                        title="Ver detalles completos del bloque"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      <ModalDetalleBitacora
        registro={registroSeleccionado}
        onClose={() => setRegistroSeleccionado(null)}
      />
    </div>
  );
};

export default PaginaBitacoraAuditoria;
