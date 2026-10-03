import { loadInsterstitial } from './interstitial/interstitial.js'
import { prepararBonificado } from './rewarded/rewarded.js'

export async function setupAds() {
    await loadInsterstitial()
    await prepararBonificado()
}