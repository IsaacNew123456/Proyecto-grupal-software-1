import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Monitor, ShieldAlert } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Boton } from '../../../components/ui/Boton';
import { Tarjeta } from '../../../components/ui/Tarjeta';

interface Props {
  visible: boolean;
  onCerrar: () => void;
}

export const PostulanteBloqueoModal: React.FC<Props> = ({ visible, onCerrar }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={estilos.overlay}>
        <Tarjeta estilo={estilos.tarjeta} elevada>
          <View style={estilos.iconoContenedor}>
            <ShieldAlert size={36} color={Colores.advertencia} />
          </View>

          <Text style={estilos.titulo}>Acceso No Permitido en Móvil</Text>
          
          <Text style={estilos.descripcion}>
            Tu perfil de <Text style={estilos.destacado}>Postulante</Text> está configurado para rendir exámenes con supervisión biométrica por visión artificial.
          </Text>

          <View style={estilos.cajaInformativa}>
            <Monitor size={20} color={Colores.acento} />
            <Text style={estilos.textoCaja}>
              Por favor ingresa desde una computadora o laptop con navegador Chrome o Edge para acceder a tu evaluación.
            </Text>
          </View>

          <Boton
            titulo="Entendido"
            onPress={onCerrar}
            variante="primario"
            estilo={estilos.boton}
          />
        </Tarjeta>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Espaciado.xl,
  },
  tarjeta: {
    width: '100%',
    alignItems: 'center',
    borderColor: Colores.bordeActivo,
  },
  iconoContenedor: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colores.advertenciaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Espaciado.lg,
  },
  titulo: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
    marginBottom: Espaciado.sm,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Espaciado.lg,
  },
  destacado: {
    color: Colores.advertencia,
    fontWeight: '700',
  },
  cajaInformativa: {
    flexDirection: 'row',
    backgroundColor: Colores.fondoSuperficie,
    padding: Espaciado.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    gap: Espaciado.sm,
    alignItems: 'center',
    marginBottom: Espaciado.xl,
  },
  textoCaja: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    flex: 1,
    lineHeight: 18,
  },
  boton: {
    width: '100%',
  },
});
