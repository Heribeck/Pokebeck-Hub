export function validatePokemonTypes(pokemon, type1, type2) {
  let tiposPokemon;
  
  if (pokemon.types && Array.isArray(pokemon.types)) {
    tiposPokemon = pokemon.types.map(t => t?.toLowerCase()?.trim()).filter(t => t);
  } else if (pokemon.type1 || pokemon.type2) {
    tiposPokemon = [pokemon.type1, pokemon.type2]
      .map(t => t?.toLowerCase()?.trim())
      .filter(t => t);
  } else {
    return false;
  }
  
  const t1 = type1?.toLowerCase()?.trim();
  const t2 = type2?.toLowerCase()?.trim();
  
  if (!t2 || t2 === undefined || t1 === t2) {
    return tiposPokemon.length === 1 && tiposPokemon[0] === t1;
  }
  
  const tiposRonda = [t1, t2].slice().sort();
  const tiposPokemonOrdenados = tiposPokemon.slice().sort();
  
  return tiposPokemonOrdenados.length === 2 &&
    tiposPokemonOrdenados[0] === tiposRonda[0] &&
    tiposPokemonOrdenados[1] === tiposRonda[1];
}