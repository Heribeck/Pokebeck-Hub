import { STREAK_KEY } from '../../../shared/storage/index.js'
import { Preferences } from '@capacitor/preferences'
import { showToast } from '../../../shared/toast/index.js'
import { getCurrentDateTime } from '../../../shared/time/index.js'
import {
    cancelNotification,
    NOTIFICATION_IDS,
    scheduleNotification,
} from '../../../shared/notifications/index.js'

function defaultStreakProgress() {
    return {
        streak: 0,
        maxStreak: 0,
        lastActivityExact: null,
        streakStartedAt: null,
    }
}

export async function getStreakProgress() {
    const { value } = await Preferences.get({ key: STREAK_KEY })
    if (!value) return defaultStreakProgress()
    return JSON.parse(value)
}

export async function saveStreakProgress(progress) {
    await Preferences.set({ key: STREAK_KEY, value: JSON.stringify(progress) })
}

async function syncStreakReminder(progress) {
    const lastActivity = new Date(progress.lastActivityExact)
    const reminderAt = new Date(lastActivity.getTime() + 24 * 60 * 60 * 1000)

    if (Number.isNaN(lastActivity.getTime()) || reminderAt <= new Date()) {
        await cancelNotification(NOTIFICATION_IDS.STREAK_REMINDER)
        return
    }

    await scheduleNotification({
        id: NOTIFICATION_IDS.STREAK_REMINDER,
        title: 'Tu racha te espera',
        body: 'Vuelve a Poketype para mantener tu racha activa.',
        at: reminderAt,
    })
}

export async function incrementStreak() {
    const normalizedProgress = await getStreakProgress()

    normalizedProgress.streak = Number(normalizedProgress.streak) || 0
    normalizedProgress.maxStreak = Number(normalizedProgress.maxStreak) || 0

    if (normalizedProgress.lastActivityExact) {
        const lastActivity = new Date(normalizedProgress.lastActivityExact)
        const today = new Date(getCurrentDateTime())
        if (!normalizedProgress.streakStartedAt && normalizedProgress.streak > 0 && !Number.isNaN(lastActivity.getTime())) {
            const estimatedStart = new Date(lastActivity)
            estimatedStart.setDate(estimatedStart.getDate() - normalizedProgress.streak + 1)
            normalizedProgress.streakStartedAt = estimatedStart.toISOString()
        }
        if (!Number.isNaN(lastActivity.getTime()) && !Number.isNaN(today.getTime()) && lastActivity.toDateString() === today.toDateString()) {
            normalizedProgress.lastActivityExact = new Date().toISOString()
            await saveStreakProgress(normalizedProgress)
            await syncStreakReminder(normalizedProgress)
            return normalizedProgress
        }
    }

    if (normalizedProgress.streak === 0) {
        normalizedProgress.streakStartedAt = new Date().toISOString()
    }
    normalizedProgress.streak += 1
    if (normalizedProgress.streak > normalizedProgress.maxStreak) {
        normalizedProgress.maxStreak = normalizedProgress.streak
    }
    normalizedProgress.lastActivityExact = new Date().toISOString()
    await saveStreakProgress(normalizedProgress)
    await syncStreakReminder(normalizedProgress)

    if (normalizedProgress.streak === 1) {
        showToast(`Haz Activado tu racha - ${normalizedProgress.streak} 🔥`)
    } else if (normalizedProgress.streak > 1) {
        showToast(`¡Racha incrementada a ${normalizedProgress.streak} 🔥`)
    }

    return normalizedProgress
}

export async function checkStreak() {
    const progress = await getStreakProgress()
    if (!progress.lastActivityExact) {
        await cancelNotification(NOTIFICATION_IDS.STREAK_REMINDER)
        return { progress, expiredStreak: null }
    }

    const last = new Date(progress.lastActivityExact)
    const now = new Date()
    const hoursDiff = (now - last) / (1000 * 60 * 60)
    let expiredStreak = null

    if (hoursDiff >= 48 && progress.streak > 0) {
        const startedAt = progress.streakStartedAt
            ? new Date(progress.streakStartedAt)
            : new Date(progress.lastActivityExact)
        if (!progress.streakStartedAt && !Number.isNaN(startedAt.getTime())) {
            startedAt.setDate(startedAt.getDate() - Number(progress.streak) + 1)
        }
        expiredStreak = {
            days: Number(progress.streak),
            startedAt: Number.isNaN(startedAt.getTime()) ? progress.lastActivityExact : startedAt.toISOString(),
        }
        progress.streak = 0
        progress.streakStartedAt = null
        await saveStreakProgress(progress)
    }

    await syncStreakReminder(progress)
    return { progress, expiredStreak }
}