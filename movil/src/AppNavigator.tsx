import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';
import { Colores } from './constants/theme';
import { LoginScreen } from './features/auth/screens/LoginScreen';
import { EmpleadoDashboardScreen } from './features/empleado/screens/EmpleadoDashboardScreen';
import { SupervisorDashboardScreen } from './features/supervisor/screens/SupervisorDashboardScreen';
import { AdminSaludOcupacionalScreen } from './features/admin/screens/AdminSaludOcupacionalScreen';
import { SuperAdminSaludSaasScreen } from './features/superadmin/screens/SuperAdminSaludSaasScreen';
import { BandejaAlertasScreen } from './features/alertas/screens/BandejaAlertasScreen';

export const AppNavigator: React.FC = () => {
  const { usuario, cargando } = useAuth();
  const [pantallaActual, setPantallaActual] = useState<'principal' | 'alertas'>('principal');

  if (cargando) {
    return (
      <View style={estilos.cargandoContenedor}>
        <ActivityIndicator size="large" color={Colores.acento} />
      </View>
    );
  }

  if (!usuario) {
    return <LoginScreen />;
  }

  if (pantallaActual === 'alertas') {
    return <BandejaAlertasScreen onVolver={() => setPantallaActual('principal')} />;
  }

  const irAAlertas = () => setPantallaActual('alertas');

  switch (usuario.rol) {
    case 'SUPER_ADMINISTRADOR':
      return <SuperAdminSaludSaasScreen />;
    case 'ADMIN_ORGANIZACION':
      return <AdminSaludOcupacionalScreen onNavegarAlertas={irAAlertas} />;
    case 'SUPERVISOR':
    case 'EVALUADOR':
      return <SupervisorDashboardScreen onNavegarAlertas={irAAlertas} />;
    case 'EMPLEADO':
    default:
      return <EmpleadoDashboardScreen onNavegarAlertas={irAAlertas} />;
  }
};

const estilos = StyleSheet.create({
  cargandoContenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
