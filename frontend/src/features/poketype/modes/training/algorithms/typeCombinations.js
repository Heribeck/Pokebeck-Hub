import { dataState } from "../../../../../home/index.js";
import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { types } from "../../../../../shared/data/index.js";

const THREE_GENERATION_ID_LIMIT = 386;

function calculateCombinationCounts(pokedex) {
  return dataState.typeCombinations
  .map(({ type1, type2 }) => {
    const conteo = pokedex.filter(p =>
      validatePokemonTypes(p, type1, type2)
    ).length;

    return {type1, type2, conteo};
  }).filter(c => c.conteo > 0);
}

export function buildTypeCombinationsByDifficulty() {
  const firstThreeGenerations = dataState.pokedex.filter(
    pokemon => pokemon.id <= THREE_GENERATION_ID_LIMIT
  );

  return {
    facil: calculateCombinationCounts(firstThreeGenerations),
    normal: calculateCombinationCounts(dataState.pokedex),
    dificil: calculateCombinationCounts(dataState.pokedex)
  };
}

export function getTypeCombinationsWithCount() {
  const combinaciones = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = i; j < types.length; j++) {
      const type1 = types[i];
      const type2 = types[j];
      const conteo = dataState.pokedex.filter(p => validatePokemonTypes(p, type1, type2)).length;

      if (conteo > 0) {
        combinaciones.push({ type1, type2, conteo });
      }
    }
  }

  console.log('Data de combinaciones con conteo cargada', combinaciones.length);
  return combinaciones;
}


export function selectCombinationByDifficulty(combinationsByDifficulty, currentDifficulty, generador = Math.random) {
  const combinations = combinationsByDifficulty[currentDifficulty];
  const conteos = combinations.map(({ conteo }) => conteo).sort((a, b) => a - b);
  const indicePercentil33 = Math.floor(conteos.length / 3);
  const indicePercentil66 = Math.floor((conteos.length * 2) / 3);

  const umbralBajo = conteos[Math.max(0, indicePercentil33 - 1)] ?? conteos[0];
  const umbralAlto = conteos[Math.min(conteos.length - 1, indicePercentil66)] ?? conteos[conteos.length - 1];

  const pool = currentDifficulty === 'facil'
    ? combinations.filter(({ conteo }) => conteo >= umbralAlto)
    : currentDifficulty === 'dificil'
      ? combinations.filter(({ conteo }) => conteo <= umbralBajo)
      : combinations;

  const indice = Math.floor(generador() * pool.length);
  const { type1, type2 } = pool[indice];

  return { type1, type2 };
}