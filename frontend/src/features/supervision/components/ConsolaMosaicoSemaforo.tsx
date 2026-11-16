import React, { useState } from 'react';
import { Monitor, Wifi, WifiOff, Sparkles, Search, Filter } from 'lucide-react';
import { useWebSocketSupervisor, EstadoSemaforo } from '../hooks/useWebSocketSupervisor';
import { TarjetaSemaforo } from './TarjetaSemaforo';
import { api } from '../../../api/client';

export const ConsolaMosaicoSemaforo: React.FC = () => {
  const { puestos, conectado } = useWebSocketSupervisor();
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [simulando, setSimulando] = useState<boolean>(false);

  const simularPuestos = async () => {
    setSimulando(true);
    try {
      await api.post('/supervision/puestos-en-vivo/simular');
    } catch {
      // Ignorar error si el canal WS ya emite
    } finally {
      setSimulando(false);
    }
  };

  const conteos: Record<EstadoSemaforo, number> = {
    VERDE: puestos.filter((p) => p.estado === 'VERDE').length,
    AMARILLO: puestos.filter((p) => p.estado === 'AMARILLO').length,
    NARANJA: puestos.filter((p) => p.estado === 'NARANJA').length,
    ROJO: puestos.filter((p) => p.estado === 'ROJO').length,
    GRIS: puestos.filter((p) => p.estado === 'GRIS').length,
  };

  const puestosFiltrados = puestos.filter((p) => {
    const coincideEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    const coincideTexto =
      !busqueda.trim() ||
      p.usuarioNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sessionId.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.motivoAlerta && p.motivoAlerta.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideEstado && coincideTexto;
  });

  return (
    <div className="space-y-4">
      {/* Barra de estado y contadores de semáforo */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">Consola Mosaico Semáforo en Tiempo Real (CU21)</h3>
            <p className="text-[10px] text-slate-500 font-mono">Watchdog automático a 15 segundos • 5 estados SST</p>
          </div>
        </div>

        {/* Acciones y Estado de Conexión */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={simularPuestos}
            disabled={simulando}
            className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all flex items-center gap-1.5"
            title="Inyecta 5 puestos con telemetría en vivo simulando los 5 estados del semáforo"
          >
            <Sparkles className={`w-3 h-3 text-emerald-400 ${simulando ? 'animate-spin' : ''}`} />
            <span>{simulando ? 'Simulando...' : '⚡ Simular Mosaico en Vivo'}</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono ${
              conectado
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {conectado ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
            <span>{conectado ? 'Canal WSS Activo' : 'Desconectado'}</span>
          </div>
        </div>
      </div>

      {/* Filtros por Estado y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFiltroEstado('TODOS')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${
              filtroEstado === 'TODOS'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({puestos.length})
          </button>
          <button
            onClick={() => setFiltroEstado('VERDE')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              filtroEstado === 'VERDE'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold'
                : 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20 hover:text-emerald-300'
            }`}
          >
            🟢 Óptimos ({conteos.VERDE})
          </button>
          <button
            onClick={() => setFiltroEstado('AMARILLO')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              filtroEstado === 'AMARILLO'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold'
                : 'bg-amber-500/10 text-amber-400/80 border border-amber-500/20 hover:text-amber-300'
            }`}
          >
            🟡 Distraídos ({conteos.AMARILLO})
          </button>
          <button
            onClick={() => setFiltroEstado('NARANJA')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              filtroEstado === 'NARANJA'
                ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50 font-bold'
                : 'bg-orange-500/10 text-orange-400/80 border border-orange-500/20 hover:text-orange-300'
            }`}
          >
            🟠 Riesgo Ergo ({conteos.NARANJA})
          </button>
          <button
            onClick={() => setFiltroEstado('ROJO')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              filtroEstado === 'ROJO'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 font-bold'
                : 'bg-rose-500/10 text-rose-400/80 border border-rose-500/20 hover:text-rose-300'
            }`}
          >
            🔴 Críticos ({conteos.ROJO})
          </button>
          <button
            onClick={() => setFiltroEstado('GRIS')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              filtroEstado === 'GRIS'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:text-white'
            }`}
          >
            ⚪ Inactivos ({conteos.GRIS})
          </button>
        </div>

        {/* Buscador */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario o puesto..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Mosaico de puestos */}
      {puestosFiltrados.length === 0 ? (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-8 text-center space-y-3">
          <Monitor className="w-8 h-8 text-slate-600 mx-auto" />
          <div>
            <p className="text-xs text-slate-300 font-medium">
              {puestos.length === 0
                ? 'No hay puestos transmitiendo telemetría en tiempo real'
                : 'No se encontraron puestos con el filtro aplicado'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              {puestos.length === 0
                ? 'Haga clic en "⚡ Simular Mosaico en Vivo" para inyectar 5 puestos y observar la conmutación del semáforo.'
                : 'Pruebe seleccionando "Todos" o limpiando el texto de búsqueda.'}
            </p>
          </div>
          {puestos.length === 0 && (
            <button
              onClick={simularPuestos}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simular 5 Puestos Ahora</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {puestosFiltrados.map((puesto) => (
            <TarjetaSemaforo key={puesto.sessionId} puesto={puesto} />
          ))}
        </div>
      )}
    </div>
  );
};
