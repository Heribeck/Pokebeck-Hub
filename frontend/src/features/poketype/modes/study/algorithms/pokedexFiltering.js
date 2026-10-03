const SPECIAL_FORM_ID_LIMIT = 10000;

const GENERATION_ID_RANGES = {
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

function getGenerationIdRange(filtroGeneracion) {
  const mapa = {
    'gen-1': [GENERATION_ID_RANGES[1][0], GENERATION_ID_RANGES[1][1]],
    'gen-1-3': [GENERATION_ID_RANGES[1][0], GENERATION_ID_RANGES[3][1]],
    'gen-4-5': [GENERATION_ID_RANGES[4][0], GENERATION_ID_RANGES[5][1]],
    'gen-4-6': [GENERATION_ID_RANGES[4][0], GENERATION_ID_RANGES[6][1]],
    'gen-6-9': [GENERATION_ID_RANGES[6][0], GENERATION_ID_RANGES[9][1]],
    'gen-7-9': [GENERATION_ID_RANGES[7][0], GENERATION_ID_RANGES[9][1]],
    'todas': null,
  };

  return mapa[filtroGeneracion] ?? null;
}

function isMega(pokemon) {
  return pokemon.name.toLowerCase().startsWith('mega ');
}

function isRegional(pokemon) {
  const nombre = pokemon.name.toLowerCase();
  const regiones = ['alola', 'galar', 'hisui', 'paldea'];
  return regiones.some(region => nombre.endsWith(region));
}

function isVariant(pokemon) {
  return pokemon.name.includes('-') && !isMega(pokemon) && !isRegional(pokemon);
}

export function filterPokedexByGeneration(pokedex, filtroGeneracion, filtroEspecial = null) {
  const rango = getGenerationIdRange(filtroGeneracion);

  return pokedex.filter(p => {
    const esForma = p.id >= SPECIAL_FORM_ID_LIMIT;
    
    switch (filtroEspecial) {
      case null:
        if (esForma) return false;
        if (rango !== null && (p.id < rango[0] || p.id > rango[1])) return false;
        return true;
      
      case 'solo-regionales':
        return esForma && isRegional(p);
      
      case 'solo-megas':
        return esForma && isMega(p);
      
      case 'solo-variantes':
        return esForma && isVariant(p);
      
      case 'regionales-variantes':
        return esForma && (isRegional(p) || isVariant(p));
      
      case 'absoluto':
        const enRangoBase = rango === null || (p.id >= rango[0] && p.id <= rango[1]);
        return enRangoBase || esForma;
      
      default:
        if (esForma) return false;
        if (rango !== null && (p.id < rango[0] || p.id > rango[1])) return false;
        return true;
    }
  });
}