export { startGeneration } from './modes/generator/gameplay/generatorGameplay.js'
export { validatePokemon, buildResultMessage } from './modes/generator/gameplay/generatorGameplay.js'   
export { generateTrainingTypes } from './modes/training/gameplay/generateTrainingTypes.js'
export { trainingLogic } from './modes/training/gameplay/trainingLogic.js'
export { getTypeCombinationsWithCount, buildTypeCombinationsByDifficulty } from './modes/training/algorithms/typeCombinations.js'
export { saveMaxScore, saveCurrentScore } from './modes/training/storage/scoreStorage.js'
export { challengeLogic } from './modes/daily-challenge/gameplay/challengeLogic.js'
export { createChallengeSession, registerRoundResult, calculateFinalResult } from './modes/daily-challenge/gameplay/challengeSession.js'
export { createDailyGenerator } from './modes/daily-challenge/algorithms/prngSeed.js'
export { obtenerVidasGenerales, restarVidaGeneral, restaurarVidaPorAnuncio, obtenerTiempoParaProximaRegeneracion } from './systems/livesSystem.js'

export { obtenerSiguienteNivel } from './modes/study/gameplay/levelRegistry.js'
export { obtenerNivelesCompletados } from './modes/study/storage/levelProgressStorage.js'
export { 
    getAvailableAttemptsToday, 
    consumeAttemptToday, 
    registerChallengePassed, 
    hasCompletedChallengeToday } from './modes/daily-challenge/storage/progressStorage.js'

export * from './systems/unlockSystem/index.js'

export { types, typesIcons, typesColors, typeSpanish } from './data/pokemonTypes.js'
export { gameState } from './state/poketypeState.js'
export { scoreState } from './modes/training/state/state.js'
export { datosLigas } from './modes/study/data/leaguesData.js'