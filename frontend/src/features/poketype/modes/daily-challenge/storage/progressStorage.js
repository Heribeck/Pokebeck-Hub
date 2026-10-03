import { Preferences } from '@capacitor/preferences'

import { getToday } from '../../../../../shared/time/index.js'
import { MAX_DAILY_ATTEMPTS } from '../config/challengeConfig.js'
import { DAILY_CHALLENGE_PROGRESS_KEY } from '../../../../../shared/storage/index.js'

function defaultProgress() {
  return {
    lastCompletedDay: null,
    attemptsDate: null,
    attemptsUsedToday: 0,
  }
}

async function getProgress() {
  const { value } = await Preferences.get({ key: DAILY_CHALLENGE_PROGRESS_KEY })
  if (!value) return defaultProgress()
  return { ...defaultProgress(), ...JSON.parse(value) }
}

async function saveProgress(progress) {
  await Preferences.set({ key: DAILY_CHALLENGE_PROGRESS_KEY, value: JSON.stringify(progress) })
}

export async function getAvailableAttemptsToday() {
  const progress = await getProgress()
  if (progress.attemptsDate !== getToday()) return MAX_DAILY_ATTEMPTS
  return MAX_DAILY_ATTEMPTS - progress.attemptsUsedToday
}

export async function consumeAttemptToday() {
  const progress = await getProgress()
  const today = getToday()

  if (progress.attemptsDate !== today) {
    progress.attemptsDate = today
    progress.attemptsUsedToday = 0
  }

  progress.attemptsUsedToday += 1
  await saveProgress(progress)
  return MAX_DAILY_ATTEMPTS - progress.attemptsUsedToday
}

export async function registerChallengePassed() {
  const progress = await getProgress()
  progress.lastCompletedDay = getToday()
  await saveProgress(progress)
}

export async function hasCompletedChallengeToday() {
  const progress = await getProgress()
  return progress.lastCompletedDay === getToday()
}
