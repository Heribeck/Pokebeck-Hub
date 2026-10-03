export const gameState = {
  type1Value: "",
  type2Value: "",
  timerChallenge: null,
  timerTraining: null,
  timerStudy: null,
};

const usados = {
  facil: new Set(),
  normal: new Set(),
  dificil: new Set(),
};

export function wasUsed(modo, nombrePokemon) {
  console.log(usados[modo])
  return usados[modo].has(nombrePokemon);
}

export function markAsUsed(modo, nombrePokemon) {
  usados[modo].add(nombrePokemon);
}

export function resetUsed(modo) {
  usados[modo].clear();
}
