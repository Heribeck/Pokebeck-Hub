// Guarda las vidas generales del jugador para el Modo Estudio. Máximo 3,
// se regeneran +1 cada 12 horas automáticamente, o se pueden recuperar
// viendo un anuncio bonificado (tope siempre en 3).
const PreferencesNativo = window.Capacitor?.Plugins?.Preferences;

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};

if (!PreferencesNativo) {
  console.warn('Preferences no disponible, usando localStorage como respaldo para vidas generales.');
}

const Preferences = PreferencesNativo || PreferencesLocalStorage;
const CLAVE_VIDAS = 'pokebeck_vidas_generales';

const VIDAS_MAXIMAS = 3;
const HORAS_POR_REGENERACION = 12;
const MS_POR_REGENERACION = HORAS_POR_REGENERACION * 60 * 60 * 1000;

function estadoPorDefecto() {
  return {
    vidas: VIDAS_MAXIMAS, // empieza con las 3 llenas
    ultimaActualizacion: Date.now(),
  };
}

async function leerEstadoCrudo() {
  try {
    const resultado = await Preferences.get({ key: CLAVE_VIDAS });
    if (!resultado || !resultado.value) return estadoPorDefecto();
    return JSON.parse(resultado.value);
  } catch (error) {
    console.error('Error leyendo vidas generales:', error);
    return estadoPorDefecto();
  }
}

async function guardarEstado(estado) {
  try {
    await Preferences.set({ key: CLAVE_VIDAS, value: JSON.stringify(estado) });
  } catch (error) {
    console.error('Error guardando vidas generales:', error);
  }
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
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: Date.now() };

  await guardarEstado(nuevoEstado);
  return nuevasVidas;
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

// Se llama cuando el jugador ve el anuncio bonificado de rescate
export async function restaurarVidaPorAnuncio() {
  const estadoCrudo = await leerEstadoCrudo();
  const estadoActualizado = aplicarRegeneracion(estadoCrudo);

  const nuevasVidas = Math.min(VIDAS_MAXIMAS, estadoActualizado.vidas + 1);
  const nuevoEstado = { vidas: nuevasVidas, ultimaActualizacion: Date.now() };

  await guardarEstado(nuevoEstado);
  return nuevasVidas;
}