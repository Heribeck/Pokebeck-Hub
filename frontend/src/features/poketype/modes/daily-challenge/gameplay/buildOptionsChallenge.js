import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { gameState } from "../../../state/poketypeState.js";
import { pickRandom, shuffleWithGenerator } from "../algorithms/prngSeed.js";
import { MAX_WRONG_OPTIONS_TRIES, WRONG_OPTIONS_COUNT } from "../config/challengeConfig.js";

export function buildChallengeOptions(pool, validPokemon, generator) {
    const correctPokemon = pickRandom(validPokemon, generator)

    const wrongOptions = []
    let tries = 0

    while (wrongOptions.length < WRONG_OPTIONS_COUNT && tries < MAX_WRONG_OPTIONS_TRIES) {
        tries++
        const candidate = pickRandom(pool, generator)
        const isCorrect = candidate.name === correctPokemon.name
        const alreadyInList = wrongOptions.some(p => p.name === candidate.name)
        const hasSameTypes = validatePokemonTypes(candidate, gameState.type1Value, gameState.type2Value)

        if (!isCorrect && !alreadyInList && !hasSameTypes) {
            wrongOptions.push(candidate)
        }
    }

    if (wrongOptions.length < WRONG_OPTIONS_COUNT) {
        throw new Error('No se encontraron suficientes opciones incorrectas para esta ronda.')
    }

    const allOptions = shuffleWithGenerator([correctPokemon, ...wrongOptions], generator)

    return { correctPokemon, allOptions }
}
