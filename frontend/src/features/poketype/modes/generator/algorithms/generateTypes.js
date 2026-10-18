import { gameState } from "../../../state/poketypeState.js";
import { filterPokemonByType } from "./filterPokemonByTypes.js";
import { randomInt } from "../../../../../shared/algorithms/index.js";
import { types } from "../../../../../shared/data/index.js";

export function generateGeneratorTypes(setType1, setType2, setPokemonList, setSelectDisabled) {
    const t1 = types[randomInt(0, types.length - 1)]
    const t2 = types[randomInt(0, types.length - 1)]

    gameState.type1Value = t1;
    gameState.type2Value = t2;

    setType1(t1);
    setType2(t2);

    const filtered = t1 === t2 ? [] : filterPokemonByType(t1, t2);
    setPokemonList(filtered);
    setSelectDisabled(false);

    //registrarActividadGeneral();
}