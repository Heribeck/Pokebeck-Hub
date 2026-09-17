// Adaptador entre ligas-datos.js (datos) y nivel-motor.js (motor de juego).
// Ya NO duplica hxRequerido/hxRecompensa/rondas/etc. — todo eso vive en
// ligas-datos.js. Este archivo solo mapea cada nivelId con su función
// generadora de rondas, y arma la configuración que el motor necesita.

import { datosLigas } from './ligas-datos.js';
import { generarColaRondasCampista1 } from './Liga-Campista/campista-1.js';
import { generarColaRondasCampista2 } from './Liga-Campista/campista-2.js';
import { generarColaRondasCampista3 } from './Liga-Campista/campista-3.js';
import { generarColaRondasCampista4 } from './Liga-Campista/campista-4.js';
import { generarColaRondasCampista5 } from './Liga-Campista/campista-5.js';
import { generarColaRondasCampista6 } from './Liga-Campista/campista-6.js';
import { generarColaRondasCampista7 } from './Liga-Campista/campista-7.js';
import { generarColaRondasCampista8 } from './Liga-Campista/campista-8.js';
import { generarColaRondasCampista9 } from './Liga-Campista/campista-9.js';
import { generarColaRondasAs1 } from './Liga-As/as-1.js';
import { generarColaRondasAs2 } from './Liga-As/as-2.js';
import { generarColaRondasAs3 } from './Liga-As/as-3.js';
import { generarColaRondasAs4 } from './Liga-As/as-4.js';
import { generarColaRondasAs5 } from './Liga-As/as-5.js';
import { generarColaRondasAs6 } from './Liga-As/as-6.js';
import { generarColaRondasAs7 } from './Liga-As/as-7.js';
import { generarColaRondasAs8 } from './Liga-As/as-8.js';
import { generarColaRondasAs9 } from './Liga-As/as-9.js';
import { generarColaRondasAs10 } from './Liga-As/as-10.js';
import { generarColaRondasAs11 } from './Liga-As/as-11.js';
import { generarColaRondasAs12 } from './Liga-As/as-12.js';
import { generarColaRondasAs13 } from './Liga-As/as-13.js';
import { generarColaRondasAs14 } from './Liga-As/as-14.js';
import { generarColaRondasCampeon1 } from './Liga-Campeon/campeon-1.js';
import { generarColaRondasCampeon2 } from './Liga-Campeon/campeon-2.js';
import { generarColaRondasCampeon3 } from './Liga-Campeon/campeon-3.js';
import { generarColaRondasCampeon4 } from './Liga-Campeon/campeon-4.js';
import { generarColaRondasCampeon5 } from './Liga-Campeon/campeon-5.js';
import { generarColaRondasCampeon6 } from './Liga-Campeon/campeon-6.js';
import { generarColaRondasCampeon7 } from './Liga-Campeon/campeon-7.js';
import { generarColaRondasCampeon8 } from './Liga-Campeon/campeon-8.js';
import { generarColaRondasCampeon9 } from './Liga-Campeon/campeon-9.js';
import { generarColaRondasCampeon10 } from './Liga-Campeon/campeon-10.js';
import { generarColaRondasCampeon11 } from './Liga-Campeon/campeon-11.js';
import { generarColaRondasCampeon12 } from './Liga-Campeon/campeon-12.js';
import { generarColaRondasCampeon13 } from './Liga-Campeon/campeon-13.js';
import { dataState } from '../../../../config/config.js';
import { generarColaRondasCampeon14 } from './Liga-Campeon/campeon-14.js';
import { generarColaRondasCampeon15 } from './Liga-Campeon/campeon-15.js';
import { generarColaRondasCampeon16 } from './Liga-Campeon/campeon-16.js';
import { generarColaRondasCampeon17 } from './Liga-Campeon/campeon-17.js';
import { generarColaRondasCampeon18 } from './Liga-Campeon/campeon-18.js';

// Mapa de funciones generadoras de rondas, una por cada "receta" ya implementada.
// Los niveles que no aparecen aquí todavía muestran "en construcción" en el juego.
const generadoresDeRondas = {
  //Liga Campista
  'campista-1': generarColaRondasCampista1,
  'campista-2': generarColaRondasCampista2,
  'campista-3': generarColaRondasCampista3,
  'campista-4': generarColaRondasCampista4,
  'campista-5': generarColaRondasCampista5,
  'campista-6': generarColaRondasCampista6,
  'campista-7': generarColaRondasCampista7,
  'campista-8': generarColaRondasCampista8,
  'campista-9': generarColaRondasCampista9,
  //Liga As
  'as-1': generarColaRondasAs1,
  'as-2': generarColaRondasAs2,
  'as-3': generarColaRondasAs3,
  'as-4': generarColaRondasAs4,
  'as-5': generarColaRondasAs5,
  'as-6': generarColaRondasAs6,
  'as-7': generarColaRondasAs7,
  'as-8': generarColaRondasAs8,
  'as-9': generarColaRondasAs9,
  'as-10': generarColaRondasAs10,
  'as-11': generarColaRondasAs11,
  'as-12': generarColaRondasAs12,
  'as-13': generarColaRondasAs13,
  'as-14': generarColaRondasAs14,
  //Liga Campeon
  'campeon-1': generarColaRondasCampeon1,
  'campeon-2': generarColaRondasCampeon2,
  'campeon-3': generarColaRondasCampeon3,
  'campeon-4': generarColaRondasCampeon4,
  'campeon-5': generarColaRondasCampeon5,
  'campeon-6': generarColaRondasCampeon6,
  'campeon-7': generarColaRondasCampeon7,
  'campeon-8': generarColaRondasCampeon8,
  'campeon-9': generarColaRondasCampeon9,
  'campeon-10': generarColaRondasCampeon10,
  'campeon-11': generarColaRondasCampeon11,
  'campeon-12': generarColaRondasCampeon12,
  'campeon-13': (generador) => generarColaRondasCampeon13(dataState.pokedex, generador),
  'campeon-14': generarColaRondasCampeon14,
  'campeon-15': (generador) => generarColaRondasCampeon15(dataState.pokedex,generador),
  'campeon-16': (generador) => generarColaRondasCampeon16(dataState.pokedex,generador),
  'campeon-17': (generador) => generarColaRondasCampeon17(dataState.pokedex,generador),
  'campeon-18': (generador) => generarColaRondasCampeon18(dataState.pokedex,generador),
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
    filtroGeneracion: datosNivel.filtroGeneracion,
    filtroEspecial: datosNivel.filtroEspecial,
    tiempo: datosNivel.tiempo,
    tiempoDinamico: datosNivel.tiempoDinamico,
    repeticion: datosNivel.repeticion, 
    generarColaRondas,
  };
}

// Lista ordenada de IDs por liga (para saber si una liga se completó por entero)
export const nivelesPorLiga = Object.fromEntries(
  Object.entries(datosLigas).map(([ligaKey, liga]) => [ligaKey, liga.niveles.map(n => n.id)])
);