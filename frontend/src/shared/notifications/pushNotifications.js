import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { showNotification } from './localNotifications.js';

let initializationPromise = null;
let listenersRegistered = false;
let localPushNotificationId = 1_000_000_000 + (Date.now() % 1_000_000_000);

function getNextLocalPushNotificationId() {
  localPushNotificationId += 1;
  if (localPushNotificationId >= 2_000_000_000) {
    localPushNotificationId = 1_000_000_000;
  }
  return localPushNotificationId;
}

async function showForegroundNotification(notification) {
  const title = notification.title?.trim();
  const body = notification.body?.trim();
  if (!title && !body) {
    console.warn('La notificación push recibida no contiene título ni mensaje.');
    return;
  }

  const displayed = await showNotification({
    id: getNextLocalPushNotificationId(),
    title: title || 'Pokebeck Hub',
    body: body || '',
    extra: notification.data ?? null,
  });

  if (!displayed) {
    console.warn('No se pudo mostrar la notificación push recibida en primer plano.');
  }
}

async function registerPushListeners() {
  if (listenersRegistered) return;

  await PushNotifications.addListener('registration', () => {
    console.info('Dispositivo registrado en FCM.');
  });

  await PushNotifications.addListener('registrationError', (error) => {
    console.error('No se pudo registrar el dispositivo en FCM:', error);
  });

  await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    showForegroundNotification(notification).catch((error) => {
      console.error('No se pudo mostrar la notificación push recibida:', error);
    });
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', () => {
    console.info('Se abrió una notificación push.');
  });

  listenersRegistered = true;
}

async function registerDeviceForPush() {
  const permission = await PushNotifications.checkPermissions();
  if (permission.receive !== 'granted') {
    console.warn('No se registró FCM porque el permiso de notificaciones no está concedido.');
    return false;
  }

  await registerPushListeners();
  await PushNotifications.register();
  console.info('Se solicitó el registro del dispositivo en FCM.');
  return true;
}

export async function inicializarPushFCM() {
  if (!Capacitor.isPluginAvailable('PushNotifications')) {
    console.warn('PushNotifications no está disponible en esta plataforma.');
    return false;
  }

  if (!initializationPromise) {
    initializationPromise = registerDeviceForPush();
  }

  try {
    const registered = await initializationPromise;
    if (!registered) initializationPromise = null;
    return registered;
  } catch (error) {
    initializationPromise = null;
    throw error;
  }
}