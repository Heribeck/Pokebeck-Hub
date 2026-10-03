import { buildChallengePool } from "./buildPokemonTypesChallenge.js";
import { buildChallengeOptions } from "./buildOptionsChallenge.js";
import { generateChallengeTypes } from "./generateChallengeTypes.js";
import { calculateChallengeSpeed } from "./challengeTime.js";
import { startTimerTraining } from "../../../../../shared/timer/index.js";
import { gameState } from "../../../state/poketypeState.js";

export async function challengeLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, onTimeOut, generator, streak) {

  let pool = []
  let validPokemon = []

  do {
    generateChallengeTypes(setType1, setType2, generator);
    const result = buildChallengePool();
    pool = result.pool
    validPokemon = result.validPokemon
  } while (validPokemon.length === 0)

  const { correctPokemon, allOptions } = buildChallengeOptions(pool, validPokemon, generator);

  setCorrectPokemon(correctPokemon);
  setOptions(allOptions);

  const speed = calculateChallengeSpeed(streak);

  const interval = startTimerTraining(speed, setTimerValue, onTimeOut, correctPokemon);
  gameState.timerChallenge = interval;
}
