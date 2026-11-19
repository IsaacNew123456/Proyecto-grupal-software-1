import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Send, X, Smartphone, CheckCircle2 } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  visible: boolean;
  onCerrar: () => void;
  empleadoInicial?: string;
}

const EMPLEADOS = [
  { id: '1', nombre: 'Valeria Gómez', estado: 'Riesgo RULA 6.0' },
  { id: '2', nombre: 'Javier Rocha', estado: 'Ausencia 35 min' },
  { id: '3', nombre: 'Andrés Soto', estado: 'Postura Estática' },
];

const PLANTILLAS_MENSAJE = [
  '¡Pausa sugerida! Llevas 45 min en postura de riesgo',
  'Corrección Postural: Flexión cervical crítica',
  'Pausa Activa Requerida: Alivio de sobrecarga muscular',
];

export const ModalEnviarPushSupervisor: React.FC<Props> = ({
  visible,
  onCerrar,
  empleadoInicial,
}) => {
  const { enviarNotificacionPushSupervisor } = useAlertas();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(
    empleadoInicial || EMPLEADOS[0].nombre,
  );
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(PLANTILLAS_MENSAJE[0]);
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = () => {
    enviarNotificacionPushSupervisor(empleadoSeleccionado, mensajeSeleccionado);
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onCerrar();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={estilos.overlay}>
        <Tarjeta estilo={estilos.tarjeta} elevada>
          <View style={estilos.encabezado}>
            <View style={estilos.filaTitulo}>
              <Smartphone size={20} color={Colores.acento} />
              <Text style={estilos.titulo}>Envío de Alerta Push</Text>
            </View>
            <TouchableOpacity onPress={onCerrar} disabled={enviado}>
              <X size={20} color={Colores.textoSecundario} />
            </TouchableOpacity>
          </View>

          {enviado ? (
            <View style={estilos.cajaExito}>
              <CheckCircle2 size={36} color={Colores.exito} />
              <Text style={estilos.textoExito}>Notificación Push enviada</Text>
              <Text style={estilos.subtextoExito}>
                El móvil de {empleadoSeleccionado} ha vibrado con la alerta.
              </Text>
            </View>
          ) : (
            <>
              <Text style={estilos.seccionLabel}>Seleccionar Colaborador Destino</Text>
              <View style={estilos.listaOpciones}>
                {EMPLEADOS.map((emp) => {
                  const activo = emp.nombre === empleadoSeleccionado;
                  return (
                    <TouchableOpacity
                      key={emp.id}
                      style={[estilos.opcion, activo && estilos.opcionActiva]}
                      onPress={() => setEmpleadoSeleccionado(emp.nombre)}
                    >
                      <Text style={[estilos.opcionTexto, activo && estilos.opcionTextoActivo]}>
                        {emp.nombre}
                      </Text>
                      <Text style={estilos.opcionSubtexto}>{emp.estado}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={estilos.seccionLabel}>Mensaje de Alerta Push</Text>
              <View style={estilos.listaOpciones}>
                {PLANTILLAS_MENSAJE.map((msg, index) => {
                  const activo = msg === mensajeSeleccionado;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[estilos.opcion, activo && estilos.opcionActiva]}
                      onPress={() => setMensajeSeleccionado(msg)}
                    >
                      <Text style={[estilos.opcionTexto, activo && estilos.opcionTextoActivo]}>
                        {msg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={estilos.acciones}>
                <Boton
                  titulo="Cancelar"
                  onPress={onCerrar}
                  variante="fantasma"
                  estilo={{ flex: 1 }}
                />
                <Boton
                  titulo="Enviar Push"
                  onPress={manejarEnvio}
                  variante="primario"
                  icono={<Send size={16} color={Colores.textoInverso} />}
                  estilo={{ flex: 1.3 }}
                />
              </View>
            </>
          )}
        </Tarjeta>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  tarjeta: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Espaciado.xl,
    backgroundColor: Colores.fondoSuperficie,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Espaciado.md,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
  },
  titulo: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  seccionLabel: {
    fontSize: Tipografia.pequeno,
    fontWeight: '600',
    color: Colores.textoSecundario,
    marginBottom: Espaciado.xs,
    marginTop: Espaciado.sm,
  },
  listaOpciones: {
    gap: Espaciado.xs,
  },
  opcion: {
    padding: Espaciado.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    backgroundColor: Colores.fondoElevado,
  },
  opcionActiva: {
    borderColor: Colores.acento,
    backgroundColor: 'rgba(198, 244, 50, 0.08)',
  },
  opcionTexto: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoBlanco,
    fontWeight: '500',
  },
  opcionTextoActivo: {
    color: Colores.acento,
    fontWeight: '700',
  },
  opcionSubtexto: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
    marginTop: 2,
  },
  acciones: {
    flexDirection: 'row',
    gap: Espaciado.sm,
    marginTop: Espaciado.lg,
  },
  cajaExito: {
    alignItems: 'center',
    paddingVertical: Espaciado.xl,
    gap: Espaciado.sm,
  },
  textoExito: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  subtextoExito: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    textAlign: 'center',
  },
});
