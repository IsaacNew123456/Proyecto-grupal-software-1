import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Sparkles, Check, ChevronRight, X } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';

interface Props {
  visible: boolean;
  onCerrar: () => void;
}

const EJERCICIOS = [
  {
    titulo: 'Regla 20-20-20 Visual',
    duracion: '30 seg',
    instruccion: 'Mira un objeto situado a 6 metros (20 pies) de distancia durante 20 segundos para relajar los músculos ciliares de los ojos.',
  },
  {
    titulo: 'Retracción Cervical',
    duracion: '45 seg',
    instruccion: 'Lleva la barbilla suavemente hacia atrás como si quisieras hacer papada, manteniendo la mirada al frente. Sostén 5s y repite 4 veces.',
  },
  {
    titulo: 'Rotación Escapular',
    duracion: '45 seg',
    instruccion: 'Eleva los hombros hacia las orejas y gíralos en círculos amplios hacia atrás para liberar tensión en trapecios y dorsales.',
  },
];

export const PausasActivasModal: React.FC<Props> = ({ visible, onCerrar }) => {
  const [paso, setPaso] = useState(0);

  const ejercicio = EJERCICIOS[paso];
  const esUltimo = paso === EJERCICIOS.length - 1;

  const siguientePaso = () => {
    if (esUltimo) {
      setPaso(0);
      onCerrar();
    } else {
      setPaso((prev) => prev + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={estilos.overlay}>
        <Tarjeta estilo={estilos.tarjeta} elevada>
          <View style={estilos.encabezado}>
            <View style={estilos.filaTitulo}>
              <Sparkles size={20} color={Colores.acento} />
              <Text style={estilos.titulo}>Pausa Activa Guiada</Text>
            </View>
            <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
              <X size={20} color={Colores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <Text style={estilos.indicadorPaso}>
            Paso {paso + 1} de {EJERCICIOS.length} • {ejercicio.duracion}
          </Text>

          <View style={estilos.cajaEjercicio}>
            <Text style={estilos.tituloEjercicio}>{ejercicio.titulo}</Text>
            <Text style={estilos.instruccion}>{ejercicio.instruccion}</Text>
          </View>

          <Boton
            titulo={esUltimo ? 'Finalizar Pausa' : 'Siguiente Ejercicio'}
            onPress={siguientePaso}
            variante="primario"
            icono={
              esUltimo ? (
                <Check size={18} color={Colores.textoInverso} />
              ) : (
                <ChevronRight size={18} color={Colores.textoInverso} />
              )
            }
          />
        </Tarjeta>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: Espaciado.lg,
  },
  tarjeta: {
    padding: Espaciado.xl,
    borderRadius: 16,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Espaciado.xs,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.sm,
  },
  titulo: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  botonCerrar: {
    padding: Espaciado.xs,
  },
  indicadorPaso: {
    fontSize: Tipografia.pequeno,
    color: Colores.acento,
    fontWeight: '600',
    marginBottom: Espaciado.lg,
  },
  cajaEjercicio: {
    backgroundColor: Colores.fondoElevado,
    padding: Espaciado.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    marginBottom: Espaciado.xl,
  },
  tituloEjercicio: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
    marginBottom: Espaciado.sm,
  },
  instruccion: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    lineHeight: 22,
  },
});
