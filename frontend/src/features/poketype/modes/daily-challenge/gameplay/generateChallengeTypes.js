import { dataState } from "../../../../../home/index.js";
import { types } from "../../../../../config/index.js";
import { gameState } from "../../../state/poketypeState.js";
import { validatePokemonTypes } from "../../../algorithms/pokemonTypes.js";
import { pickRandom } from "../algorithms/prngSeed.js";
import { MAX_TYPE_GENERATION_TRIES } from "../config/challengeConfig.js";

export function generateChallengeTypes(setType1, setType2, generator) {
    for (let attempt = 0; attempt < MAX_TYPE_GENERATION_TRIES; attempt++) {
        const t1 = pickRandom(types, generator);
        const t2 = pickRandom(types, generator);

        const hasAtLeastOne = dataState.pokedex.some(p => validatePokemonTypes(p, t1, t2));
        if (hasAtLeastOne) {
            gameState.type1Value = t1;
            gameState.type2Value = t2;
            setType1(t1);
            setType2(t2);
            return true;
        }
    }

    return false;
}
