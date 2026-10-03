const THREE_GENERATION_ID_LIMIT = 386;
const SPECIAL_FORM_ID_LIMIT = 10000;

export function filterPokedexByDifficulty(pokedex, modo) {
  if (modo === 'facil') {
    return pokedex.filter(p => p.id <= THREE_GENERATION_ID_LIMIT);
  }

  if (modo === 'normal') {
    return pokedex.filter(p => p.id < SPECIAL_FORM_ID_LIMIT);
  }

  return pokedex;
}
