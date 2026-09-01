// Módulo encargado de guardar y leer el HX (Hexium) del jugador.
// Mismo patrón que progreso-storage.js: Preferences nativo con respaldo a localStorage.
import { HX_INICIAL } from './hx-sistema.js';
import { Preferences } from '@capacitor/preferences';
import { ejecutarPluginSeguro } from './utils.js';

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};
const CLAVE_HX = 'pokebeck_hx_v2';

// Devuelve el HX actual del jugador (700 si nunca ha jugado el modo Reto)
export async function obtenerHX() {
  return await ejecutarPluginSeguro(
    'Preferences',
    async () => {
      const resultado = await Preferences.get({ key: CLAVE_HX });
      if (!resultado || resultado.value === null || resultado.value === undefined) {
        return HX_INICIAL;
      }
      return Number(resultado.value);
    },
    async () => {
      const valor = localStorage.getItem(CLAVE_HX);
      if (valor === null || valor === undefined) {
        return HX_INICIAL;
      }
      return Number(valor);
    }
  );
}

// Suma HX al total actual y guarda el nuevo valor. Devuelve el HX resultante.
export async function sumarHX(cantidad) {
  const hxActual = await obtenerHX();
  const nuevoHX = hxActual + cantidad;

  await ejecutarPluginSeguro(
    'Preferences',
    async () => {
      await Preferences.set({ key: CLAVE_HX, value: String(nuevoHX) });
    },
    async () => {
      localStorage.setItem(CLAVE_HX, String(nuevoHX));
    }
  );

  return nuevoHX;
}

// Actualiza todos los elementos HX en la UI con el valor proporcionado
export async function actualizarTodosLosHX(valor) {
  const { domElements } = await import('./config.js');

  // Actualizar HX en menú principal
  if (domElements.main.hxGlobalMain) {
    domElements.main.hxGlobalMain.textContent = `⚡ ${valor} HX`;
  }

  // Actualizar HX en panel poketype
  if (domElements.poketype.hxGlobal) {
    domElements.poketype.hxGlobal.textContent = `⚡ ${valor} HX`;
  }
}