import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellRing, Check, Coffee, Play } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  onAbrirJustificarPausa: () => void;
  onIniciarPausa?: () => void;
}

export const AlertaActivaBanner: React.FC<Props> = ({
  onAbrirJustificarPausa,
  onIniciarPausa,
}) => {
  const { alertaActiva, descartarAlertaActiva } = useAlertas();

  if (!alertaActiva) return null;

  const esAusencia = alertaActiva.tipo === 'AUSENCIA_PUESTO';
  const esPausa = alertaActiva.tipo === 'PAUSA_ACTIVA_REQUERIDA';
  const esPeligro = alertaActiva.severidad === 'CRITICA';
  const colorBorde = esPeligro ? Colores.peligro : Colores.advertencia;

  return (
    <Tarjeta
      elevada
      bordeColor={colorBorde}
      estilo={estilos.tarjeta}
    >
      <View style={estilos.encabezado}>
        <View style={estilos.iconoCaja}>
          <BellRing size={20} color={colorBorde} />
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
        ) : esPausa && onIniciarPausa ? (
          <>
            <Boton
              titulo="Iniciar Pausa"
              onPress={onIniciarPausa}
              variante="primario"
              icono={<Play size={16} color={Colores.textoInverso} />}
              estilo={{ flex: 1.2 }}
            />
            <Boton
              titulo="Entendido"
              onPress={descartarAlertaActiva}
              variante="secundario"
              icono={<Check size={16} color={Colores.textoBlanco} />}
              estilo={{ flex: 1 }}
            />
          </>
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
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  hora: {
    fontSize: Tipografia.micro,
    color: Colores.textoSecundario,
    marginTop: 2,
  },
  descripcion: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    marginBottom: Espaciado.md,
    lineHeight: 20,
  },
  botones: {
    flexDirection: 'row',
    gap: Espaciado.sm,
  },
});
