export type TipoAlerta =
  | 'POSTURA_CUELLO'
  | 'POSTURA_HOMBRO'
  | 'FATIGA_RULA'
  | 'AUSENCIA_PUESTO'
  | 'PAUSA_ACTIVA_REQUERIDA'
  | 'INCIDENTE_EQUIPO';

export type SeveridadAlerta = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface AlertaNotificacion {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descripcion: string;
  severidad: SeveridadAlerta;
  timestamp: string;
  leida: boolean;
  empleadoNombre?: string;
  datosExtra?: Record<string, any>;
}

export type EstadoSemaforo = 'VERDE' | 'AMARILLO' | 'ROJO' | 'GRIS';
