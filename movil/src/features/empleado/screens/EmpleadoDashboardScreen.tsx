import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Sliders, Bell } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Boton } from '../../../components/ui/Boton';
import { SemaforoPosturalCard } from '../components/SemaforoPosturalCard';
import { AlertaActivaBanner } from '../components/AlertaActivaBanner';
import { ResumenMetricasCard } from '../components/ResumenMetricasCard';
import { JustificarPausaModal } from '../components/JustificarPausaModal';
import { PausasActivasModal } from '../components/PausasActivasModal';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  onNavegarAlertas: () => void;
}

export const EmpleadoDashboardScreen: React.FC<Props> = ({ onNavegarAlertas }) => {
  const { dispararAlertaPostura, dispararAlertaAusencia } = useAlertas();
  const [modalPausaVisible, setModalPausaVisible] = useState(false);
  const [modalActivasVisible, setModalActivasVisible] = useState(false);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header onAbrirAlertas={onNavegarAlertas} />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <AlertaActivaBanner
          onAbrirJustificarPausa={() => setModalPausaVisible(true)}
        />

        <SemaforoPosturalCard />

        <ResumenMetricasCard
          onIniciarPausa={() => setModalActivasVisible(true)}
        />

        {/* Panel de prueba interactiva de alertas */}
        <View style={estilos.cajaSimulador}>
          <View style={estilos.filaTituloSim}>
            <Sliders size={16} color={Colores.acento} />
            <Text style={estilos.tituloSimulador}>
              Simulador de Telemetría Móvil
            </Text>
          </View>
          <Text style={estilos.descSimulador}>
            Prueba cómo reacciona el móvil ante eventos de la cámara web:
          </Text>

          <View style={estilos.botonesSim}>
            <Boton
              titulo="Alerta Postura RULA"
              onPress={dispararAlertaPostura}
              variante="secundario"
              estilo={{ flex: 1 }}
            />
            <Boton
              titulo="Alerta Ausencia 15m"
              onPress={dispararAlertaAusencia}
              variante="secundario"
              estilo={{ flex: 1 }}
            />
          </View>

          <Boton
            titulo="Ver Historial de Alertas"
            onPress={onNavegarAlertas}
            variante="fantasma"
            icono={<Bell size={16} color={Colores.textoSecundario} />}
            estilo={{ marginTop: Espaciado.xs }}
          />
        </View>
      </ScrollView>

      <JustificarPausaModal
        visible={modalPausaVisible}
        onCerrar={() => setModalPausaVisible(false)}
      />

      <PausasActivasModal
        visible={modalActivasVisible}
        onCerrar={() => setModalActivasVisible(false)}
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
  botonesSim: {
    flexDirection: 'row',
    gap: Espaciado.sm,
    marginBottom: Espaciado.sm,
  },
});
