import { buildPokemonPool} from "../gameplay/buildPokemonTypes.js";
import { buildOptions } from "../gameplay/buildOptions.js";
import { generateTrainingTypes } from "../gameplay/generateTrainingTypes.js";
import { startTimerTraining } from "../../../../../shared/timer/index.js";
import { gameState } from "../../../state/poketypeState.js";
import { calculateTrainingSpeed } from "./trainingTime.js";


export async function trainingLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, onTimeOut, currentDifficulty){

  let poolByDifficulty = []
  let validPokemon = []

  do {
    generateTrainingTypes(setType1, setType2, currentDifficulty);
    const pool = buildPokemonPool(currentDifficulty);
    poolByDifficulty = pool.poolByDifficulty
    validPokemon = pool.validPokemon
  } while (validPokemon.length === 0)
    
  const { correctPokemon, allOptions } = buildOptions(poolByDifficulty, validPokemon, currentDifficulty);
  
  setCorrectPokemon(correctPokemon);
  setOptions(allOptions);
  
  const speed = calculateTrainingSpeed(currentDifficulty);

  const interval = startTimerTraining(speed, setTimerValue, onTimeOut, correctPokemon);
  gameState.timerTraining = interval;

}