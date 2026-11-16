import * as Haptics from 'expo-haptics';

export const HapticsService = {
  alertaPosturaLeve(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignorar en entornos sin motor háptico
    }
  },

  alertaPosturaCritica(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Ignorar
    }
  },

  alertaAusencia(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Ignorar
    }
  },

  exitoConfirmacion(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignorar
    }
  },
};
