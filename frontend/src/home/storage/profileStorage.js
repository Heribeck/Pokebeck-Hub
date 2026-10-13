import { Preferences } from '@capacitor/preferences';

import { PLAYER_NAME_KEY } from '../../shared/storage/index.js';

const NOMBRE_POR_DEFECTO = 'PokebeckPlayer';

export async function leerNombrePerfil() {
  const resultado = await Preferences.get({ key: PLAYER_NAME_KEY });
  if (!resultado.value) {
    return NOMBRE_POR_DEFECTO;
  }
  return resultado.value;
}

export async function guardarNombrePerfil(nombre) {
  await Preferences.set({ key: PLAYER_NAME_KEY, value: nombre });
}