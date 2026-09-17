import { LocalNotifications } from '@capacitor/local-notifications';
import { executePluginSafely } from '../capacitor/executePluginSafely.js';

export async function showNotification({ 
  id,
  title,
  body,
  extra = null
}) {
  return await executePluginSafely(
    'LocalNotifications',

    () => {LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          extra
        }
      ]
    })
    console.log('Notification Inmediata Funcionando Correctamente');
    },

    () => {
      null;
      console.log('Notification Fallida');
    }
  );
}

export async function scheduleNotification({
  id,
  title,
  body,
  at,
  extra = null
}) {
  return await executePluginSafely(
    'LocalNotifications',

    () => { LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: {
            at
          },
          extra
        }
      ]
    });
    console.log('Notification Programada Funcionando Correctamente');
    },

    () => null
  );
}

export async function cancelNotification(id) {
  return await executePluginSafely(
    'LocalNotifications',

    () => LocalNotifications.cancel({
      notifications: [{ id }]
    }),

    () => null
  );
}

async function cancelNotifications(ids) {
  return await executePluginSafely(
    'LocalNotifications',

    () => LocalNotifications.cancel({
      notifications: ids.map(id => ({ id }))
    }),

    () => null
  );
}

async function getScheduledNotifications() {
  return await executePluginSafely  (
    'LocalNotifications',

    () => LocalNotifications.getPending(),

    () => ({ notifications: [] })
  );
}



