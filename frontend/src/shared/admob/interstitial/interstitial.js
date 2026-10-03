import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import { ADS_CONFIG } from '../../../config/index.js'
import { adState } from '../admobState.js';
import { appState } from '../../../home/index.js';

const isAdmobAvailable = Capacitor.isPluginAvailable('AdMob');
const INTERSTITIAL_ADS = {
  challenge: ADS_CONFIG.INTERSTITIAL_CHALLENGE,
  levels: ADS_CONFIG.INTERSTITIAL_NIVELES,
  generator: ADS_CONFIG.INTERSTITIAL_GENERADOR,
};

function getInterstitialAdId(placement) {
  if (!Object.prototype.hasOwnProperty.call(INTERSTITIAL_ADS, placement)) {
    throw new RangeError(`Ubicación de anuncio intersticial desconocida: ${placement}`);
  }
  return INTERSTITIAL_ADS[placement];
}

export async function loadInsterstitial(placement = 'generator') {
  const idAUsar = getInterstitialAdId(placement);

  if (!isAdmobAvailable || !appState.internet) {
    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;
    return false;
  }

  try {
    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;

    await AdMob.prepareInterstitial({
      adId: idAUsar,
      isTesting: false,
    });

    adState.intersticialCargado = true;
    adState.intersticialPreparadoId = idAUsar;

    return true;

  } catch (error) {
    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;

    console.error("Error al cargar el intersticial:", error);

    return false;
  }
}

export async function showInsterstitial(placement = 'generator') {
  const idAUsar = getInterstitialAdId(placement);

  if (!isAdmobAvailable || !appState.internet) {
    return false;
  }
  
  if (!adState.intersticialCargado || adState.intersticialPreparadoId !== idAUsar) {
    const cargado = await loadInsterstitial(placement);

    if (!cargado) {
      return false;
    }
  }

  try {
    await AdMob.showInterstitial();

    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;

    loadInsterstitial(placement);

    return true;

  } catch (error) {
    console.error(
      "Error al mostrar el intersticial:",
      error
    );

    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;

    return false;
  }
}
