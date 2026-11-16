import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellRing, Check, Coffee } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  onAbrirJustificarPausa: () => void;
}

export const AlertaActivaBanner: React.FC<Props> = ({ onAbrirJustificarPausa }) => {
  const { alertaActiva, descartarAlertaActiva } = useAlertas();

  if (!alertaActiva) return null;

  const esAusencia = alertaActiva.tipo === 'AUSENCIA_PUESTO';

  return (
    <Tarjeta
      elevada
      bordeColor={esAusencia ? Colores.peligro : Colores.advertencia}
      estilo={estilos.tarjeta}
    >
      <View style={estilos.encabezado}>
        <View style={estilos.iconoCaja}>
          <BellRing
            size={20}
            color={esAusencia ? Colores.peligro : Colores.advertencia}
          />
        </View>
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>{alertaActiva.titulo}</Text>
          <Text style={estilos.hora}>{alertaActiva.timestamp}</Text>
        </View>
      </View>

      <Text style={estilos.descripcion}>{alertaActiva.descripcion}</Text>

      <View style={estilos.botones}>
        {esAusencia ? (
          <Boton
            titulo="Justificar Pausa"
            onPress={onAbrirJustificarPausa}
            variante="primario"
            icono={<Coffee size={16} color={Colores.textoInverso} />}
            estilo={{ flex: 1 }}
          />
        ) : (
          <Boton
            titulo="Corregido"
            onPress={descartarAlertaActiva}
            variante="primario"
            icono={<Check size={16} color={Colores.textoInverso} />}
            estilo={{ flex: 1 }}
          />
        )}
      </View>
    </Tarjeta>
  );
};

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: Espaciado.md,
    backgroundColor: Colores.fondoSuperficie,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Espaciado.sm,
  },
  iconoCaja: {
    padding: Espaciado.xs,
    borderRadius: 8,
    backgroundColor: Colores.fondoElevado,
    marginRight: Espaciado.sm,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  hora: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
  },
  descripcion: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    lineHeight: 18,
    marginBottom: Espaciado.md,
  },
  botones: {
    flexDirection: 'row',
    gap: Espaciado.sm,
  },
});
