import { Preferences } from '@capacitor/preferences'

import {
    TRAINING_MAX_EASY_KEY,
    TRAINING_MAX_NORMAL_KEY,
    TRAINING_MAX_HARD_KEY
} from '../../../../../shared/storage/index.js'
import { scoreState } from '../state/state.js'

export async function loadMaxScores() {
    const [easy, normal, hard] = await Promise.all([
        Preferences.get({ key: TRAINING_MAX_EASY_KEY }),
        Preferences.get({ key: TRAINING_MAX_NORMAL_KEY }),
        Preferences.get({ key: TRAINING_MAX_HARD_KEY })
    ])

    scoreState.maxEasy = parseInt(easy.value) || 0
    scoreState.maxNormal = parseInt(normal.value) || 0
    scoreState.maxHard = parseInt(hard.value) || 0
}

export async function saveMaxScore(difficulty, value) {
    const key = {
        facil: TRAINING_MAX_EASY_KEY,
        normal: TRAINING_MAX_NORMAL_KEY,
        dificil: TRAINING_MAX_HARD_KEY
    }[difficulty]
    await Preferences.set({ key, value: String(value) })
}

export function saveCurrentScore(value) {
    scoreState.currentScore = value
}
