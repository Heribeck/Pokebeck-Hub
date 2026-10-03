import { dataState } from "../../../../../home/index.js";
import { gameState } from "../../../state/poketypeState.js";
import { selectCombinationByDifficulty } from "../algorithms/typeCombinations.js";

export function generateTrainingTypes(setType1, setType2, currentDifficulty) {
    const { type1: t1, type2: t2 } = selectCombinationByDifficulty(dataState.typeCombinationsByDifficulty, currentDifficulty)
    gameState.type1Value = t1;
    gameState.type2Value = t2;

    setType1(t1);
    setType2(t2);

}