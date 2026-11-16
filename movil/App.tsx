import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AlertasProvider } from './src/context/AlertasContext';
import { AppNavigator } from './src/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlertasProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AlertasProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
