import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { executePluginSafely } from '../../../../shared/capacitor/executePluginSafely.js';
import { Capacitor } from '@capacitor/core';

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};

const CLAVE_PROGRESO = 'pokebeck_progreso';
const CLAVE_NOTIFICACION_PROGRAMADA = 'pokebeck_notificacion_programada';

// Estructura por defecto si el jugador nunca ha guardado progreso todavía
function progresoPorDefecto() {
  return {
    rachaGeneral: 0,
    mejorRachaGeneral: 0,
    ultimaActividad: null,        // formato "YYYY-MM-DD HH:mm" (última actividad)
    ultimaActividadFecha: null,   // formato "YYYY-MM-DD" (para comparación diaria)
    ultimoDiaDesafioCompletado: null, // formato "YYYY-MM-DD" (solo para saber si completó desafío hoy)
    fechaIntentosHoy: null,           // formato "YYYY-MM-DD", para saber si resetear el contador
    intentosUsadosHoy: 0,
  };
}

// Devuelve la fecha de hoy en formato "YYYY-MM-DD", en la zona horaria local del dispositivo
function obtenerFechaDeHoy() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Devuelve la fecha y hora actual en formato "YYYY-MM-DD HH:mm"
function obtenerFechaHoraActual() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minuto = String(ahora.getMinutes()).padStart(2, '0');
  return `${año}-${mes}-${dia} ${hora}:${minuto}`;
}

// Devuelve la fecha de ayer en formato "YYYY-MM-DD"
function obtenerFechaDeAyer() {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const año = ayer.getFullYear();
  const mes = String(ayer.getMonth() + 1).padStart(2, '0');
  const dia = String(ayer.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Devuelve la hora de reinicio (8pm) de hoy en formato "YYYY-MM-DD 20:00"
function obtenerHoraReinicio8pm() {
  const hoy = new Date();
  hoy.setHours(20, 0, 0, 0);
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia} 20:00`;
}

// Verifica si ya pasó la hora de reinicio (8pm) hoy
function yaPaso8pm() {
  const ahora = new Date();
  const hora8pm = new Date();
  hora8pm.setHours(20, 0, 0, 0);
  return ahora >= hora8pm;
}

// Lee el progreso guardado. Si no existe nada todavía, devuelve la estructura por defecto.
export async function obtenerProgreso() {
  return await executePluginSafely(
    'Preferences',
    async () => {
      const resultado = await Preferences.get({ key: CLAVE_PROGRESO });
      if (!resultado || !resultado.value) {
        return progresoPorDefecto();
      }
      return JSON.parse(resultado.value);
    },
    async () => {
      const valor = localStorage.getItem(CLAVE_PROGRESO);
      if (!valor) return progresoPorDefecto();
      return JSON.parse(valor);
    }
  );
}

// Guarda el objeto de progreso completo
async function guardarProgreso(progreso) {
  await executePluginSafely(
    'Preferences',
    async () => {
      await Preferences.set({ key: CLAVE_PROGRESO, value: JSON.stringify(progreso) });
    },
    async () => {
      localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
    }
  );
}

// Revisa si la racha general sigue vigente según la hora de reinicio (8pm)
// Si pasaron 2 días sin actividad, la racha se reinicia
export async function verificarRachaVigente() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();
  const ayer = obtenerFechaDeAyer();

  let rachaReiniciada = false;

  // Si no hay actividad registrada nunca, no hacer nada
  if (!progreso.ultimaActividadFecha) {
    return progreso;
  }

  // Si ya pasó 8pm hoy, verificar si hubo actividad hoy
  if (yaPaso8pm()) {
    if (progreso.ultimaActividadFecha !== hoy) {
      // No hubo actividad hoy antes de las 8pm, verificar si fue ayer
      if (progreso.ultimaActividadFecha !== ayer) {
        // No fue ayer ni hoy, pasaron 2+ días sin actividad
        if (progreso.rachaGeneral > 0) {
          progreso.rachaGeneral = 0;
          rachaReiniciada = true;
          await guardarProgreso(progreso);
        }
      }
    }
  } else {
    // Antes de 8pm, verificar si hubo actividad ayer
    if (progreso.ultimaActividadFecha !== hoy && progreso.ultimaActividadFecha !== ayer) {
      // No hubo actividad ayer ni hoy, pasaron 2+ días sin actividad
      if (progreso.rachaGeneral > 0) {
        progreso.rachaGeneral = 0;
        rachaReiniciada = true;
        await guardarProgreso(progreso);
      }
    }
  }

  // Actualizar UI de racha si se reinició
  if (rachaReiniciada) {
    const { domElements } = await import('../../../../config/config.js');
    if (domElements.main.rachaMain) {
      domElements.main.rachaMain.textContent = `🔥 0 días`;
    }
    if (domElements.poketype.rachaTexto) {
      domElements.poketype.rachaTexto.textContent = `🔥 0 días`;
    }
  }

  return progreso;
}

// Cuántos intentos del Desafío del Día lleva usados HOY (máximo 2).
// Si cambió el día desde la última vez, resetea el contador automáticamente.
export async function obtenerIntentosDisponiblesHoy() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();

  if (progreso.fechaIntentosHoy !== hoy) {
    return 2;
  }

  return 2 - progreso.intentosUsadosHoy;
}

// Registra que el jugador usó un intento del Desafío del Día hoy (haya pasado o no).
export async function consumirIntentoDeHoy() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();

  if (progreso.fechaIntentosHoy !== hoy) {
    progreso.fechaIntentosHoy = hoy;
    progreso.intentosUsadosHoy = 0;
  }

  progreso.intentosUsadosHoy += 1;
  await guardarProgreso(progreso);

  return 2 - progreso.intentosUsadosHoy;
}

// Se llama cuando el jugador APRUEBA el Desafío del Día (≥70% de aciertos).
// Solo marca como completado, ya no maneja racha.
export async function registrarDesafioAprobado() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();

  if (progreso.ultimoDiaDesafioCompletado === hoy) {
    return progreso;
  }

  progreso.ultimoDiaDesafioCompletado = hoy;
  await guardarProgreso(progreso);
  return progreso;
}

// Se llama cuando el jugador AGOTA sus 2 intentos del día sin aprobar el 70%.
// Ya no reinicia racha, la racha es general.
export async function registrarDesafioFallido() {
  const progreso = await obtenerProgreso();
  await guardarProgreso(progreso);
  return progreso;
}

// Registra cualquier actividad general (jugar nivel, generar, etc.)
// Actualiza o incrementa la racha general según corresponda
export async function registrarActividadGeneral() {
  let progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();
  const ayer = obtenerFechaDeAyer();
  const fechaHoraActual = obtenerFechaHoraActual();

  const rachaAnterior = progreso.rachaGeneral;

  // Verificar primero si la racha sigue vigente
  await verificarRachaVigente();
  progreso = await obtenerProgreso();

  let rachaIncrementada = false;

  // Si es la primera actividad del día actual
  if (progreso.ultimaActividadFecha !== hoy) {
    // Si la última actividad fue ayer, incrementar racha
    if (progreso.ultimaActividadFecha === ayer) {
      progreso.rachaGeneral += 1;
      rachaIncrementada = true;
    } else {
      // Si fue hace más de 1 día, iniciar nueva racha
      progreso.rachaGeneral = 1;
      rachaIncrementada = true;
    }
  }

  // Actualizar mejor racha
  progreso.mejorRachaGeneral = Math.max(progreso.mejorRachaGeneral, progreso.rachaGeneral);

  // Registrar fecha y hora de actividad
  progreso.ultimaActividad = fechaHoraActual;
  progreso.ultimaActividadFecha = hoy;

  await guardarProgreso(progreso);

  // Mostrar notificación solo si la racha se incrementó
  if (rachaIncrementada) {
    const { mostrarNotificacionRacha } = await import('../../utils.js');
    mostrarNotificacionRacha(rachaAnterior, progreso.rachaGeneral);
  }

  // Verificar y programar notificación de racha
  await verificarYProgramarNotificacion();  

  // Actualizar UI de racha en menú principal
  const { domElements } = await import('../../../../config/config.js');
  if (domElements.main.rachaMain) {
    domElements.main.rachaMain.textContent = `🔥 ${progreso.rachaGeneral} días`;
  }
  if (domElements.poketype.rachaTexto) {
    domElements.poketype.rachaTexto.textContent = `🔥 ${progreso.rachaGeneral} días`;
  }

  return progreso;
}

// Determina qué mecánica de juego corresponde al Desafío del Día,
// según la racha ACTUAL del jugador.
export function obtenerMecanicaSegunRacha(racha) {
  return 'campista';
}

// Indica si el jugador YA aprobó el Desafío del Día de hoy
export async function yaCompletoDesafioHoy() {
  const progreso = await obtenerProgreso();
  return progreso.ultimoDiaDesafioCompletado === obtenerFechaDeHoy();
}

// Programar notificación local para advertir sobre racha en peligro
// Se programa para las 6pm (2 horas antes de 8pm)
export async function programarNotificacionRacha() {
  if (!Capacitor.isPluginAvailable('LocalNotifications')) {
    console.warn('LocalNotifications no disponible');
    return;
  }

  try {
    // Calcular hora de 6pm hoy
    const hoy = new Date();
    hoy.setHours(18, 0, 0, 0);

    // Si ya pasó 6pm hoy, programar para mañana 6pm
    const ahora = new Date();
    if (ahora >= hoy) {
      hoy.setDate(hoy.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: '¡Tu racha está en peligro!',
          body: 'Juega antes de las 8pm para mantener tu racha 🔥',
          schedule: { at: hoy },
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          largeIcon: 'ic_stat_icon_config_sample',
        }
      ]
    });

    console.log('Notificación de racha programada para:', hoy);
  } catch (error) {
    console.error('Error programando notificación de racha:', error);
  }
}

// Cancelar notificación programada de racha
export async function cancelarNotificacionRacha() {
  if (!Capacitor.isPluginAvailable('LocalNotifications')) {
    return;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    console.log('Notificación de racha cancelada');
  } catch (error) {
    console.error('Error cancelando notificación de racha:', error);
  }
}

// Verificar si se necesita programar notificación de racha
// Se llama después de cada actividad registrada
export async function verificarYProgramarNotificacion() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();
  const ayer = obtenerFechaDeAyer();

  // Si hubo actividad hoy, cancelar notificación
  if (progreso.ultimaActividadFecha === hoy) {
    await cancelarNotificacionRacha();
    return;
  }

  // Si la última actividad fue ayer, verificar si necesita programar notificación
  if (progreso.ultimaActividadFecha === ayer) {
    // Programar notificación para 6pm
    await programarNotificacionRacha();
  } else {
    // No hubo actividad ayer ni hoy, cancelar cualquier notificación
    await cancelarNotificacionRacha();
  }
}