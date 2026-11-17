import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ergocheck_auth_token';
const USUARIO_KEY = 'ergocheck_user_data';

export const StorageService = {
  async guardarToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch {
      // Fallback silencioso si el entorno no admite SecureStore
    }
  },

  async obtenerToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async guardarUsuario(usuario: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
    } catch {
      // Fallback
    }
  },

  async obtenerUsuario(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync(USUARIO_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async limpiarTodo(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USUARIO_KEY);
    } catch {
      // Fallback
    }
  },
};
