import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, BellRing, CheckCheck, AlertCircle } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Badge } from '../../../components/ui/Badge';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { useAlertas } from '../../../context/AlertasContext';
import { AlertaNotificacion } from '../../../types/alerta';

interface Props {
  onVolver: () => void;
}

export const BandejaAlertasScreen: React.FC<Props> = ({ onVolver }) => {
  const { alertas, marcarLeida } = useAlertas();

  const renderItem = ({ item }: { item: AlertaNotificacion }) => {
    const esAusencia = item.tipo === 'AUSENCIA_PUESTO';
    const esCritica = item.severidad === 'CRITICA';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => marcarLeida(item.id)}
        style={{ marginBottom: Espaciado.sm }}
      >
        <Tarjeta
          estilo={[
            estilos.tarjetaItem,
            !item.leida && { borderColor: Colores.bordeActivo },
          ]}
        >
          <View style={estilos.encabezadoItem}>
            <View style={estilos.iconoCaja}>
              {esCritica ? (
                <AlertCircle size={18} color={Colores.peligro} />
              ) : (
                <BellRing size={18} color={Colores.acento} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <View style={estilos.filaTitulo}>
                <Text style={estilos.tituloItem}>{item.titulo}</Text>
                {!item.leida && (
                  <View style={estilos.puntoNoLeido} />
                )}
              </View>
              <Text style={estilos.horaItem}>{item.timestamp}</Text>
            </View>

            <Badge
              texto={item.severidad}
              variante={
                item.severidad === 'CRITICA'
                  ? 'peligro'
                  : item.severidad === 'ALTA'
                  ? 'advertencia'
                  : 'acento'
              }
            />
          </View>

          <Text style={estilos.descripcionItem}>{item.descripcion}</Text>

          {item.empleadoNombre && (
            <Text style={estilos.empleadoTag}>
              Colaborador: {item.empleadoNombre}
            </Text>
          )}
        </Tarjeta>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.barraSuperior}>
        <TouchableOpacity onPress={onVolver} style={estilos.botonVolver}>
          <ArrowLeft size={20} color={Colores.textoBlanco} />
        </TouchableOpacity>
        <Text style={estilos.tituloBarra}>Bandeja de Alertas</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <View style={estilos.vacioContenedor}>
            <CheckCheck size={40} color={Colores.exito} />
            <Text style={estilos.textoVacio}>No tienes alertas pendientes</Text>
            <Text style={estilos.subtextoVacio}>
              Tu postura y presencia en teletrabajo se mantienen en parámetros óptimos.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Espaciado.lg,
    paddingVertical: Espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
    backgroundColor: Colores.fondoSuperficie,
  },
  botonVolver: {
    padding: Espaciado.xs,
  },
  tituloBarra: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  lista: {
    padding: Espaciado.lg,
  },
  tarjetaItem: {
    padding: Espaciado.md,
  },
  encabezadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Espaciado.xs,
  },
  iconoCaja: {
    marginRight: Espaciado.sm,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
  },
  tituloItem: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  puntoNoLeido: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colores.acento,
  },
  horaItem: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
  },
  descripcionItem: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    lineHeight: 18,
    marginTop: Espaciado.xs,
  },
  empleadoTag: {
    fontSize: Tipografia.micro,
    color: Colores.acento,
    fontWeight: '600',
    marginTop: Espaciado.xs,
  },
  vacioContenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Espaciado.xxl,
  },
  textoVacio: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '700',
    color: Colores.textoBlanco,
    marginTop: Espaciado.md,
  },
  subtextoVacio: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoSecundario,
    textAlign: 'center',
    marginTop: Espaciado.xs,
    paddingHorizontal: Espaciado.xl,
  },
});
