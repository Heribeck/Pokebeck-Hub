import { AdMob } from '@capacitor-community/admob'
import { Capacitor } from '@capacitor/core'

import { adState, setInicializado } from './admobState.js'
import { registerListeners } from './rewarded/listeners.js'
import { setupAds } from './admobSetup.js'

const admobAvailable = () => Capacitor.isPluginAvailable('AdMob')

export async function initAdMob() {
  if (adState.inicializado) {
    console.warn('AdMob ya está inicializado.')
    return
  }

  if (!admobAvailable()) {
    console.warn('AdMob no disponible en este dispositivo.')
    return
  }

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false
    })

    registerListeners()
    await setupAds()

    setInicializado(true)

  } catch (error) {
    console.error('Error al inicializar AdMob:', error)
  }
}
