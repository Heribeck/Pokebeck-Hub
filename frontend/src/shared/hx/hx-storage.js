
import { HX_INICIAL } from './hx-sistema.js';
import { Preferences } from '@capacitor/preferences';
import { executePluginSafely } from '../capacitor/executePluginSafely.js';

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
  return await executePluginSafely(
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

  await executePluginSafely(
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

