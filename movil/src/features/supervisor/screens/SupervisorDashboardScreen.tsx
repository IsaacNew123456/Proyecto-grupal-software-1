import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Sliders } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Boton } from '../../../components/ui/Boton';
import { ResumenPuestosSemaforo } from '../components/ResumenPuestosSemaforo';
import { ListaIncidentesEquipo } from '../components/ListaIncidentesEquipo';
import { AuditarIncidenteModal } from '../components/AuditarIncidenteModal';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  onNavegarAlertas: () => void;
}

export const SupervisorDashboardScreen: React.FC<Props> = ({ onNavegarAlertas }) => {
  const { dispararAlertaSupervisor } = useAlertas();
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const abrirAuditoria = (inc: any) => {
    setIncidenteSeleccionado(inc);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header onAbrirAlertas={onNavegarAlertas} />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <ResumenPuestosSemaforo />
        <ListaIncidentesEquipo onSeleccionarIncidente={abrirAuditoria} />

        <View style={estilos.cajaSimulador}>
          <View style={estilos.filaTituloSim}>
            <Sliders size={16} color={Colores.acento} />
            <Text style={estilos.tituloSimulador}>Guardia Móvil de Supervisión</Text>
          </View>
          <Text style={estilos.descSimulador}>
            Simula recibir una notificación de alerta crítica de tu equipo asignado:
          </Text>

          <Boton
            titulo="Disparar Alerta Crítica de Equipo"
            onPress={dispararAlertaSupervisor}
            variante="secundario"
          />
        </View>
      </ScrollView>

      <AuditarIncidenteModal
        incidente={incidenteSeleccionado}
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onCompletado={() => {}}
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
});
