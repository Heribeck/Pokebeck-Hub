// Adaptador entre ligas-datos.js (datos) y nivel-motor.js (motor de juego).
// Ya NO duplica hxRequerido/hxRecompensa/rondas/etc. — todo eso vive en
// ligas-datos.js. Este archivo solo mapea cada nivelId con su función
// generadora de rondas, y arma la configuración que el motor necesita.

import { datosLigas } from './ligas-datos.js';
import { generarColaRondasNivel1 } from './Liga-Campista/campista-1.js';

// Mapa de funciones generadoras de rondas, una por cada "receta" ya implementada.
// Los niveles que no aparecen aquí todavía muestran "en construcción" en el juego.
const generadoresDeRondas = {
  'campista-1': generarColaRondasNivel1,
};

// Busca los datos de un nivel específico dentro de las 3 ligas
function buscarNivelEnLigas(nivelId) {
  for (const ligaKey of Object.keys(datosLigas)) {
    const nivel = datosLigas[ligaKey].niveles.find(n => n.id === nivelId);
    if (nivel) return { ...nivel, liga: ligaKey };
  }
  return null;
}

// Devuelve la configuración completa que necesita nivel-motor.js/estudio.js
// para un nivel específico. Devuelve null si el nivel no existe o si todavía
// no tiene su función generadora de rondas implementada.
export function obtenerConfiguracionNivel(nivelId) {
  const datosNivel = buscarNivelEnLigas(nivelId);
  const generarColaRondas = generadoresDeRondas[nivelId];

  if (!datosNivel || !generarColaRondas) return null;

  return {
    liga: datosNivel.liga,
    hxRequerido: datosNivel.hxRequerido,
    hxRecompensa: datosNivel.hxRecompensa,
    totalRondas: datosNivel.rondas,
    corazonesPorError: datosNivel.corazonesError,
    requierePuntuacionPerfecta: datosNivel.requierePerfeccion,
    generarColaRondas,
  };
}

// Lista ordenada de IDs por liga (para saber si una liga se completó por entero)
export const nivelesPorLiga = Object.fromEntries(
  Object.entries(datosLigas).map(([ligaKey, liga]) => [ligaKey, liga.niveles.map(n => n.id)])
);