import { executePluginSafely } from '../capacitor/executePluginSafely.js';
import { PushNotifications } from '@capacitor/push-notifications';

export async function requestNotificationPermission() {
    return await executePluginSafely(
        'PushNotifications',
        async () => {
        let permiso = await PushNotifications.checkPermissions();

        if (permiso.receive === 'prompt') {
            permiso = await PushNotifications.requestPermissions();
        }

        if (permiso.receive !== 'granted') {
            console.warn('❌ Permiso de notificaciones no concedido:', permiso.receive);
            return false;
        }

        return true;
        },
        async () => {
        console.warn('PushNotifications no está disponible.');
        return false;
        }
    );
}
