import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Coffee, Dumbbell, PhoneCall, Check, X } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';
import { useAlertas } from '../../../context/AlertasContext';

interface Props {
  visible: boolean;
  onCerrar: () => void;
}

const OPCIONES_PAUSA = [
  { id: 'estiramiento', label: 'Pausa Activa / Estiramiento', icono: Dumbbell, min: 10 },
  { id: 'refrigerio', label: 'Hidratación o Refrigerio', icono: Coffee, min: 15 },
  { id: 'llamada', label: 'Llamada Laboral / Reunión', icono: PhoneCall, min: 20 },
];

export const JustificarPausaModal: React.FC<Props> = ({ visible, onCerrar }) => {
  const { justificarPausaTeletrabajo } = useAlertas();
  const [seleccionado, setSeleccionado] = useState(OPCIONES_PAUSA[0].id);

  const manejarConfirmar = () => {
    const opcion = OPCIONES_PAUSA.find((o) => o.id === seleccionado);
    if (opcion) {
      justificarPausaTeletrabajo(opcion.label, opcion.min);
    }
    onCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={estilos.overlay}>
        <Tarjeta estilo={estilos.tarjeta} elevada>
          <View style={estilos.encabezado}>
            <Text style={estilos.titulo}>Justificar Ausencia en Puesto</Text>
            <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
              <X size={20} color={Colores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <Text style={estilos.descripcion}>
            Registra tu pausa de teletrabajo para evitar penalizaciones de dedicación en tu reporte de jornada.
          </Text>

          <View style={estilos.listaOpciones}>
            {OPCIONES_PAUSA.map((op) => {
              const Icono = op.icono;
              const activo = seleccionado === op.id;
              return (
                <TouchableOpacity
                  key={op.id}
                  onPress={() => setSeleccionado(op.id)}
                  style={[estilos.opcion, activo && estilos.opcionActiva]}
                  activeOpacity={0.8}
                >
                  <View style={[estilos.iconoCaja, activo && estilos.iconoCajaActiva]}>
                    <Icono size={18} color={activo ? Colores.acento : Colores.textoSecundario} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[estilos.opcionTexto, activo && estilos.opcionTextoActivo]}>
                      {op.label}
                    </Text>
                    <Text style={estilos.opcionMin}>{op.min} minutos estimados</Text>
                  </View>
                  {activo && <Check size={18} color={Colores.acento} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <Boton
            titulo="Confirmar y Reanudar"
            onPress={manejarConfirmar}
            variante="primario"
            icono={<Check size={16} color={Colores.textoInverso} />}
            estilo={{ marginTop: Espaciado.md }}
          />
        </Tarjeta>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    padding: Espaciado.md,
  },
  tarjeta: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Espaciado.xl,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Espaciado.xs,
  },
  botonCerrar: {
    padding: Espaciado.xs,
  },
  titulo: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  descripcion: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    marginBottom: Espaciado.lg,
    lineHeight: 18,
  },
  listaOpciones: {
    gap: Espaciado.sm,
    marginBottom: Espaciado.lg,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Espaciado.md,
    borderRadius: 10,
    backgroundColor: Colores.fondoElevado,
    borderWidth: 1,
    borderColor: Colores.borde,
    gap: Espaciado.md,
  },
  opcionActiva: {
    borderColor: Colores.acento,
    backgroundColor: Colores.acentoSuave,
  },
  iconoCaja: {
    padding: Espaciado.sm,
    borderRadius: 8,
    backgroundColor: Colores.fondoSuperficie,
  },
  iconoCajaActiva: {
    backgroundColor: Colores.fondoSuperficie,
  },
  opcionTexto: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '600',
    color: Colores.textoBlanco,
  },
  opcionTextoActivo: {
    color: Colores.textoBlanco,
  },
  opcionMin: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
  },
});
