import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colores, Tipografia, Espaciado } from '../../constants/theme';

type VarianteBadge = 'exito' | 'advertencia' | 'peligro' | 'info' | 'acento' | 'neutro';

interface BadgeProps {
  texto: string;
  variante?: VarianteBadge;
  icono?: React.ReactNode;
}

const esquemasColor = {
  exito: { fondo: Colores.exitoSuave, texto: Colores.exito, borde: Colores.exito },
  advertencia: { fondo: Colores.advertenciaSuave, texto: Colores.advertencia, borde: Colores.advertencia },
  peligro: { fondo: Colores.peligroSuave, texto: Colores.peligro, borde: Colores.peligro },
  info: { fondo: Colores.infoSuave, texto: Colores.info, borde: Colores.info },
  acento: { fondo: Colores.acentoSuave, texto: Colores.acento, borde: Colores.acento },
  neutro: { fondo: Colores.fondoElevado, texto: Colores.textoSecundario, borde: Colores.borde },
};

export const Badge: React.FC<BadgeProps> = ({
  texto,
  variante = 'neutro',
  icono,
}) => {
  const esquema = esquemasColor[variante];

  return (
    <View
      style={[
        estilos.contenedor,
        {
          backgroundColor: esquema.fondo,
          borderColor: esquema.borde,
        },
      ]}
    >
      {icono}
      <Text
        style={[
          estilos.texto,
          { color: esquema.texto },
          icono ? { marginLeft: Espaciado.xs } : null,
        ]}
      >
        {texto}
      </Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: Tipografia.pequeno,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
