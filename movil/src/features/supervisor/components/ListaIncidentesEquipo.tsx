import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Badge } from '../../../components/ui/Badge';

interface Props {
  onSeleccionarIncidente: (incidente: any) => void;
}

const INCIDENTES_DEMO = [
  {
    id: 'inc-101',
    empleado: 'Javier Rocha',
    motivo: 'Ausencia sin justificar > 35 min',
    severidad: 'CRITICA',
    hora: 'Hace 8 min',
    estado: 'PENDIENTE',
  },
  {
    id: 'inc-102',
    empleado: 'Valeria Gomez',
    motivo: 'Sobrecarga postural RULA 6.0 persistente',
    severidad: 'ALTA',
    hora: 'Hace 22 min',
    estado: 'PENDIENTE',
  },
];

export const ListaIncidentesEquipo: React.FC<Props> = ({ onSeleccionarIncidente }) => {
  return (
    <Tarjeta estilo={estilos.tarjeta}>
      <Text style={estilos.titulo}>Incidentes Pendientes de Auditoría</Text>
      <Text style={estilos.subtitulo}>Requieren validación de jefatura</Text>

      <View style={estilos.lista}>
        {INCIDENTES_DEMO.map((inc) => (
          <TouchableOpacity
            key={inc.id}
            onPress={() => onSeleccionarIncidente(inc)}
            style={estilos.item}
            activeOpacity={0.7}
          >
            <View style={estilos.iconoCaja}>
              <AlertCircle size={20} color={Colores.peligro} />
            </View>

            <View style={estilos.detalles}>
              <View style={estilos.filaTop}>
                <Text style={estilos.empleado}>{inc.empleado}</Text>
                <Badge
                  texto={inc.severidad}
                  variante={inc.severidad === 'CRITICA' ? 'peligro' : 'advertencia'}
                />
              </View>
              <Text style={estilos.motivo}>{inc.motivo}</Text>
              <Text style={estilos.hora}>{inc.hora}</Text>
            </View>

            <ChevronRight size={18} color={Colores.textoMuted} />
          </TouchableOpacity>
        ))}
      </View>
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
  lista: {
    gap: Espaciado.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colores.fondoElevado,
    padding: Espaciado.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  iconoCaja: {
    marginRight: Espaciado.sm,
  },
  detalles: {
    flex: 1,
    marginRight: Espaciado.sm,
  },
  filaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  empleado: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  motivo: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    lineHeight: 18,
  },
  hora: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
    marginTop: 2,
  },
});
