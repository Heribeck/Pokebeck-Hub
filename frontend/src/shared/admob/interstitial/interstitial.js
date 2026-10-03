import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import { ADS_CONFIG } from '../../../config/index.js'
import { adState } from '../admobState.js';
import { appState } from '../../../home/index.js';

const isAdmobAvailable = Capacitor.isPluginAvailable('AdMob');

export async function loadInsterstitial(adUnitId = null) {
  const idAUsar = adUnitId || ADS_CONFIG.INTERSTITIAL_GENERADOR;

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

export async function showInsterstitial(adUnitId = null) {
  const idAUsar = adUnitId || adState.intersticialPreparadoId || ADS_CONFIG.INTERSTITIAL_GENERADOR;

  if (!isAdmobAvailable || !appState.internet) {
    return false;
  }
  
  if (!adState.intersticialCargado || adState.intersticialPreparadoId !== idAUsar) {
    const cargado = await loadInsterstitial(idAUsar);

    if (!cargado) {
      return false;
    }
  }

  try {
    await AdMob.showInterstitial();

    adState.intersticialCargado = false;
    adState.intersticialPreparadoId = null;

    loadInsterstitial(idAUsar);

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
