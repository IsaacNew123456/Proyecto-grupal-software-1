import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut, Bell } from 'lucide-react-native';
import { LogoErgoCheck } from './ui/LogoErgoCheck';
import { Colores, Tipografia, Espaciado } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useAlertas } from '../context/AlertasContext';

interface HeaderProps {
  onAbrirAlertas?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAbrirAlertas }) => {
  const { usuario, cerrarSesion } = useAuth();
  const { alertas } = useAlertas();
  const noLeidas = alertas.filter((a) => !a.leida).length;

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.izquierda}>
        <LogoErgoCheck size={26} color={Colores.acento} />
        <View style={estilos.infoUsuario}>
          <Text style={estilos.nombre}>
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'ErgoCheck'}
          </Text>
          <Text style={estilos.organizacion} numberOfLines={1}>
            {usuario?.organizationName || 'Plataforma SST'}
          </Text>
        </View>
      </View>

      <View style={estilos.acciones}>
        {onAbrirAlertas && (
          <TouchableOpacity
            onPress={onAbrirAlertas}
            style={estilos.botonIcono}
            activeOpacity={0.7}
          >
            <Bell size={20} color={Colores.textoBlanco} />
            {noLeidas > 0 && (
              <View style={estilos.badgeNotificacion}>
                <Text style={estilos.textoBadge}>{noLeidas}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={cerrarSesion}
          style={estilos.botonIcono}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={Colores.textoSecundario} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Espaciado.lg,
    paddingVertical: Espaciado.md,
    backgroundColor: Colores.fondoSuperficie,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  izquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoUsuario: {
    marginLeft: Espaciado.md,
    flex: 1,
  },
  nombre: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  organizacion: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.sm,
  },
  botonIcono: {
    padding: Espaciado.sm,
    position: 'relative',
  },
  badgeNotificacion: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colores.peligro,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  textoBadge: {
    color: Colores.textoBlanco,
    fontSize: Tipografia.micro,
    fontWeight: '700',
  },
});
