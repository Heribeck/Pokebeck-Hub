import { BASE_SPEED, ALLOWS_PROGRESSION } from '../config/trainingConfig.js';
import { scoreState } from '../state/state.js';

export function calculateTrainingSpeed(currentDifficulty, incrementoPorNivel = 0.2, incrementoMaximo = 1) {
  const base = BASE_SPEED[currentDifficulty];
  const aumentosSpeed = 5; //aumentos de velocidad permitidos
  const currentScore = scoreState.currentScore;

  if (!ALLOWS_PROGRESSION[currentDifficulty] || currentScore === 0) {
    return base;
  }

  const nivelesSubidos = Math.floor(currentScore / aumentosSpeed);
  const incremento = Math.min(nivelesSubidos * incrementoPorNivel, incrementoMaximo);
  
  console.log('Speed:', base + incremento);
  return base + incremento;
}

