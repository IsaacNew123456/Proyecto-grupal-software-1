import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';

export const ResumenPuestosSemaforo: React.FC = () => {
  return (
    <Tarjeta estilo={estilos.tarjeta}>
      <View style={estilos.encabezado}>
        <View style={estilos.filaTitulo}>
          <Users size={18} color={Colores.acento} />
          <Text style={estilos.titulo}>Puestos de Equipo en Vivo</Text>
        </View>
        <Text style={estilos.subtitulo}>24 puestos asignados</Text>
      </View>

      <View style={estilos.mosaicoGrid}>
        <View style={[estilos.cardEstado, { borderColor: Colores.exito }]}>
          <Text style={[estilos.numero, { color: Colores.exito }]}>18</Text>
          <Text style={estilos.etiqueta}>En Foco</Text>
        </View>

        <View style={[estilos.cardEstado, { borderColor: Colores.advertencia }]}>
          <Text style={[estilos.numero, { color: Colores.advertencia }]}>3</Text>
          <Text style={estilos.etiqueta}>Fatiga / Alerta</Text>
        </View>

        <View style={[estilos.cardEstado, { borderColor: Colores.peligro }]}>
          <Text style={[estilos.numero, { color: Colores.peligro }]}>1</Text>
          <Text style={estilos.etiqueta}>Incidente</Text>
        </View>

        <View style={[estilos.cardEstado, { borderColor: Colores.textoMuted }]}>
          <Text style={[estilos.numero, { color: Colores.textoMuted }]}>2</Text>
          <Text style={estilos.etiqueta}>En Pausa</Text>
        </View>
      </View>
    </Tarjeta>
  );
};

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: Espaciado.md,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Espaciado.md,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
  },
  titulo: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  subtitulo: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
  },
  mosaicoGrid: {
    flexDirection: 'row',
    gap: Espaciado.sm,
  },
  cardEstado: {
    flex: 1,
    backgroundColor: Colores.fondoElevado,
    paddingVertical: Espaciado.md,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  numero: {
    fontSize: Tipografia.tituloGrande,
    fontWeight: '800',
  },
  etiqueta: {
    fontSize: Tipografia.micro,
    color: Colores.textoSecundario,
    marginTop: 2,
    textAlign: 'center',
  },
});
