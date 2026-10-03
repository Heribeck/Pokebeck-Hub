import { Preferences } from "@capacitor/preferences"

import { showInsterstitial } from "../../../../../shared/admob/index.js"
import { ADS_CONFIG, GENERATOR_COUNTER_KEY } from "../../../../../config/index.js"
const LIMITE_GENERADOR = 8 // Límite de veces que se puede generar antes de mostrar el intersticial

export async function incrementGeneratorCounter() {
    const { value } = await Preferences.get({ key: GENERATOR_COUNTER_KEY })
    const counter = parseInt(value || '0', 10)
    const newCounter = counter + 1

    await Preferences.set({ key: GENERATOR_COUNTER_KEY, value: String(newCounter) })

    if (newCounter >= LIMITE_GENERADOR) {
        await Preferences.set({ key: GENERATOR_COUNTER_KEY, value: '0' })
        showInsterstitial(ADS_CONFIG.INTERSTITIAL_GENERADOR)
    }
}