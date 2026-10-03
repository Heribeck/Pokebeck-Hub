import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { filterPokedexByDifficulty } from "../algorithms/pokedexfiltering.js";
import { gameState } from "../../../state/poketypeState.js";
import { dataState } from "../../../../../home/index.js";

export function buildPokemonPool(currentDifficulty) {
    const poolByDifficulty = filterPokedexByDifficulty(dataState.pokedex, currentDifficulty)

    const validPokemon = poolByDifficulty.filter(pokemon =>
        validatePokemonTypes(pokemon, gameState.type1Value, gameState.type2Value)
    )

    return { poolByDifficulty, validPokemon }
}