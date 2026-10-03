import { Preferences } from '@capacitor/preferences';
import { HX_KEY } from '../../../config/index.js';
const HX_INICIAL = 300;

export async function obtenerHX() {
  const resultado = await Preferences.get({ key: HX_KEY });
  if (!resultado || resultado.value === null || resultado.value === undefined) {
    return HX_INICIAL;
  }
  return Number(resultado.value);
}

// Suma HX al total actual y guarda el nuevo valor. Devuelve el HX resultante.
export async function sumarHX(cantidad) {
  const hxActual = await obtenerHX();
  const nuevoHX = hxActual + cantidad;

  await Preferences.set({ key: HX_KEY, value: String(nuevoHX) });

  return nuevoHX;
}
