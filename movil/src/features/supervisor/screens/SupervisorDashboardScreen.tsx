import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Sliders, Send, CheckCircle2, Zap, AlertTriangle } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Boton } from '../../../components/ui/Boton';
import { ResumenPuestosSemaforo } from '../components/ResumenPuestosSemaforo';
import { ListaIncidentesEquipo } from '../components/ListaIncidentesEquipo';
import { AuditarIncidenteModal } from '../components/AuditarIncidenteModal';
import { ModalEnviarPushSupervisor } from '../components/ModalEnviarPushSupervisor';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  onNavegarAlertas: () => void;
}

export const SupervisorDashboardScreen: React.FC<Props> = ({ onNavegarAlertas }) => {
  const {
    dispararAlertaSupervisor,
    dispararAlertaSobrecargaEstatica45Min,
    dispararAlertaAusencia,
    ultimoPushEnviado,
  } = useAlertas();
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<any | null>(null);
  const [modalAuditoriaVisible, setModalAuditoriaVisible] = useState(false);
  const [modalPushVisible, setModalPushVisible] = useState(false);

  const abrirAuditoria = (inc: any) => {
    setIncidenteSeleccionado(inc);
    setModalAuditoriaVisible(true);
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header onAbrirAlertas={onNavegarAlertas} />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <ResumenPuestosSemaforo />

        {/* Panel de Enviar Notificación Push al Colaborador */}
        <View style={estilos.cajaPush}>
          <View style={estilos.filaTituloSim}>
            <Send size={16} color={Colores.acento} />
            <Text style={estilos.tituloSimulador}>Emisión de Alertas Push</Text>
          </View>
          <Text style={estilos.descSimulador}>
            Envía alertas push de prevención ergonómica y pausas activas directas al móvil del empleado.
          </Text>

          {ultimoPushEnviado && (
            <View style={estilos.badgeEnvio}>
              <CheckCircle2 size={14} color={Colores.exito} />
              <Text style={estilos.badgeTexto}>
                Push enviado a {ultimoPushEnviado.empleado} ({ultimoPushEnviado.timestamp})
              </Text>
            </View>
          )}

          <Boton
            titulo="Enviar Alerta Push a Colaborador"
            onPress={() => setModalPushVisible(true)}
            variante="primario"
            icono={<Send size={16} color={Colores.textoInverso} />}
          />
        </View>

        <ListaIncidentesEquipo onSeleccionarIncidente={abrirAuditoria} />

        {/* Consola de Simulación exclusiva para el Supervisor */}
        <View style={estilos.cajaSimulador}>
          <View style={estilos.filaTituloSim}>
            <Sliders size={16} color={Colores.acento} />
            <Text style={estilos.tituloSimulador}>Simulador de Guardia y Telemetría</Text>
          </View>
          <Text style={estilos.descSimulador}>
            Prueba cómo reacciona el sistema ante eventos de telemetría y sobrecarga:
          </Text>

          <Boton
            titulo="Simular Push: 45 min en Riesgo (Vibración)"
            onPress={() => dispararAlertaSobrecargaEstatica45Min('Valeria Gómez')}
            variante="secundario"
            icono={<Zap size={16} color={Colores.acento} />}
            estilo={{ marginBottom: Espaciado.xs }}
          />

          <View style={estilos.botonesSim}>
            <Boton
              titulo="Alerta Crítica Equipo"
              onPress={dispararAlertaSupervisor}
              variante="secundario"
              estilo={{ flex: 1 }}
            />
            <Boton
              titulo="Alerta Ausencia 15m"
              onPress={dispararAlertaAusencia}
              variante="secundario"
              icono={<AlertTriangle size={14} color={Colores.peligro} />}
              estilo={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>

      <AuditarIncidenteModal
        incidente={incidenteSeleccionado}
        visible={modalAuditoriaVisible}
        onCerrar={() => setModalAuditoriaVisible(false)}
        onCompletado={() => {}}
      />

      <ModalEnviarPushSupervisor
        visible={modalPushVisible}
        onCerrar={() => setModalPushVisible(false)}
      />
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  scroll: {
    padding: Espaciado.lg,
  },
  cajaPush: {
    backgroundColor: Colores.fondoSuperficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colores.bordeActivo,
    padding: Espaciado.lg,
    marginBottom: Espaciado.md,
  },
  cajaSimulador: {
    backgroundColor: Colores.fondoSuperficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: Espaciado.lg,
    marginTop: Espaciado.sm,
  },
  filaTituloSim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
    marginBottom: 4,
  },
  tituloSimulador: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  descSimulador: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    marginBottom: Espaciado.md,
  },
  botonesSim: {
    flexDirection: 'row',
    gap: Espaciado.sm,
  },
  badgeEnvio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: Espaciado.sm,
    borderRadius: 6,
    marginBottom: Espaciado.sm,
  },
  badgeTexto: {
    fontSize: Tipografia.pequeno,
    color: Colores.exito,
    fontWeight: '600',
  },
});
