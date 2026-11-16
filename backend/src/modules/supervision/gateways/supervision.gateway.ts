import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export type EstadoSemaforo = 'VERDE' | 'AMARILLO' | 'NARANJA' | 'ROJO' | 'GRIS';

export interface PuestoMonitoreo {
  sessionId: string;
  usuarioNombre: string;
  rol: string;
  tipo: string;
  estado: EstadoSemaforo;
  rulaScore?: number;
  pitchEfectivo?: number;
  ultimoHeartbeat: number;
  motivoAlerta?: string;
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/supervision' })
export class SupervisionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private puestos: Map<string, PuestoMonitoreo> = new Map();
  private watchdogInterval: NodeJS.Timeout | null = null;

  afterInit() {
    // Watchdog timer a 15 segundos: si no recibe heartbeat, conmuta a GRIS
    this.watchdogInterval = setInterval(() => {
      const ahora = Date.now();
      let cambio = false;

      this.puestos.forEach((puesto) => {
        if (puesto.estado !== 'GRIS' && ahora - puesto.ultimoHeartbeat > 15000) {
          puesto.estado = 'GRIS';
          puesto.motivoAlerta = 'Conexión perdida (watchdog > 15s)';
          cambio = true;
        }
      });

      if (cambio) {
        this.emitirActualizacionPuestos();
      }
    }, 5000);
  }

  handleConnection(client: Socket) {
    client.emit('puestos_actualizados', Array.from(this.puestos.values()));
  }

  handleDisconnect(client: Socket) {
    // Marcar como gris el puesto asociado al socket
    const sessionId = client.data.sessionId;
    if (sessionId && this.puestos.has(sessionId)) {
      const puesto = this.puestos.get(sessionId)!;
      puesto.estado = 'GRIS';
      puesto.motivoAlerta = 'Socket desconectado';
      this.emitirActualizacionPuestos();
    }
  }

  @SubscribeMessage('registrar_puesto')
  handleRegistrarPuesto(client: Socket, payload: { sessionId: string; usuarioNombre: string; tipo: string }) {
    client.data.sessionId = payload.sessionId;
    const nuevoPuesto: PuestoMonitoreo = {
      sessionId: payload.sessionId,
      usuarioNombre: payload.usuarioNombre || 'Puesto Activo',
      rol: 'EVALUADO',
      tipo: payload.tipo || 'EXAMEN',
      estado: 'VERDE',
      ultimoHeartbeat: Date.now(),
    };
    this.puestos.set(payload.sessionId, nuevoPuesto);
    this.emitirActualizacionPuestos();
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(client: Socket, payload?: { sessionId?: string }) {
    const sessionId = payload?.sessionId || client.data?.sessionId;
    if (sessionId && this.puestos.has(sessionId)) {
      const puesto = this.puestos.get(sessionId)!;
      puesto.ultimoHeartbeat = Date.now();
      if (puesto.estado === 'GRIS') {
        puesto.estado = 'VERDE';
        puesto.motivoAlerta = undefined;
        this.emitirActualizacionPuestos();
      }
    }
  }

  @SubscribeMessage('actualizar_estado')
  handleActualizarEstado(
    client: Socket,
    payload: {
      sessionId?: string;
      estado: EstadoSemaforo;
      rulaScore?: number;
      pitchEfectivo?: number;
      motivo?: string;
    },
  ) {
    const sessionId = payload.sessionId || client.data?.sessionId;
    if (sessionId && this.puestos.has(sessionId)) {
      const puesto = this.puestos.get(sessionId)!;
      puesto.estado = payload.estado;
      if (payload.rulaScore !== undefined) puesto.rulaScore = payload.rulaScore;
      if (payload.pitchEfectivo !== undefined) puesto.pitchEfectivo = payload.pitchEfectivo;
      puesto.motivoAlerta = payload.motivo;
      puesto.ultimoHeartbeat = Date.now();
      this.emitirActualizacionPuestos();
    }
  }

  public actualizarEstadoDesdeServicio(sessionId: string, estado: EstadoSemaforo, motivo?: string) {
    if (this.puestos.has(sessionId)) {
      const p = this.puestos.get(sessionId)!;
      p.estado = estado;
      p.motivoAlerta = motivo;
      this.emitirActualizacionPuestos();
    }
  }

  public obtenerPuestos(): PuestoMonitoreo[] {
    return Array.from(this.puestos.values());
  }

  public limpiarPuestos() {
    this.puestos.clear();
    this.emitirActualizacionPuestos();
  }

  public simularPuestosDemo(): PuestoMonitoreo[] {
    this.puestos.clear();
    const ahora = Date.now();
    this.puestos.set('demo-puesto-1', {
      sessionId: 'demo-puesto-1',
      usuarioNombre: 'Carlos Mendoza (ErgoCheck)',
      rol: 'EVALUADO',
      tipo: 'TELETRABAJO',
      estado: 'VERDE',
      rulaScore: 2,
      pitchEfectivo: -6.5,
      ultimoHeartbeat: ahora,
      motivoAlerta: 'Postura y ergonomía óptima',
    });
    this.puestos.set('demo-puesto-2', {
      sessionId: 'demo-puesto-2',
      usuarioNombre: 'Sofía Valenzuela',
      rol: 'EVALUADO',
      tipo: 'EXAMEN',
      estado: 'AMARILLO',
      rulaScore: 4,
      pitchEfectivo: -26.0,
      ultimoHeartbeat: ahora,
      motivoAlerta: 'Desvío de mirada sostenido hacia fuera de pantalla',
    });
    this.puestos.set('demo-puesto-3', {
      sessionId: 'demo-puesto-3',
      usuarioNombre: 'Rodrigo Morales',
      rol: 'EVALUADO',
      tipo: 'TELETRABAJO',
      estado: 'NARANJA',
      rulaScore: 6,
      pitchEfectivo: -38.2,
      ultimoHeartbeat: ahora,
      motivoAlerta: 'Riesgo ergonómico severo (RULA 6, flexión cervical > 35°)',
    });
    this.puestos.set('demo-puesto-4', {
      sessionId: 'demo-puesto-4',
      usuarioNombre: 'Martín Paredes',
      rol: 'EVALUADO',
      tipo: 'EXAMEN',
      estado: 'ROJO',
      rulaScore: 5,
      pitchEfectivo: -12.0,
      ultimoHeartbeat: ahora,
      motivoAlerta: 'Anomalía crítica: Múltiples rostros detectados en cámara',
    });
    this.puestos.set('demo-puesto-5', {
      sessionId: 'demo-puesto-5',
      usuarioNombre: 'Lucía Fernández (Inactiva)',
      rol: 'EVALUADO',
      tipo: 'EXAMEN',
      estado: 'GRIS',
      rulaScore: 0,
      pitchEfectivo: 0,
      ultimoHeartbeat: ahora - 20000,
      motivoAlerta: 'Conexión perdida (watchdog > 15s sin telemetría)',
    });

    this.emitirActualizacionPuestos();
    return Array.from(this.puestos.values());
  }

  private emitirActualizacionPuestos() {
    if (this.server) {
      this.server.emit('puestos_actualizados', Array.from(this.puestos.values()));
    }
  }
}
