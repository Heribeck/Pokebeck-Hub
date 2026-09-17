// viendo un anuncio bonificado (tope siempre en 3).
import { Preferences } from '@capacitor/preferences';
import { executePluginSafely } from '../../../shared/capacitor/executePluginSafely';

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};
const CLAVE_VIDAS = 'pokebeck_vidas_generales';

const VIDAS_MAXIMAS = 3;
const HORAS_POR_REGENERACION = 1;
const MS_POR_REGENERACION = HORAS_POR_REGENERACION * 60 * 60 * 1000;

function estadoPorDefecto() {
  return {
    vidas: VIDAS_MAXIMAS, // empieza con las 3 llenas
    ultimaActualizacion: Date.now(),
  };
}

async function leerEstadoCrudo() {
  return await executePluginSafely(
    'Preferences',
    async () => {
      const resultado = await Preferences.get({ key: CLAVE_VIDAS });
      if (!resultado || !resultado.value) return estadoPorDefecto();
      return JSON.parse(resultado.value);
    },
    async () => {
      const valor = localStorage.getItem(CLAVE_VIDAS);
      if (!valor) return estadoPorDefecto();
      return JSON.parse(valor);
    }
  );
}

async function guardarEstado(estado) {
  await executePluginSafely(
    'Preferences',
    async () => {
      await Preferences.set({ key: CLAVE_VIDAS, value: JSON.stringify(estado) });
    },
    async () => {
      localStorage.setItem(CLAVE_VIDAS, JSON.stringify(estado));
    }
  );
}

// Calcula cuántas vidas debería tener AHORA, aplicando la regeneración
// natural transcurrida desde la última vez que se guardó el estado.
function aplicarRegeneracion(estado, ahora = Date.now()) {
  if (estado.vidas >= VIDAS_MAXIMAS) {
    return { vidas: VIDAS_MAXIMAS, ultimaActualizacion: ahora };
  }

  const msTranscurridos = ahora - estado.ultimaActualizacion;
  const regeneracionesGanadas = Math.floor(msTranscurridos / MS_POR_REGENERACION);

  if (regeneracionesGanadas <= 0) {
    return estado; // no ha pasado suficiente tiempo todavía
  }

  const nuevasVidas = Math.min(VIDAS_MAXIMAS, estado.vidas + regeneracionesGanadas);

  // Si llegó al máximo, no hace falta seguir acumulando tiempo "sobrante"
  const nuevaMarcaDeTiempo = nuevasVidas >= VIDAS_MAXIMAS
    ? ahora
    : estado.ultimaActualizacion + regeneracionesGanadas * MS_POR_REGENERACION;

  return { vidas: nuevasVidas, ultimaActualizacion: nuevaMarcaDeTiempo };
}

// Devuelve cuántas vidas generales tiene AHORA (ya aplicando la regeneración
// pendiente, y guardando el resultado actualizado)
export async function obtenerVidasGenerales() {
  const estadoCrudo = await leerEstadoCrudo();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  if (estadoActualizado !== estadoCrudo) {
    await guardarEstado(estadoActualizado);
  }

  return estadoActualizado.vidas;
}

// Se llama al fallar por completo un intento de nivel (agotar corazones)
export async function restarVidaGeneral() {
  const estadoCrudo = await leerEstadoCrudo();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  const nuevasVidas = Math.max(0, estadoActualizado.vidas - 1);
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: estadoActualizado.ultimaActualizacion };

  await guardarEstado(nuevoEstado);
  return nuevasVidas;
}

// Se llama cuando el jugador ve el anuncio bonificado de rescate
export async function restaurarVidaPorAnuncio() {
  const estadoCrudo = await leerEstadoCrudo();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  const nuevasVidas = Math.min(VIDAS_MAXIMAS, estadoActualizado.vidas + 1);
  // Si no está en el máximo, mantener el tiempo existente para no reiniciar la regeneración
  // Si está en el máximo, actualizar el tiempo para evitar cálculos innecesarios
  const nuevaMarcaDeTiempo = nuevasVidas >= VIDAS_MAXIMAS
    ? Date.now()
    : estadoActualizado.ultimaActualizacion;
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: nuevaMarcaDeTiempo };

  await guardarEstado(nuevoEstado);
  return nuevasVidas;
}

// Actualiza visualmente los corazones en la UI
export function actualizarCorazonesUI(vidas) {
  const corazon1 = document.getElementById('corazon-1-poketype');
  const corazon2 = document.getElementById('corazon-2-poketype');
  const corazon3 = document.getElementById('corazon-3-poketype');

  if (!corazon1 || !corazon2 || !corazon3) return;

  const corazones = [corazon1, corazon2, corazon3];
  corazones.forEach((corazon, index) => {
    corazon.textContent = index < vidas ? '❤️' : '🖤';
  });
}

// Formatea milisegundos a formato legible (ej: "11h 30m" o "45m 30s")
function formatearTiempoRestante(ms) {
  if (ms <= 0) return '';

  const horas = Math.floor(ms / (1000 * 60 * 60));
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((ms % (1000 * 60)) / 1000);

  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else if (minutos > 0) {
    return `${minutos}m ${segundos}s`;
  } else {
    return `${segundos}s`;
  }
}

// Devuelve cuántos milisegundos faltan para la PRÓXIMA regeneración natural.
// Si ya está en el máximo (3 vidas), devuelve null (no hay nada que esperar).
export async function obtenerTiempoParaProximaRegeneracion() {
  const estadoCrudo = await leerEstadoCrudo();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  // Si el estado cambió (hubo regeneración pendiente), lo guardamos primero
  if (estadoActualizado !== estadoCrudo) {
    await guardarEstado(estadoActualizado);
  }

  if (estadoActualizado.vidas >= VIDAS_MAXIMAS) {
    return null; // ya está lleno, no hay cuenta regresiva que mostrar
  }

  const proximaRegeneracion = estadoActualizado.ultimaActualizacion + MS_POR_REGENERACION;
  const msRestantes = proximaRegeneracion - Date.now();

  return Math.max(0, msRestantes);
}

// Actualiza visualmente el tiempo de regeneración en la UI
export async function actualizarTiempoRegeneracionUI() {
  const tiempoRegeneracionEl = document.getElementById('tiempo-regeneracion-poketype');
  if (!tiempoRegeneracionEl) return;

  const msRestantes = await obtenerTiempoParaProximaRegeneracion();

  if (msRestantes === null) {
    tiempoRegeneracionEl.textContent = '';
    return;
  }

  tiempoRegeneracionEl.textContent = formatearTiempoRestante(msRestantes);
}

// Inicia el contador periódico para actualizar el tiempo de regeneración
let intervaloRegeneracion = null;

export function iniciarContadorRegeneracion() {
  if (intervaloRegeneracion) {
    clearInterval(intervaloRegeneracion);
  }

  actualizarTiempoRegeneracionUI();
  intervaloRegeneracion = setInterval(actualizarTiempoRegeneracionUI, 1000);
}

export function detenerContadorRegeneracion() {
  if (intervaloRegeneracion) {
    clearInterval(intervaloRegeneracion);
    intervaloRegeneracion = null;
  }
}   