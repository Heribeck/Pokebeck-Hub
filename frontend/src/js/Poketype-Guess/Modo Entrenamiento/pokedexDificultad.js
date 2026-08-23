// Reglas puras para filtrar y priorizar el pool de Pokémon según la dificultad
// de Entrenamiento (Fácil/Normal/Difícil), usando el ID de Pokedex Nacional.
//
// Convención de IDs en tu pokedex.json:
// - IDs 1-386   → Generaciones 1 a 3 (Kanto, Johto, Hoenn)
// - IDs 1-1025  → Pokémon "base" (sin formas ni Megas)
// - IDs >= 10000 → Formas especiales, regionales y Megas (ej. Rotom-Heat = 10008)

const LIMITE_ID_TRES_GENERACIONES = 386;
const LIMITE_ID_FORMAS_ESPECIALES = 10000;

// Filtra el pool completo de Pokémon según la dificultad, ANTES de buscar
// cuáles tienen la combinación de tipos correcta.
export function filtrarPokedexPorDificultad(pokedex, modo) {
  if (modo === 'facil') {
    return pokedex.filter(p => p.id <= LIMITE_ID_TRES_GENERACIONES);
  }

  if (modo === 'normal') {
    return pokedex.filter(p => p.id < LIMITE_ID_FORMAS_ESPECIALES);
  }

  // difícil: pool completo, incluyendo formas y Megas
  return pokedex;
}

// Dado un pool ya filtrado por tipos válidos, elige el Pokémon correcto.
// En difícil, si hay formas/variantes disponibles para esa combinación,
// se priorizan (más probabilidad de salir una forma que un Pokémon base).
export function elegirPokemonConPrioridadFormas(pokemonesValidos, modo, generador = Math.random) {
  if (modo !== 'dificil') {
    const indice = Math.floor(generador() * pokemonesValidos.length);
    return pokemonesValidos[indice];
  }

  const formas = pokemonesValidos.filter(p => p.id >= LIMITE_ID_FORMAS_ESPECIALES);
  const pool = formas.length > 0 ? formas : pokemonesValidos; // si no hay formas para esta combo, usa el pool completo

  const indice = Math.floor(generador() * pool.length);
  return pool[indice];
}