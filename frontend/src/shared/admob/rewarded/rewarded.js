import { Capacitor } from "@capacitor/core";
import { AdMob } from "@capacitor-community/admob";

import { adState } from "../admobState.js";
import { ADS_CONFIG } from "../../../config/index.js";
import { appState } from "../../../home/index.js";
import { showToast } from "../../toast/index.js";

const isAdmobAvailable = Capacitor.isPluginAvailable('AdMob');

function esperarBonificadoCargado(timeoutMs = 15000) {
  if (adState.bonificadoCargado) {  
    return Promise.resolve(true);
  }

  if (adState.promesaCargaBonificado) {
    return adState.promesaCargaBonificado;
  }

  adState.promesaCargaBonificado =  new Promise((resolve) => {
    adState.resolverCargaBonificado = resolve;

    adState.timeoutCargaBonificado = setTimeout(() => {
      adState.resolverCargaBonificado?.(false) 

      adState.resolverCargaBonificado = null;
      adState.promesaCargaBonificado = null;
      adState.timeoutCargaBonificado = null;

      console.warn(`AdMob: el bonificado no confirmó la carga después de ${timeoutMs} ms.`);
    }, timeoutMs);
  });
  return adState.promesaCargaBonificado;
}

export async function prepararBonificado(adUnitId = null) {
  const idAUsar = adUnitId || ADS_CONFIG.REWARDED_VIDAS;

  if (!isAdmobAvailable || !appState.internet) {
    adState.bonificadoCargado = false;
    adState.bonificadoPreparadoId = null;
    return false;
  }

  if (adState.bonificadoCargado && adState.bonificadoPreparadoId === idAUsar) {
    return true;
  }

  if (adState.bonificadoCargado && adState.bonificadoPreparadoId !== idAUsar) {
    adState.bonificadoCargado = false;
  }

  if (adState.preparandoBonificado) {
    return adState.preparandoBonificado;
  }

  adState.preparandoBonificado = (async () => {
    try {
      adState.bonificadoCargado = false;
      adState.bonificadoPreparadoId = null;

      
      console.log(`[AdMob Rewarded]: Video bonificado Cargado.`);
      
      await AdMob.prepareRewardVideoAd({
        adId: idAUsar,
        isTesting: false,
      });
      
      adState.bonificadoCargado = true;
      adState.bonificadoPreparadoId = idAUsar;

      
      return true;

    } catch (error) {
      adState.bonificadoCargado = false;
      adState.bonificadoPreparadoId = null;

      showToast("No se pudo preparar el anuncio bonificado. Revisa tu conexión e inténtalo de nuevo.");
      console.error("Error al preparar el video bonificado:", error);

      return false;

    } finally {
      adState.preparandoBonificado = null;
    }
  })();

  return adState.preparandoBonificado;
}

export async function showRewarded(adUnitId = null, onRewardEarned = null) {
  const idAUsar = adUnitId || adState.bonificadoPreparadoId || ADS_CONFIG.REWARDED_VIDAS;

  if (!isAdmobAvailable || !appState.internet) {
    return false;
  } 
  
  if (!adState.bonificadoCargado || adState.bonificadoPreparadoId !== idAUsar) {
    showToast("Cargando anuncio...");
    const cargado = await prepararBonificado(idAUsar);

    if (!cargado || !adState.bonificadoCargado) {
      showToast("No se pudo cargar el anuncio bonificado.");
      return false;
    }
  }

  try {
    adState.recompensaGanada = false;
    adState.onRewardEarned = onRewardEarned;
    await AdMob.showRewardVideoAd();
    
    adState.bonificadoCargado = false;
    adState.bonificadoPreparadoId = null;
    
    console.log("AdMob: anuncio bonificado mostrado.");

    return true;

  } catch (error) {
    adState.bonificadoCargado = false;
    adState.bonificadoPreparadoId = null;

    console.error("Error al mostrar el anuncio bonificado:", error);

    prepararBonificado(idAUsar);

    return false;
  } finally {
    adState.onRewardEarned = null;
  }
}