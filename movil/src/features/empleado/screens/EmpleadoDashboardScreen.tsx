import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colores, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Boton } from '../../../components/ui/Boton';
import { SemaforoPosturalCard } from '../components/SemaforoPosturalCard';
import { AlertaActivaBanner } from '../components/AlertaActivaBanner';
import { ResumenMetricasCard } from '../components/ResumenMetricasCard';
import { JustificarPausaModal } from '../components/JustificarPausaModal';
import { PausasActivasModal } from '../components/PausasActivasModal';

interface Props {
  onNavegarAlertas: () => void;
}

export const EmpleadoDashboardScreen: React.FC<Props> = ({ onNavegarAlertas }) => {
  const [modalPausaVisible, setModalPausaVisible] = useState(false);
  const [modalActivasVisible, setModalActivasVisible] = useState(false);

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header onAbrirAlertas={onNavegarAlertas} />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <AlertaActivaBanner
          onAbrirJustificarPausa={() => setModalPausaVisible(true)}
          onIniciarPausa={() => setModalActivasVisible(true)}
        />

        <SemaforoPosturalCard />

        <ResumenMetricasCard
          onIniciarPausa={() => setModalActivasVisible(true)}
        />

        <View style={estilos.seccionHistorial}>
          <Boton
            titulo="Ver Historial de Notificaciones"
            onPress={onNavegarAlertas}
            variante="secundario"
            icono={<Bell size={16} color={Colores.textoBlanco} />}
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
  seccionHistorial: {
    marginTop: Espaciado.sm,
    marginBottom: Espaciado.md,
  },
});
