// Notificaciones locales para recordarle al jugador que su racha del Desafío del Día
// está en riesgo si no ha jugado hoy. Usa @capacitor/local-notifications.
const LocalNotifications = window.Capacitor?.Plugins?.LocalNotifications;

const ID_NOTIFICACION_RACHA = 9001;
const HORA_RECORDATORIO = 20; // 8:00 PM, hora local del dispositivo

if (!LocalNotifications) {
  console.warn(
    'El plugin LocalNotifications no está disponible (probablemente estás en el navegador). ' +
    'Las notificaciones de racha no se van a programar en este entorno.'
  );
}

// Pide permiso al usuario para mostrar notificaciones (solo hace falta una vez,
// pero es seguro llamarlo varias veces: si ya lo concedió, no vuelve a preguntar)
export async function solicitarPermisoNotificaciones() {
  if (!LocalNotifications) return false;

  try {
    const resultado = await LocalNotifications.requestPermissions();
    return resultado.display === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de notificaciones:', error);
    return false;
  }
}

// Calcula a qué hora debería dispararse el recordatorio de hoy.
// Si ya pasó esa hora (ej. el usuario abre la app a las 9pm), devuelve null
// para NO programar un recordatorio para un horario que ya pasó.
export function calcularHoraRecordatorio(fechaActual = new Date()) {
  const objetivo = new Date(fechaActual);
  objetivo.setHours(HORA_RECORDATORIO, 0, 0, 0);

  if (objetivo <= fechaActual) {
    return null;
  }
  return objetivo;
}

// Programa el recordatorio de "tu racha está en riesgo" para hoy a las 8pm,
// solo si todavía tiene sentido (no ha pasado esa hora ya).
export async function programarNotificacionRacha(racha) {
  if (!LocalNotifications) return;

  const horaObjetivo = calcularHoraRecordatorio();
  if (!horaObjetivo) return; // ya pasaron las 8pm hoy, no programar nada

  const mensaje =
    racha > 0
      ? `🔥 Tu racha de ${racha} días está en riesgo. ¡Juega el Desafío del Día antes de que termine hoy!`
      : "🌙 Antes de que acabe el día, date una vuelta por la app. Repasa un poco y cierra tu jornada con buen ritmo.";

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: ID_NOTIFICACION_RACHA,
          title: 'Pokebeck Hub',
          body: mensaje,
          schedule: { at: horaObjetivo },
        },
      ],
    });
  } catch (error) {
    console.error('Error programando la notificación de racha:', error);
  }
}

// Cancela el recordatorio programado (se llama apenas el jugador YA completó
// el Desafío del Día, para no molestarlo con un aviso que ya no aplica)
export async function cancelarNotificacionRacha() {
  if (!LocalNotifications) return;

  try {
    await LocalNotifications.cancel({ notifications: [{ id: ID_NOTIFICACION_RACHA }] });
  } catch (error) {
    console.error('Error cancelando la notificación de racha:', error);
  }
}

import { mostrarNotificacion } from './utils.js';

// SOLO PARA PRUEBAS: programa una notificación en X segundos desde ahora,
// para probar rápido en el dispositivo real sin esperar a las 8pm.
// Muestra el resultado en pantalla (toast) para poder depurar sin consola remota.
export async function programarNotificacionDePrueba(segundosDesdeAhora = 10) {
  if (!LocalNotifications) {
    mostrarNotificacion('LocalNotifications no disponible en este entorno (¿estás en el navegador?)');
    return;
  }

  mostrarNotificacion('Pidiendo permiso de notificaciones...');
  const permisoConcedido = await solicitarPermisoNotificaciones();

  if (!permisoConcedido) {
    mostrarNotificacion('❌ Permiso NO concedido. Actívalo en Ajustes > Apps > Pokebeck Hub > Notificaciones');
    return;
  }

  mostrarNotificacion('✅ Permiso concedido. Programando notificación...');

  const horaObjetivo = new Date(Date.now() + segundosDesdeAhora * 1000);

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 9999,
          title: 'Pokebeck Hub (PRUEBA)',
          body: `🔥 Notificación de prueba, programada para ${segundosDesdeAhora} segundos.`,
          schedule: { at: horaObjetivo },
        },
      ],
    });
    mostrarNotificacion(`✅ Programada para dentro de ${segundosDesdeAhora}s. ¡Minimiza la app ahora!`);
  } catch (error) {
    mostrarNotificacion('❌ Error al programar: ' + error.message);
  }
}