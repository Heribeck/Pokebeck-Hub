import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { gameState } from "../../../state/poketypeState.js";
import { dataState } from "../../../../../home/index.js";

export function buildChallengePool() {
    const pool = dataState.pokedex

    const validPokemon = pool.filter(pokemon =>
        validatePokemonTypes(pokemon, gameState.type1Value, gameState.type2Value)
    )

    return { pool, validPokemon }
}
