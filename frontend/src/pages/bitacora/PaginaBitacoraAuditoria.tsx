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
      // Si el backend devuelve objeto paginado { total, registros }
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
      // Manejar error silencioso
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
      // Manejar error silencioso
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Bitácora Inmutable de Auditoría (WORM)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro encadenado con SHA-256 (CU26): consulta, exportación CSV/JSON y verificación matemática no-repudio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={verificarCadena}
            disabled={verificando}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{verificando ? 'Auditando Cadena...' : 'Verificar Integridad SHA-256'}</span>
          </button>

          <button
            onClick={exportarCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="Descargar en formato CSV para Excel"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportarJson}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="Descargar en formato JSON con metadatos criptográficos"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={cargarBitacora}
            disabled={cargando}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
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
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          {resultadoIntegridad.valida ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <div>
            <p className="font-bold text-sm">
              {resultadoIntegridad.valida
                ? 'Cadena Criptográfica Íntegra y Certificada'
                : 'Alerta de Seguridad: Ruptura de Integridad en Bitácora'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {resultadoIntegridad.valida
                ? `Se verificaron matemáticamente ${resultadoIntegridad.totalRegistros} bloques encadenados sin discrepancias de hash.`
                : 'Se detectó que uno o más registros fueron modificados fuera del sistema o la secuencia prevHash no coincide.'}
            </p>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={manejarBusquedaSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por acción, usuario, entidad o hash..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="TODAS">Todas las categorías</option>
              <option value="SEGURIDAD">Seguridad</option>
              <option value="AUDITORIA">Auditoría</option>
              <option value="AUTENTICACION">Autenticación</option>
              <option value="SISTEMA">Sistema</option>
              <option value="CONSENTIMIENTO">Consentimiento</option>
            </select>
          </div>

          <select
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value={25}>Mostrar 25</option>
            <option value={50}>Mostrar 50</option>
            <option value={100}>Mostrar 100</option>
            <option value={200}>Mostrar 200</option>
          </select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Acción</th>
                <th className="py-3 px-4">Operador</th>
                <th className="py-3 px-4">Entidad</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Hash SHA-256</th>
                <th className="py-3 px-4 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cargando ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
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
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(reg.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {reg.action}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {reg.usuario ? (
                        <div>
                          <p className="font-medium text-white">{reg.usuario.nombre} {reg.usuario.apellido}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{reg.usuario.correo}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono">SISTEMA</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {reg.entity}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                        {reg.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-400/90 truncate max-w-[150px]">
                      <span className="flex items-center gap-1" title={reg.hash}>
                        <Hash className="w-3 h-3 shrink-0 text-emerald-400" />
                        {reg.hash ? `${reg.hash.slice(0, 14)}...` : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegistroSeleccionado(reg);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
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
