import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Badge } from '../../../components/ui/Badge';
import { useAlertas } from '../../../context/AlertasContext';

export const SemaforoPosturalCard: React.FC = () => {
  const { estadoSemaforo, rulaActual, minutosAusente } = useAlertas();

  const configuracion = {
    VERDE: {
      color: Colores.exito,
      etiqueta: 'Postura Óptima',
      descripcion: 'Alineación de columna y cuello dentro de los parámetros seguros.',
      icono: <ShieldCheck size={20} color={Colores.exito} />,
    },
    AMARILLO: {
      color: Colores.advertencia,
      etiqueta: 'Fatiga / Ajuste Leve',
      descripcion: 'Se detecta leve inclinación cervical o fatiga postural prolongada.',
      icono: <AlertTriangle size={20} color={Colores.advertencia} />,
    },
    ROJO: {
      color: Colores.peligro,
      etiqueta: minutosAusente > 0 ? 'Ausente del Puesto' : 'Alerta de Mala Postura',
      descripcion:
        minutosAusente > 0
          ? `Sin detección en cámara por ${minutosAusente} minutos continuos.`
          : 'Puntuación RULA crítica. Realiza una micro-pausa o endereza la espalda.',
      icono: <AlertTriangle size={20} color={Colores.peligro} />,
    },
    GRIS: {
      color: Colores.textoMuted,
      etiqueta: 'En Pausa',
      descripcion: 'Sesión en pausa justificada.',
      icono: <Activity size={20} color={Colores.textoMuted} />,
    },
  }[estadoSemaforo];

  return (
    <Tarjeta estilo={[estilos.tarjeta, { borderLeftColor: configuracion.color, borderLeftWidth: 4 }]}>
      <View style={estilos.encabezado}>
        <View style={estilos.filaEstado}>
          <View style={[estilos.indicadorPunto, { backgroundColor: configuracion.color }]} />
          <Text style={estilos.tituloEstado}>{configuracion.etiqueta}</Text>
        </View>
        <Badge
          texto={`RULA: ${rulaActual.toFixed(1)}`}
          variante={rulaActual <= 3 ? 'exito' : rulaActual <= 5 ? 'advertencia' : 'peligro'}
        />
      </View>

      <Text style={estilos.descripcion}>{configuracion.descripcion}</Text>

      <View style={estilos.pie}>
        <View style={estilos.infoSincro}>
          <Activity size={14} color={Colores.acento} />
          <Text style={estilos.textoSincro}>Edge AI en PC sincronizado</Text>
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
    marginBottom: Espaciado.sm,
  },
  filaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.sm,
  },
  indicadorPunto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tituloEstado: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  descripcion: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    lineHeight: 20,
    marginBottom: Espaciado.md,
  },
  pie: {
    borderTopWidth: 1,
    borderTopColor: Colores.borde,
    paddingTop: Espaciado.sm,
  },
  infoSincro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
  },
  textoSincro: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoMuted,
  },
});
