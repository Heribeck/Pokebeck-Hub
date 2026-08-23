// Lleva registro de qué Pokémon ya salieron como respuesta correcta en la
// sesión actual de cada modo, para no repetirlos mientras el jugador siga vivo.
const usados = {
  campista: new Set(),
  as: new Set(),
  campeon: new Set(),
};

export function yaFueUsado(modo, nombrePokemon) {
  return usados[modo].has(nombrePokemon);
}

export function registrarUsado(modo, nombrePokemon) {
  usados[modo].add(nombrePokemon);
}

export function reiniciarUsados(modo) {
  usados[modo].clear();
}

export function hayOpcionesNoUsadas(modo, pokemonesValidos) {
  return pokemonesValidos.some(p => !yaFueUsado(modo, p.name));
}

export function buscarPokemonCorrectoEvitandoRepetidos(pokedex, type1, type2, modo, validarTiposPokemon) {
  const validos = pokedex.filter(p => validarTiposPokemon(p, type1, type2));
  if (validos.length === 0) return null;

  const noUsados = validos.filter(p => !yaFueUsado(modo, p.name));
  return noUsados.length > 0 ? noUsados[0] : validos[0]; // si ya se usaron todos, permite repetir
}