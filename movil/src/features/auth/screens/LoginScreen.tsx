import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { LogoErgoCheck } from '../../../components/ui/LogoErgoCheck';
import { Boton } from '../../../components/ui/Boton';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { useAuth } from '../../../context/AuthContext';
import { PostulanteBloqueoModal } from './PostulanteBloqueoModal';
import { SelectorRolesDemo } from '../components/SelectorRolesDemo';

export const LoginScreen: React.FC = () => {
  const { iniciarSesion, cargando, esPostulanteBloqueado, limpiarBloqueoPostulante } = useAuth();
  const [correo, setCorreo] = useState('carlos.mendoza@ergocheck.com');
  const [clave, setClave] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);

  const manejarLogin = async () => {
    setError(null);
    if (!correo.trim() || !clave.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      await iniciarSesion(correo, clave);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    }
  };

  const seleccionarRolDemo = (tipoCorreo: string) => {
    setCorreo(tipoCorreo);
    setClave('Password123!');
    setError(null);
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
          <View style={estilos.marcaContenedor}>
            <View style={estilos.logoCirculo}>
              <LogoErgoCheck size={40} color={Colores.acento} />
            </View>
            <Text style={estilos.tituloApp}>ErgoCheck AI</Text>
            <Text style={estilos.subtituloApp}>
              Smart Companion & Teletrabajo Seguro
            </Text>
          </View>

          <Tarjeta estilo={estilos.tarjetaLogin}>
            <Text style={estilos.tituloTarjeta}>Acceso a la Plataforma</Text>
            <Text style={estilos.descripcionTarjeta}>
              Ingresa con tus credenciales corporativas para recibir alertas ergonómicas en tiempo real.
            </Text>

            {error && (
              <View style={estilos.cajaError}>
                <Text style={estilos.textoError}>{error}</Text>
              </View>
            )}

            <View style={estilos.campo}>
              <Text style={estilos.etiqueta}>Correo Corporativo</Text>
              <View style={estilos.inputContenedor}>
                <Mail size={18} color={Colores.textoSecundario} />
                <TextInput
                  value={correo}
                  onChangeText={setCorreo}
                  placeholder="ejemplo@empresa.com"
                  placeholderTextColor={Colores.textoMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={estilos.input}
                />
              </View>
            </View>

            <View style={estilos.campo}>
              <Text style={estilos.etiqueta}>Contraseña</Text>
              <View style={estilos.inputContenedor}>
                <Lock size={18} color={Colores.textoSecundario} />
                <TextInput
                  value={clave}
                  onChangeText={setClave}
                  placeholder="••••••••••••"
                  placeholderTextColor={Colores.textoMuted}
                  secureTextEntry
                  style={estilos.input}
                />
              </View>
            </View>

            <Boton
              titulo="Iniciar Sesión"
              onPress={manejarLogin}
              cargando={cargando}
              icono={<ArrowRight size={18} color={Colores.textoInverso} />}
              estilo={estilos.botonLogin}
            />

            <SelectorRolesDemo onSeleccionar={seleccionarRolDemo} />
          </Tarjeta>

          <View style={estilos.pieSeguridad}>
            <ShieldCheck size={16} color={Colores.textoMuted} />
            <Text style={estilos.textoSeguridad}>
              Autenticación JWT con aislamiento multi-tenant cifrado
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PostulanteBloqueoModal
        visible={esPostulanteBloqueado}
        onCerrar={limpiarBloqueoPostulante}
      />
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  scroll: {
    padding: Espaciado.lg,
    justifyContent: 'center',
    flexGrow: 1,
  },
  marcaContenedor: {
    alignItems: 'center',
    marginBottom: Espaciado.xl,
  },
  logoCirculo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colores.fondoSuperficie,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colores.borde,
    marginBottom: Espaciado.md,
  },
  tituloApp: {
    fontSize: Tipografia.tituloGrande,
    fontWeight: '800',
    color: Colores.textoBlanco,
    letterSpacing: 0.5,
  },
  subtituloApp: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    marginTop: Espaciado.xs,
  },
  tarjetaLogin: {
    padding: Espaciado.xl,
    borderRadius: 16,
  },
  tituloTarjeta: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  descripcionTarjeta: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    marginTop: Espaciado.xs,
    marginBottom: Espaciado.lg,
    lineHeight: 18,
  },
  cajaError: {
    backgroundColor: Colores.peligroSuave,
    borderColor: Colores.peligro,
    borderWidth: 1,
    padding: Espaciado.md,
    borderRadius: 8,
    marginBottom: Espaciado.md,
  },
  textoError: {
    color: Colores.peligro,
    fontSize: Tipografia.pequeno,
    fontWeight: '600',
  },
  campo: {
    marginBottom: Espaciado.md,
  },
  etiqueta: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    marginBottom: Espaciado.xs,
    fontWeight: '600',
  },
  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colores.fondoElevado,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    paddingHorizontal: Espaciado.md,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: Espaciado.sm,
    color: Colores.textoBlanco,
    fontSize: Tipografia.cuerpo,
  },
  botonLogin: {
    marginTop: Espaciado.md,
  },
  pieSeguridad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Espaciado.xl,
    gap: Espaciado.xs,
  },
  textoSeguridad: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
  },
});
