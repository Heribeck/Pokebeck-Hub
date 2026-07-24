// Módulo encargado de guardar y leer el HX (Hexium) del jugador.
// Mismo patrón que progreso-storage.js: Preferences nativo con respaldo a localStorage.
import { HX_INICIAL } from './hx-sistema.js';

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
  console.warn('Preferences no disponible, usando localStorage como respaldo para HX.');
}

const Preferences = PreferencesNativo || PreferencesLocalStorage;
const CLAVE_HX = 'pokebeck_hx';

// Devuelve el HX actual del jugador (700 si nunca ha jugado el modo Reto)
export async function obtenerHX() {
  try {
    const resultado = await Preferences.get({ key: CLAVE_HX });
    if (!resultado || resultado.value === null || resultado.value === undefined) {
      return HX_INICIAL;
    }
    return Number(resultado.value);
  } catch (error) {
    console.error('Error leyendo el HX guardado:', error);
    return HX_INICIAL;
  }
}

// Suma HX al total actual y guarda el nuevo valor. Devuelve el HX resultante.
export async function sumarHX(cantidad) {
  const hxActual = await obtenerHX();
  const nuevoHX = hxActual + cantidad;

  try {
    await Preferences.set({ key: CLAVE_HX, value: String(nuevoHX) });
  } catch (error) {
    console.error('Error guardando el HX:', error);
  }

  return nuevoHX;
}