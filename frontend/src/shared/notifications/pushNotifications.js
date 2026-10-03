
export async function inicializarPushFCM() {
  return await executePluginSafely(
    'PushNotifications',
    async () => {
      // Listener para obtener el token FCM
      await PushNotifications.addListener('registration', token => {
        console.log('🔥 FCM TOKEN:', token.value);

        //Muestra el TOKEN FCM en el apartado acerca.
        const elemento = document.getElementById('fcm-token');
        if (elemento) {
          elemento.textContent = token.value;
        }

      });

      await PushNotifications.addListener('registrationError', error => {
        console.error('❌ Error registrando FCM:', error);
      });

      // Notificación recibida mientras la app está ABIERTA
      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('🔔 Notificación recibida:', notification);
      });

      // Usuario toca una notificación
      await PushNotifications.addListener('pushNotificationActionPerformed', action => {
        console.log('👆 Usuario abrió la notificación:', action);
      });

      let permiso = await PushNotifications.checkPermissions();

      if (permiso.receive !== 'granted') {
        console.warn('❌ Permiso de notificaciones no concedido:', permiso.receive);
        return false;
      }

      await PushNotifications.register();

      console.log('✅ FCM registrado correctamente');

      return true;
    },
    async () => {
      console.warn('PushNotifications no está disponible.');
      return false;
    }
  );
}