import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';

interface Props {
  onSeleccionar: (correo: string) => void;
}

export const SelectorRolesDemo: React.FC<Props> = ({ onSeleccionar }) => {
  return (
    <View>
      <View style={estilos.separador} />
      <Text style={estilos.textoAccesoRapido}>Probar con perfiles:</Text>
      <View style={estilos.filaRoles}>
        <TouchableOpacity
          onPress={() => onSeleccionar('empleado@empresa.com')}
          style={estilos.chipRol}
        >
          <Text style={estilos.textoChip}>Empleado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSeleccionar('supervisor@empresa.com')}
          style={estilos.chipRol}
        >
          <Text style={estilos.textoChip}>Supervisor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSeleccionar('admin@empresa.com')}
          style={estilos.chipRol}
        >
          <Text style={estilos.textoChip}>Admin SST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSeleccionar('postulante@empresa.com')}
          style={[estilos.chipRol, { borderColor: Colores.advertencia }]}
        >
          <Text style={[estilos.textoChip, { color: Colores.advertencia }]}>
            Postulante
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  separador: {
    height: 1,
    backgroundColor: Colores.borde,
    marginVertical: Espaciado.lg,
  },
  textoAccesoRapido: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoMuted,
    marginBottom: Espaciado.sm,
  },
  filaRoles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaciado.xs,
  },
  chipRol: {
    backgroundColor: Colores.fondoElevado,
    borderWidth: 1,
    borderColor: Colores.borde,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  textoChip: {
    fontSize: Tipografia.micro,
    color: Colores.textoBlanco,
    fontWeight: '600',
  },
});
