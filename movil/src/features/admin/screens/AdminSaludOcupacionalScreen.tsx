import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Award, Building, Activity, ShieldCheck } from 'lucide-react-native';
import { Colores, Tipografia, Espaciado } from '../../../constants/theme';
import { Header } from '../../../components/Header';
import { Tarjeta } from '../../../components/ui/Tarjeta';

interface Props {
  onNavegarAlertas: () => void;
}

export const AdminSaludOcupacionalScreen: React.FC<Props> = ({ onNavegarAlertas }) => {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <Header onAbrirAlertas={onNavegarAlertas} />

      <ScrollView contentContainerStyle={estilos.scroll} bounces={false}>
        <Tarjeta estilo={estilos.tarjetaHero} elevada>
          <Text style={estilos.subtituloHero}>Salud y Seguridad en el Trabajo</Text>
          <Text style={estilos.tituloHero}>Consola Ejecutiva SST</Text>
          <Text style={estilos.descHero}>
            Métricas consolidadas de salud ocupacional y teletrabajo seguro.
          </Text>

          <View style={estilos.gridKpis}>
            <View style={estilos.kpiItem}>
              <Award size={20} color={Colores.acento} />
              <Text style={estilos.kpiNumero}>92%</Text>
              <Text style={estilos.kpiEtiqueta}>Cumplimiento SST</Text>
            </View>

            <View style={estilos.kpiItem}>
              <Activity size={20} color={Colores.exito} />
              <Text style={estilos.kpiNumero}>48</Text>
              <Text style={estilos.kpiEtiqueta}>Puestos Activos</Text>
            </View>

            <View style={estilos.kpiItem}>
              <ShieldCheck size={20} color={Colores.info} />
              <Text style={estilos.kpiNumero}>1,420h</Text>
              <Text style={estilos.kpiEtiqueta}>Monitoreo Mensual</Text>
            </View>
          </View>
        </Tarjeta>

        <Tarjeta estilo={estilos.tarjetaDeptos}>
          <View style={estilos.filaTitulo}>
            <Building size={18} color={Colores.acento} />
            <Text style={estilos.tituloSeccion}>Riesgo Ergonómico por Área</Text>
          </View>

          <View style={estilos.itemDepto}>
            <View style={estilos.infoDepto}>
              <Text style={estilos.nombreDepto}>Desarrollo de Software</Text>
              <Text style={estilos.metaDepto}>22 puestos • RULA Promedio 2.4</Text>
            </View>
            <Text style={[estilos.tagEstado, { color: Colores.exito }]}>Óptimo</Text>
          </View>

          <View style={estilos.itemDepto}>
            <View style={estilos.infoDepto}>
              <Text style={estilos.nombreDepto}>Atención al Cliente</Text>
              <Text style={estilos.metaDepto}>16 puestos • RULA Promedio 3.8</Text>
            </View>
            <Text style={[estilos.tagEstado, { color: Colores.advertencia }]}>Leve Fatiga</Text>
          </View>

          <View style={estilos.itemDepto}>
            <View style={estilos.infoDepto}>
              <Text style={estilos.nombreDepto}>Administración y Finanzas</Text>
              <Text style={estilos.metaDepto}>10 puestos • RULA Promedio 2.1</Text>
            </View>
            <Text style={[estilos.tagEstado, { color: Colores.exito }]}>Óptimo</Text>
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
  tarjetaDeptos: {
    padding: Espaciado.lg,
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
  itemDepto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: Colores.borde,
  },
  infoDepto: {
    flex: 1,
  },
  nombreDepto: {
    fontSize: Tipografia.cuerpo,
    fontWeight: '600',
    color: Colores.textoBlanco,
  },
  metaDepto: {
    fontSize: Tipografia.pequeno,
    color: Colores.textoMuted,
    marginTop: 2,
  },
  tagEstado: {
    fontSize: Tipografia.pequeno,
    fontWeight: '700',
  },
});
