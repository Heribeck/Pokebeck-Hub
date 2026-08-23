// Filtra la Pokedex por generación y filtro especial, según los campos
// "filtroGeneracion" y "filtroEspecial" que definimos en ligas-datos.js.
// Excluye formas/variantes especiales (ID >= 10000) por defecto cuando
// filtroEspecial es null.

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

// Funciones auxiliares de clasificación (case-insensitive)
function esMega(pokemon) {
  return pokemon.name.toLowerCase().startsWith('mega ');
}

function esRegional(pokemon) {
  const nombre = pokemon.name.toLowerCase();
  const regiones = ['alola', 'galar', 'hisui', 'paldea'];
  return regiones.some(region => nombre.endsWith(region));
}

function esVariante(pokemon) {
  return pokemon.name.includes('-') && !esMega(pokemon) && !esRegional(pokemon);
}

// Filtra el pool de Pokémon según el filtro de generación y filtro especial del nivel.
export function filtrarPokedexPorGeneracionEstudio(pokedex, filtroGeneracion, filtroEspecial = null) {
  const rango = obtenerRangoIds(filtroGeneracion);

  return pokedex.filter(p => {
    const esForma = p.id >= LIMITE_ID_FORMAS_ESPECIALES;
    
    // Lógica según filtroEspecial
    switch (filtroEspecial) {
      case null:
        // Comportamiento actual: excluir formas especiales
        if (esForma) return false;
        // Filtro por generación para pokemones normales
        if (rango !== null && (p.id < rango[0] || p.id > rango[1])) return false;
        return true;
      
      case 'solo-regionales':
        // Solo formas especiales que sean regionales (sin filtro de generación)
        return esForma && esRegional(p);
      
      case 'solo-megas':
        // Solo formas especiales que sean megas (sin filtro de generación)
        return esForma && esMega(p);
      
      case 'solo-variantes':
        // Solo formas especiales que sean variantes (sin filtro de generación)
        return esForma && esVariante(p);
      
      case 'regionales-variantes':
        // Solo formas especiales que sean regionales o variantes (sin filtro de generación, excluye megas)
        return esForma && (esRegional(p) || esVariante(p));
      
      case 'absoluto':
        // Todos los pokemones normales dentro del filtroGeneracion + TODAS las formas especiales
        const enRangoBase = rango === null || (p.id >= rango[0] && p.id <= rango[1]);
        return enRangoBase || esForma;
      
      default:
        // Si filtroEspecial no es reconocido, comportarse como null
        if (esForma) return false;
        if (rango !== null && (p.id < rango[0] || p.id > rango[1])) return false;
        return true;
    }
  });
}