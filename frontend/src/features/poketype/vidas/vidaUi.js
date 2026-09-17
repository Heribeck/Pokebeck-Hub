// Actualiza el indicador visual de vidas generales (corazones) en el panel PokeType.
// Se llama al abrir la app, al terminar un intento de nivel, y al recuperar
// una vida por anuncio.
import { corazon1Poketype, corazon2Poketype, corazon3Poketype } from '../../../config/config.js';
import { obtenerVidasGenerales } from './vidasGeneralesStorage.js';

export async function actualizarIndicadorVidas() {
  const vidas = await obtenerVidasGenerales();
  const corazones = [corazon1Poketype, corazon2Poketype, corazon3Poketype];

  corazones.forEach((elemento, indice) => {
    elemento.textContent = indice < vidas ? '❤️' : '🖤';
  });

  return vidas;
}