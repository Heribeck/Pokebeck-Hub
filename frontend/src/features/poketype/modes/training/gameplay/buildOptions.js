import { wasUsed, markAsUsed } from "../../../state/poketypeState.js";
import { allowRepeat } from "../../training/config/trainingConfig.js";
import { hasUnusedOptions, selectPokemonWithFormPriority } from "../algorithms/pokemonSelection.js";
import { gameState } from "../../../state/poketypeState.js";
import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { randomInt } from "../../../../../shared/algorithms/index.js";

export function buildOptions(poolByDifficulty, validPokemon, currentDifficulty) {
    
    const finalPool = hasUnusedOptions(currentDifficulty, validPokemon)
        ? validPokemon.filter(p => !wasUsed(currentDifficulty, p.name))
        : validPokemon;

    const correctPokemon = selectPokemonWithFormPriority(finalPool, currentDifficulty)

    if (!allowRepeat(currentDifficulty)) {
        markAsUsed(currentDifficulty, correctPokemon.name)
    }

    const wrongOptions = []
    while (wrongOptions.length < 3) {
        const candidate = poolByDifficulty[randomInt(0, poolByDifficulty.length - 1)]
        const isCorrect = candidate.name === correctPokemon.name
        const alreadyInList = wrongOptions.some(p => p.name === candidate.name)
        const hasSameTypes = validatePokemonTypes(candidate, gameState.type1Value, gameState.type2Value)

        if (!isCorrect && !alreadyInList && !hasSameTypes) {
            wrongOptions.push(candidate)
        }
    }

    const allOptions = [correctPokemon, ...wrongOptions].sort(() => Math.random() - 0.5)

    return { correctPokemon, allOptions }
}