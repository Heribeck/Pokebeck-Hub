// Filtra la Pokedex por generación, según el campo "filtroGeneracion" que
// definimos en ligas-datos.js ('gen-1', 'gen-1-3', 'gen-4-5', 'gen-6-9', 'todas').
// Excluye formas/variantes especiales (ID >= 10000) por defecto — esas se
// reservan para los niveles de "Formas y Variantes" en Liga Campeón, que
// usan una función distinta (elegirPokemonConPrioridadFormas).

const LIMITE_ID_FORMAS_ESPECIALES = 10000;

// Rangos aproximados de ID de Pokedex Nacional por generación
const RANGOS_POR_GENERACION = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

// Traduce el string de filtro (ej. "gen-1-3") al rango de IDs [min, max].
// Devuelve null si el filtro es "todas" (sin restricción de generación).
function obtenerRangoIds(filtroGeneracion) {
  const mapa = {
    'gen-1': [RANGOS_POR_GENERACION[1][0], RANGOS_POR_GENERACION[1][1]],
    'gen-1-3': [RANGOS_POR_GENERACION[1][0], RANGOS_POR_GENERACION[3][1]],
    'gen-4-5': [RANGOS_POR_GENERACION[4][0], RANGOS_POR_GENERACION[5][1]],
    'gen-4-6': [RANGOS_POR_GENERACION[4][0], RANGOS_POR_GENERACION[6][1]],
    'gen-6-9': [RANGOS_POR_GENERACION[6][0], RANGOS_POR_GENERACION[9][1]],
    'gen-7-9': [RANGOS_POR_GENERACION[7][0], RANGOS_POR_GENERACION[9][1]],
    'todas': null,
  };

  return mapa[filtroGeneracion] ?? null;
}

// Filtra el pool de Pokémon según el filtro de generación del nivel.
// Excluye formas especiales (ID >= 10000) salvo que se indique lo contrario.
export function filtrarPokedexPorGeneracionEstudio(pokedex, filtroGeneracion, incluirFormas = false) {
  const rango = obtenerRangoIds(filtroGeneracion);

  return pokedex.filter(p => {
    const esForma = p.id >= LIMITE_ID_FORMAS_ESPECIALES;
    if (esForma && !incluirFormas) return false;

    if (rango === null) return true; // "todas", sin restricción de generación
    return p.id >= rango[0] && p.id <= rango[1];
  });
}