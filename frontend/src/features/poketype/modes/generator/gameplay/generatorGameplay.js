import { generateGeneratorTypes } from "../algorithms/generateTypes.js";
import { delay } from "../../../../../shared/time/index.js";
import { typeSpanish } from "../../../data/pokemonTypes.js";
import { capitalizeFirstLetter } from "../../../../../shared/strings/index.js";
import { dataState } from "../../../../../home/index.js";
import { incrementGeneratorCounter } from "../storage/generatorStorage.js"; 

export function translateType(type) {
  return typeSpanish[type] || capitalizeFirstLetter(type);
}

export async function startGeneration(setBtnText, setBtnDisabled, setType1, setType2, setPokemonList, setSelectDisabled) {

  setBtnDisabled(true);
  
  setBtnText("3...");
  await delay(1000); 
  
  setBtnText("2...");
  await delay(1000);
  
  setBtnText("1...");
  await delay(1000);
  
  setBtnText("¡Generando!");

  incrementGeneratorCounter();

  generateGeneratorTypes(setType1, setType2, setPokemonList, setSelectDisabled);
  
  await delay(500); 

  setBtnText("Generar");
  setBtnDisabled(false);
    
}

export function validatePokemon(selectedPokemon, type1, type2) {
  const pokemon = dataState.pokedex.find(p => p.name === selectedPokemon)

  if (!pokemon) return { isCorrect: false, pokemon: null }

  const pokemonTypes = pokemon.types || []
  let isCorrect = false

  if (type1 === type2) {
    isCorrect = pokemonTypes.length === 1 && pokemonTypes[0] === type1
  } else {
    isCorrect = pokemonTypes.includes(type1) && pokemonTypes.includes(type2)
  }

  return { isCorrect, pokemon }
}

export function buildResultMessage(isCorrect, pokemon, type1, type2) {
  const name = capitalizeFirstLetter(pokemon.name)

  if (type1 === type2) {
    return isCorrect
      ? `¡Excelente! ${name} sí es de tipo ${translateType(type1)}`
      : `Hmm, ${name} no es monotipo de ${translateType(type1)}. Inténtalo de nuevo`
  } else {
    return isCorrect
      ? `¡Perfecto! ${name} tiene los tipos ${translateType(type1)} y ${translateType(type2)}`
      : `Casi... ${name} no tiene ambos tipos ${translateType(type1)} y ${translateType(type2)}`
  }
}