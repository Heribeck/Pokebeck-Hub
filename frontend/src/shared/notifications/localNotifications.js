import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

function isAvailable() {
  return Capacitor.isPluginAvailable('LocalNotifications');
}

async function hasNotificationPermission() {
  const permission = await LocalNotifications.checkPermissions();
  return permission.display === 'granted';
}

export async function showNotification({ id, title, body, extra = null }) {
  if (!isAvailable()) return false;

  try {
    if (!(await hasNotificationPermission())) return false;

    await LocalNotifications.schedule({
      notifications: [{ id, title, body, extra }],
    });
    return true;
  } catch (error) {
    console.error('No se pudo mostrar la notificación local:', error);
    return false;
  }
}

export async function scheduleNotification({ id, title, body, at, extra = null }) {
  if (!isAvailable()) return false;
  if (!(at instanceof Date) || Number.isNaN(at.getTime())) {
    console.error('No se pudo programar la notificación local: la fecha no es válida.');
    return false;
  }

  try {
    if (!(await hasNotificationPermission())) return false;

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: { at },
          extra,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('No se pudo programar la notificación local:', error);
    return false;
  }
}

export async function cancelNotification(id) {
  if (!isAvailable()) return false;

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    return true;
  } catch (error) {
    console.error('No se pudo cancelar la notificación local:', error);
    return false;
  }
}
