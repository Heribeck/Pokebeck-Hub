import { AdMob } from '@capacitor-community/admob'

import { adState, setResolverCargaBonificado, setPromesaCargaBonificado, setTimeoutCargaBonificado, setListenersRegistrados } from '../admobState.js'
import { prepararBonificado } from './rewarded.js'
import { eventsRewarded } from '../../../config/index.js'

function onRewardedLoaded() {
    console.log('AdMob: anuncio bonificado cargado.')
    adState.bonificadoCargado = true
    adState.resolverCargaBonificado?.(true)
    setResolverCargaBonificado(null)
    setPromesaCargaBonificado(null)
    if (adState.timeoutCargaBonificado) {
        clearTimeout(adState.timeoutCargaBonificado)
        setTimeoutCargaBonificado(null)
    }
}

function onRewardedFailed(error) {
    console.warn('AdMob: fallo al cargar anuncio bonificado.', error)
    adState.bonificadoCargado = false
    adState.resolverCargaBonificado?.(false)
    setResolverCargaBonificado(null)
    setPromesaCargaBonificado(null)
    if (adState.timeoutCargaBonificado) {
        clearTimeout(adState.timeoutCargaBonificado)
        setTimeoutCargaBonificado(null)
    }
}

function onRewardEarned() {
    adState.recompensaGanada = true
    adState.onRewardEarned?.()
    console.log('[AdMob Rewarded]: recompensa recibida.')
}

async function onRewardedClosed() {
    //await handleRevive()
    adState.recompensaGanada = false
    adState.modoRevivirActivo = null
    console.log('[AdMob Rewarded]: anuncio bonificado cerrado.')
    prepararBonificado()
}

export function registerListeners() {
    if (adState.listenersRegistrados) {
        console.warn('Listeners ya registrados.')
        return
    }

    AdMob.addListener(eventsRewarded.cargado, onRewardedLoaded)
    AdMob.addListener(eventsRewarded.falloCarga, onRewardedFailed)
    AdMob.addListener(eventsRewarded.recompensa, onRewardEarned)
    AdMob.addListener(eventsRewarded.cerrado, onRewardedClosed)

    setListenersRegistrados(true)
}