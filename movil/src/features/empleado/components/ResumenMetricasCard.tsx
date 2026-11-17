import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, Clock, ShieldAlert, Sparkles } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';

interface Props {
  onIniciarPausa: () => void;
}

export const ResumenMetricasCard: React.FC<Props> = ({ onIniciarPausa }) => {
  return (
    <Tarjeta estilo={estilos.tarjeta}>
      <Text style={estilos.titulo}>Resumen de Jornada SST</Text>
      <Text style={estilos.subtitulo}>Teletrabajo y Biomecánica Continua</Text>

      <View style={estilos.grid}>
        <View style={estilos.celda}>
          <HeartPulse size={20} color={Colores.acento} />
          <Text style={estilos.valorMetrica}>88%</Text>
          <Text style={estilos.etiquetaMetrica}>Índice Bienestar</Text>
        </View>

        <View style={estilos.celda}>
          <Clock size={20} color={Colores.info} />
          <Text style={estilos.valorMetrica}>4h 45m</Text>
          <Text style={estilos.etiquetaMetrica}>Monitoreo Activo</Text>
        </View>

        <View style={estilos.celda}>
          <ShieldAlert size={20} color={Colores.advertencia} />
          <Text style={estilos.valorMetrica}>3</Text>
          <Text style={estilos.etiquetaMetrica}>Alertas Atendidas</Text>
        </View>
      </View>

      <Boton
        titulo="Pausa Activa de 2 Minutos"
        onPress={onIniciarPausa}
        variante="secundario"
        icono={<Sparkles size={16} color={Colores.acento} />}
        estilo={{ marginTop: Espaciado.md }}
      />
    </Tarjeta>
  );
};

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: Espaciado.md,
  },
  titulo: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  subtitulo: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    marginBottom: Espaciado.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Espaciado.sm,
  },
  celda: {
    flex: 1,
    backgroundColor: Colores.fondoElevado,
    padding: Espaciado.md,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  valorMetrica: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '800',
    color: Colores.textoBlanco,
    marginTop: Espaciado.xs,
  },
  etiquetaMetrica: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
    textAlign: 'center',
    marginTop: 2,
  },
});
