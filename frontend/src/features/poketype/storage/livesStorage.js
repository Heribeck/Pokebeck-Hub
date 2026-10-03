import { Preferences } from '@capacitor/preferences';
import { PLAYER_LIVES_KEY } from '../../../config/index.js';
const VIDAS_MAXIMAS = 3;

export async function leerEstadoVidas() {
  const resultado = await Preferences.get({ key: PLAYER_LIVES_KEY });
  if (!resultado.value) {
    return { vidas: VIDAS_MAXIMAS, ultimaActualizacion: Date.now() };
  }

  return JSON.parse(resultado.value);
}

export async function guardarEstadoVidas(estado) {
  await Preferences.set({ key: PLAYER_LIVES_KEY, value: JSON.stringify(estado) });
}
