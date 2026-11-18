import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Server, Activity, ShieldCheck, Database } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Tarjeta } from '../../../components/ui/Tarjeta';
import { Badge } from '../../../components/ui/Badge';

export const SuperAdminSaludSaasScreen: React.FC = () => {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <Tarjeta estilo={estilos.tarjetaHero} elevada>
          <View style={estilos.filaTop}>
            <Text style={estilos.subtituloHero}>Operador Global SaaS</Text>
            <Badge texto="99.98% SLA" variante="exito" />
          </View>
          <Text style={estilos.tituloHero}>Estado del Sistema</Text>
          <Text style={estilos.descHero}>
            Telemetría de infraestructura y concurrencia multi-tenant global.
          </Text>

          <View style={estilos.gridKpis}>
            <View style={estilos.kpiItem}>
              <Server size={20} color={Colores.acento} />
              <Text style={estilos.kpiNumero}>32</Text>
              <Text style={estilos.kpiEtiqueta}>Empresas Activas</Text>
            </View>

            <View style={estilos.kpiItem}>
              <Activity size={20} color={Colores.exito} />
              <Text style={estilos.kpiNumero}>1,140</Text>
              <Text style={estilos.kpiEtiqueta}>Puestos en Vivo</Text>
            </View>

            <View style={estilos.kpiItem}>
              <Database size={20} color={Colores.info} />
              <Text style={estilos.kpiNumero}>42ms</Text>
              <Text style={estilos.kpiEtiqueta}>Latencia WS</Text>
            </View>
          </View>
        </Tarjeta>

        <Tarjeta>
          <View style={estilos.filaTitulo}>
            <ShieldCheck size={18} color={Colores.acento} />
            <Text style={estilos.tituloSeccion}>Nodos de Servicio</Text>
          </View>

          <View style={estilos.itemServicio}>
            <Text style={estilos.nombreServicio}>WebSockets Supervision Gateway</Text>
            <Badge texto="Operativo" variante="exito" />
          </View>

          <View style={estilos.itemServicio}>
            <Text style={estilos.nombreServicio}>Motor de Correlación & Reglas</Text>
            <Badge texto="Operativo" variante="exito" />
          </View>

          <View style={estilos.itemServicio}>
            <Text style={estilos.nombreServicio}>Bitácora Inmutable SHA-256 WORM</Text>
            <Badge texto="Operativo" variante="exito" />
          </View>
        </Tarjeta>
      </ScrollView>
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
  },
  tarjetaHero: {
    marginBottom: Espaciado.md,
  },
  filaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtituloHero: {
    fontSize: Tipografia.pequeno,
    color: Colores.acento,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tituloHero: {
    fontSize: Tipografia.tituloGrande,
    fontWeight: '800',
    color: Colores.textoBlanco,
    marginTop: 2,
  },
  descHero: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSecundario,
    marginTop: Espaciado.xs,
    marginBottom: Espaciado.lg,
  },
  gridKpis: {
    flexDirection: 'row',
    gap: Espaciado.sm,
  },
  kpiItem: {
    flex: 1,
    backgroundColor: Colores.fondoElevado,
    padding: Espaciado.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    alignItems: 'center',
  },
  kpiNumero: {
    fontSize: Tipografia.tituloMedio,
    fontWeight: '800',
    color: Colores.textoBlanco,
    marginTop: Espaciado.xs,
  },
  kpiEtiqueta: {
    fontSize: Tipografia.micro,
    color: Colores.textoMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaciado.xs,
    marginBottom: Espaciado.md,
  },
  tituloSeccion: {
    fontSize: Tipografia.subtitulo,
    fontWeight: '700',
    color: Colores.textoBlanco,
  },
  itemServicio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  nombreServicio: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoBlanco,
    flex: 1,
  },
});
