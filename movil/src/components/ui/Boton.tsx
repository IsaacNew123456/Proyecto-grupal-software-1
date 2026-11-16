import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colores, Tipografia, Espaciado } from '../../constants/theme';

type VarianteBoton = 'primario' | 'secundario' | 'peligro' | 'fantasma';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  variante?: VarianteBoton;
  cargando?: boolean;
  deshabilitado?: boolean;
  icono?: React.ReactNode;
  estilo?: StyleProp<ViewStyle>;
}

export const Boton: React.FC<BotonProps> = ({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  icono,
  estilo,
}) => {
  const opacidad = deshabilitado || cargando ? 0.6 : 1;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={deshabilitado || cargando}
      style={[
        estilos.base,
        estilos[variante],
        { opacity: opacidad },
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator
          size="small"
          color={variante === 'primario' ? Colores.textoInverso : Colores.acento}
        />
      ) : (
        <>
          {icono}
          <Text
            style={[
              estilos.textoBase,
              estilos[`texto_${variante}` as keyof typeof estilos] as TextStyle,
              icono ? { marginLeft: Espaciado.sm } : null,
            ]}
          >
            {titulo}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primario: {
    backgroundColor: Colores.acento,
  },
  secundario: {
    backgroundColor: Colores.fondoSuperficie,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  peligro: {
    backgroundColor: Colores.peligro,
  },
  fantasma: {
    backgroundColor: 'transparent',
  },
  textoBase: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  texto_primario: {
    color: Colores.textoInverso,
  },
  texto_secundario: {
    color: Colores.textoBlanco,
  },
  texto_peligro: {
    color: Colores.textoBlanco,
  },
  texto_fantasma: {
    color: Colores.textoSecundario,
  },
});
