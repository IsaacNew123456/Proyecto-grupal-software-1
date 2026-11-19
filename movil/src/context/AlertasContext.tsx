import React, { createContext, useContext, useState } from 'react';
import { AlertaNotificacion, EstadoSemaforo } from '../types/alerta';
import { HapticsService } from '../services/haptics';

export interface PushRegistro {
  empleado: string;
  mensaje: string;
  timestamp: string;
}

interface AlertasContextType {
  alertas: AlertaNotificacion[];
  alertaActiva: AlertaNotificacion | null;
  estadoSemaforo: EstadoSemaforo;
  minutosAusente: number;
  rulaActual: number;
  ultimoPushEnviado: PushRegistro | null;
  descartarAlertaActiva: () => void;
  marcarLeida: (id: string) => void;
  dispararAlertaPostura: () => void;
  dispararAlertaAusencia: () => void;
  dispararAlertaSupervisor: () => void;
  dispararAlertaSobrecargaEstatica45Min: (empleadoNombre?: string) => void;
  enviarNotificacionPushSupervisor: (empleadoNombre: string, mensaje?: string) => void;
  justificarPausaTeletrabajo: (motivo: string, duracionMin: number) => void;
}

const AlertasContext = createContext<AlertasContextType>({} as AlertasContextType);

const ALERTAS_INICIALES: AlertaNotificacion[] = [
  {
    id: 'alt-1',
    tipo: 'POSTURA_CUELLO',
    titulo: 'Inclinación de Cuello Excesiva',
    descripcion: 'Ángulo cervical mayor a 35° por más de 180 segundos continuos.',
    severidad: 'ALTA',
    timestamp: 'Hace 5 min',
    leida: false,
  },
  {
    id: 'alt-2',
    tipo: 'PAUSA_ACTIVA_REQUERIDA',
    titulo: 'Recordatorio de Pausa Activa',
    descripcion: 'Llevas 50 minutos de trabajo continuo frente a pantalla.',
    severidad: 'BAJA',
    timestamp: 'Hace 25 min',
    leida: true,
  },
];

export const AlertasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertas, setAlertas] = useState<AlertaNotificacion[]>(ALERTAS_INICIALES);
  const [alertaActiva, setAlertaActiva] = useState<AlertaNotificacion | null>(ALERTAS_INICIALES[0]);
  const [estadoSemaforo, setEstadoSemaforo] = useState<EstadoSemaforo>('AMARILLO');
  const [minutosAusente, setMinutosAusente] = useState<number>(0);
  const [rulaActual, setRulaActual] = useState<number>(3.5);
  const [ultimoPushEnviado, setUltimoPushEnviado] = useState<PushRegistro | null>(null);

  const agregarAlerta = (nueva: AlertaNotificacion) => {
    setAlertas((prev) => [nueva, ...prev]);
    setAlertaActiva(nueva);
  };

  const dispararAlertaPostura = () => {
    const nueva: AlertaNotificacion = {
      id: `alt-${Date.now()}`,
      tipo: 'POSTURA_CUELLO',
      titulo: 'Flexión Cervical Prolongada (RULA 5)',
      descripcion: 'Cabeza adelantada detectada. Por favor alinea tu cuello con la pantalla.',
      severidad: 'ALTA',
      timestamp: 'Ahora mismo',
      leida: false,
    };
    setEstadoSemaforo('ROJO');
    setRulaActual(5.2);
    HapticsService.alertaPosturaCritica();
    agregarAlerta(nueva);
  };

  const dispararAlertaAusencia = () => {
    const nueva: AlertaNotificacion = {
      id: `alt-${Date.now()}`,
      tipo: 'AUSENCIA_PUESTO',
      titulo: 'Ausencia en Puesto de Teletrabajo',
      descripcion: 'No se detecta presencia frente al monitor desde hace 15 minutos.',
      severidad: 'CRITICA',
      timestamp: 'Ahora mismo',
      leida: false,
    };
    setEstadoSemaforo('ROJO');
    setMinutosAusente(15);
    HapticsService.alertaAusencia();
    agregarAlerta(nueva);
  };

  const dispararAlertaSupervisor = () => {
    const nueva: AlertaNotificacion = {
      id: `alt-${Date.now()}`,
      tipo: 'INCIDENTE_EQUIPO',
      titulo: 'Incidente Crítico en Equipo',
      descripcion: 'Colaborador Juan Mendoza: Desconexión anómala y ausencia prolongada.',
      severidad: 'CRITICA',
      timestamp: 'Ahora mismo',
      leida: false,
      empleadoNombre: 'Juan Mendoza',
    };
    HapticsService.alertaAusencia();
    agregarAlerta(nueva);
  };

  const dispararAlertaSobrecargaEstatica45Min = (empleadoNombre?: string) => {
    const nueva: AlertaNotificacion = {
      id: `alt-${Date.now()}`,
      tipo: 'PAUSA_ACTIVA_REQUERIDA',
      titulo: '¡Pausa sugerida! Llevas 45 min en postura de riesgo',
      descripcion: 'Sobrecarga estática sostenida detectada. Realiza estiramientos para evitar fatiga cervical y lumbar.',
      severidad: 'ALTA',
      timestamp: 'Ahora mismo',
      leida: false,
      empleadoNombre: empleadoNombre || 'Colaborador',
    };
    setEstadoSemaforo('ROJO');
    setRulaActual(5.8);
    HapticsService.alertaPosturaCritica();
    agregarAlerta(nueva);
  };

  const enviarNotificacionPushSupervisor = (empleadoNombre: string, mensaje?: string) => {
    const textoMsg = mensaje || '¡Pausa sugerida! Llevas 45 min en postura de riesgo';
    const nueva: AlertaNotificacion = {
      id: `alt-${Date.now()}`,
      tipo: 'PAUSA_ACTIVA_REQUERIDA',
      titulo: textoMsg,
      descripcion: 'Notificación push emitida por la supervisión de SST para prevención ergonómica inmediata.',
      severidad: 'ALTA',
      timestamp: 'Ahora mismo',
      leida: false,
      empleadoNombre,
    };
    HapticsService.exitoConfirmacion();
    setUltimoPushEnviado({
      empleado: empleadoNombre,
      mensaje: textoMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    agregarAlerta(nueva);
  };

  const descartarAlertaActiva = () => {
    setAlertaActiva(null);
    setEstadoSemaforo('VERDE');
    setRulaActual(2.1);
    setMinutosAusente(0);
  };

  const marcarLeida = (id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leida: true } : a))
    );
  };

  const justificarPausaTeletrabajo = (_motivo: string, _duracionMin: number) => {
    HapticsService.exitoConfirmacion();
    descartarAlertaActiva();
  };

  return (
    <AlertasContext.Provider
      value={{
        alertas,
        alertaActiva,
        estadoSemaforo,
        minutosAusente,
        rulaActual,
        ultimoPushEnviado,
        descartarAlertaActiva,
        marcarLeida,
        dispararAlertaPostura,
        dispararAlertaAusencia,
        dispararAlertaSupervisor,
        dispararAlertaSobrecargaEstatica45Min,
        enviarNotificacionPushSupervisor,
        justificarPausaTeletrabajo,
      }}
    >
      {children}
    </AlertasContext.Provider>
  );
};

export const useAlertas = () => useContext(AlertasContext);
