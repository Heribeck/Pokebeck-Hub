import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  if (!Capacitor.isPluginAvailable('LocalNotifications')) {
    console.warn('LocalNotifications no está disponible en este dispositivo.');
    return false;
  }

  try {
    let permission = await LocalNotifications.checkPermissions();
    if (permission.display === 'granted') return true;
    if (permission.display === 'denied') {
      console.warn('El permiso para notificaciones locales fue denegado.');
      return false;
    }

    permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('El permiso para notificaciones locales no fue concedido.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('No se pudo solicitar el permiso de notificaciones locales:', error);
    return false;
  }
}
