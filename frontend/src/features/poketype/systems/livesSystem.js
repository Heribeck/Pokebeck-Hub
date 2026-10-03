import { guardarEstadoVidas, leerEstadoVidas } from '../storage/livesStorage.js';
import {
  cancelNotification,
  NOTIFICATION_IDS,
  scheduleNotification,
} from '../../../shared/notifications/index.js';

const VIDAS_MAXIMAS = 3;
const HORAS_POR_REGENERACION = 1;
const MS_POR_REGENERACION = HORAS_POR_REGENERACION * 60 * 60 * 1000;

function estadoPorDefecto() {
  return {
    vidas: VIDAS_MAXIMAS, 
    ultimaActualizacion: Date.now(),
  };
}

function aplicarRegeneracion(estado, ahora = Date.now()) {
  if (estado.vidas >= VIDAS_MAXIMAS) {
    return { vidas: VIDAS_MAXIMAS, ultimaActualizacion: ahora };
  }

  const msTranscurridos = ahora - estado.ultimaActualizacion;
  const regeneracionesGanadas = Math.floor(msTranscurridos / MS_POR_REGENERACION);

  if (regeneracionesGanadas <= 0) {
    return estado;
  }

  const nuevasVidas = Math.min(VIDAS_MAXIMAS, estado.vidas + regeneracionesGanadas);

  const nuevaMarcaDeTiempo = nuevasVidas >= VIDAS_MAXIMAS
    ? ahora
    : estado.ultimaActualizacion + regeneracionesGanadas * MS_POR_REGENERACION;

  return { vidas: nuevasVidas, ultimaActualizacion: nuevaMarcaDeTiempo };
}

async function sincronizarNotificacionVidas(estado) {
  if (estado.vidas >= VIDAS_MAXIMAS) {
    await cancelNotification(NOTIFICATION_IDS.VIDAS_COMPLETAS);
    return;
  }

  const regeneracionesRestantes = VIDAS_MAXIMAS - estado.vidas;
  const notificacionEn = new Date(
    estado.ultimaActualizacion + regeneracionesRestantes * MS_POR_REGENERACION,
  );

  await scheduleNotification({
    id: NOTIFICATION_IDS.VIDAS_COMPLETAS,
    title: 'Tus vidas están completas',
    body: 'Vuelve a Poketype y continúa jugando.',
    at: notificacionEn,
  });
}

export async function obtenerVidasGenerales() {
  const estadoCrudo = await leerEstadoVidas();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  if (estadoActualizado !== estadoCrudo) {
    await guardarEstadoVidas(estadoActualizado);
  }

  await sincronizarNotificacionVidas(estadoActualizado);
  return estadoActualizado.vidas;
}

export async function restarVidaGeneral() {
  const estadoCrudo = await leerEstadoVidas();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  const nuevasVidas = Math.max(0, estadoActualizado.vidas - 1);
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: estadoActualizado.ultimaActualizacion };

  await guardarEstadoVidas(nuevoEstado);
  await sincronizarNotificacionVidas(nuevoEstado);
  return nuevasVidas;
}

export async function restaurarVidaPorAnuncio() {
  const estadoCrudo = await leerEstadoVidas();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  const nuevasVidas = Math.min(VIDAS_MAXIMAS, estadoActualizado.vidas + 1);
  const nuevaMarcaDeTiempo = nuevasVidas >= VIDAS_MAXIMAS
    ? Date.now()
    : estadoActualizado.ultimaActualizacion;
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: nuevaMarcaDeTiempo };

  await guardarEstadoVidas(nuevoEstado);
  await sincronizarNotificacionVidas(nuevoEstado);
  return nuevasVidas;
}

export async function obtenerTiempoParaProximaRegeneracion() {
  const estadoCrudo = await leerEstadoVidas();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  if (estadoActualizado !== estadoCrudo) {
    await guardarEstadoVidas(estadoActualizado);
  }

  await sincronizarNotificacionVidas(estadoActualizado);

  if (estadoActualizado.vidas >= VIDAS_MAXIMAS) {
    return null; 
  }

  const proximaRegeneracion = estadoActualizado.ultimaActualizacion + MS_POR_REGENERACION;
  const msRestantes = proximaRegeneracion - Date.now();

  return Math.max(0, msRestantes);
}