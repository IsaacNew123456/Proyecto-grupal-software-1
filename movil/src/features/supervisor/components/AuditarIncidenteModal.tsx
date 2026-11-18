import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ShieldCheck, XCircle, AlertCircle, X } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Boton } from '../../../components/ui/Boton';
import { HapticsService } from '../../../services/haptics';

interface Props {
  incidente: any | null;
  visible: boolean;
  onCerrar: () => void;
  onCompletado: (estado: string) => void;
}

export const AuditarIncidenteModal: React.FC<Props> = ({
  incidente,
  visible,
  onCerrar,
  onCompletado,
}) => {
  const [justificacion, setJustificacion] = useState('');

  if (!incidente) return null;

  const auditar = (estado: string) => {
    HapticsService.exitoConfirmacion();
    onCompletado(estado);
    onCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={estilos.overlay}>
        <Tarjeta estilo={estilos.tarjeta} elevada>
          <View style={estilos.encabezado}>
            <Text style={estilos.titulo}>Auditar Incidente en Móvil</Text>
            <TouchableOpacity onPress={onCerrar}>
              <X size={20} color={Colores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <Text style={estilos.empleado}>{incidente.empleado}</Text>
          <Text style={estilos.motivo}>{incidente.motivo}</Text>
          <Text style={estilos.hora}>{incidente.hora}</Text>

          <View style={estilos.acciones}>
            <Boton
              titulo="Confirmar Falta"
              onPress={() => auditar('CONFIRMADO')}
              variante="peligro"
              icono={<AlertCircle size={16} color={Colores.textoBlanco} />}
            />
            <Boton
              titulo="Desestimar / Justificado"
              onPress={() => auditar('DESESTIMADO')}
              variante="primario"
              icono={<ShieldCheck size={16} color={Colores.textoInverso} />}
            />
            <Boton
              titulo="Falso Positivo"
              onPress={() => auditar('FALSO_POSITIVO')}
              variante="secundario"
              icono={<XCircle size={16} color={Colores.textoBlanco} />}
            />
          </View>
        </Tarjeta>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    marginBottom: Espaciado.sm,
  },
  titulo: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  empleado: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '600',
    color: Colores.acento,
    marginBottom: 4,
  },
  motivo: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoBlanco,
    marginBottom: 4,
  },
  hora: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoMuted,
    marginBottom: Espaciado.xl,
  },
  acciones: {
    gap: Espaciado.sm,
  },
});
