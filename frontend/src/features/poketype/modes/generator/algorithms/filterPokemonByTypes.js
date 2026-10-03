import { dataState } from "../../../../../home/index.js";

export function filterPokemonByType(type1, type2) {
  return dataState.pokedex.filter((pokemon) => {
    const types = pokemon.types || [];
    const hasFirstType = types.includes(type1);
    const hasSecondType = types.includes(type2);

    if (type1 === type2) return hasFirstType;
    return hasFirstType !== hasSecondType;
  });
}