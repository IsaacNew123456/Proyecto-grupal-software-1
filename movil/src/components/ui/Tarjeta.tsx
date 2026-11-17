import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colores, Espaciado } from '../../constants/theme';

interface TarjetaProps {
  children: React.ReactNode;
  estilo?: StyleProp<ViewStyle>;
  elevada?: boolean;
  bordeColor?: string;
}

export const Tarjeta: React.FC<TarjetaProps> = ({
  children,
  estilo,
  elevada = false,
  bordeColor = Colores.borde,
}) => {
  return (
    <View
      style={[
        estilos.base,
        {
          backgroundColor: elevada ? Colores.fondoElevado : Colores.fondoSuperficie,
          borderColor: bordeColor,
        },
        estilo,
      ]}
    >
      {children}
    </View>
  );
};

const estilos = StyleSheet.create({
  base: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Espaciado.lg,
  },
});
