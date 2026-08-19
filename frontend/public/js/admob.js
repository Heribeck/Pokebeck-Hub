// Variables importadas desde config.js
import { 
  idBanner, 
  idBonificado, 
  eventosBonificado, 
  adState,
  configRevivir,
  idIntersticial,
} from './Poketype-Guess/config.js';

import { mostrarNotificacion } from './Poketype-Guess/utils.js';
import { ocultarBotonRevivir, cuentaRegresivaRevivir, ejecutarRevivir, cancelarContadorRevivir } from './Poketype-Guess/Modo Entrenamiento/entrenamiento.js';


//Funcion para inicializar AdMob
export async function InicializarAdMob() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob) {
    try {
      await window.Capacitor.Plugins.AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: false
      });
      console.log("AdMob listo")
      await mostrarBanner("TOP_CENTER");
      await prepararIntersticial()
    } catch (error) {
      console.error("Error al inicializar AdMob:", error);
    }

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.cargado, () => {
      adState.bonificadoCargado = true;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.falloCarga, () => {
      adState.bonificadoCargado = false;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.recompensa, () => {
      adState.recompensaGanada = true;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.cerrado, async () => {

      if (adState.recompensaGanada && adState.modoRevivirActivo === 'vidas-generales') {
        const { restaurarVidaPorAnuncio } = await import('./Poketype-Guess/vidasGeneralesStorage.js');
        const { actualizarTiempoRegeneracionUI } = await import('./Poketype-Guess/vidasGeneralesStorage.js');
        const { actualizarIndicadorVidas } = await import('./Poketype-Guess/vidaUi.js');
        await restaurarVidaPorAnuncio();
        await actualizarTiempoRegeneracionUI();
        await actualizarIndicadorVidas()
        mostrarNotificacion('¡Vida recuperada!');
        adState.recompensaGanada = false;
        adState.modoRevivirActivo = null;
        prepararBonificado();
        return; // corta aquí, no sigue a la lógica de desafío/reto
      }

      if (adState.recompensaGanada && adState.modoRevivirActivo) {
        const config = configRevivir[adState.modoRevivirActivo];
        ocultarBotonRevivir(adState.modoRevivirActivo);
        config.btnIntento.style.display = "none";
        await cuentaRegresivaRevivir(config.mensaje);
        
        if (adState.modoRevivirActivo === 'desafio') {
          const { continuarDesafioTrasRevivir } = await import('./Poketype-Guess/Desafio del Dia/desafio-dia.js');
          continuarDesafioTrasRevivir();
        } else if (adState.modoRevivirActivo === 'reto') {
          const { continuarRetoTrasRevivir } = await import('./Poketype-Guess/Modo-Estudio/estudio.js');
          continuarRetoTrasRevivir();
        } else {
          ejecutarRevivir(adState.modoRevivirActivo);
        }

        adState.recompensaGanada = false;
      }
      prepararBonificado();
    });
  }
}

//Funcion para mostrar el banner
export async function mostrarBanner(posicionBanner){
  if (!window.Capacitor?.Plugins?.AdMob)return;
  if (!adState.hayInternet) return;

  const settingsAdMob = {
      adId: idBanner,
      adSize: "ADAPTIVE_BANNER",
      position: posicionBanner,
      margin: 0,
      isTesting: false
    };

  try {
      await window.Capacitor.Plugins.AdMob.showBanner(settingsAdMob);
      adState.bannerVisible = true;
      adState.bannerPendiente = false;
      console.log("Banner mostrado");

    } catch (error) {
      console.error("Error al mostrar banner:", error);
    }
}

//Funcion para hacer que el banner se oculte
export async function ocultarBanner(){
  if (!window.Capacitor?.Plugins?.AdMob) return;
  
  try {
    await window.Capacitor.Plugins.AdMob.removeBanner();
    adState.bannerVisible = false;
      
  } catch (error) {
    console.error("Error al ocultar banner:", error);
  }
}

//Prepara el bonificado
export async function prepararBonificado() {
  if (!window.Capacitor?.Plugins?.AdMob || !adState.hayInternet) {
    adState.bonificadoCargado = false;
    return false;
  }

  try {
    adState.bonificadoCargado = false;
    await window.Capacitor.Plugins.AdMob.prepareRewardVideoAd({
      adId: idBonificado,
      isTesting: false,
    });
    adState.bonificadoCargado = true;
    console.log("Video bonificado cargado y listo");
    return true;
  } catch (error) {
    adState.bonificadoCargado = false;
    console.error("Error al cargar el video:", error);
    return false;
  }
}

//Funcion para mostrar el anuncio Bonificado
export async function mostrarBonificado() {
  if (!window.Capacitor?.Plugins?.AdMob) {
    mostrarNotificacion("Anuncios no disponibles en este dispositivo");
    return false;
  }

  if (!adState.hayInternet || !navigator.onLine) {
    mostrarNotificacion("Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir.");
    return false;
  }

  if (!adState.bonificadoCargado) {
    mostrarNotificacion("Cargando anuncio...");
    const cargado = await prepararBonificado();
    if (!cargado) {
      mostrarNotificacion("No se pudo cargar el anuncio. Revisa tu conexión e inténtalo de nuevo.");
      return false;
    }
  }

  try {
    await window.Capacitor.Plugins.AdMob.showRewardVideoAd();
    return true;
  } catch (error) {
    adState.bonificadoCargado = false;
    mostrarNotificacion("Error al mostrar el anuncio");
    prepararBonificado();
    return false;
  }
}

//Funcion para las reacciones al click del boton Revivir
export async function clickRevivir(modo) {
  if (!adState.hayInternet || !navigator.onLine) {
    mostrarNotificacion("Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir.");
    return;
  }

  cancelarContadorRevivir();
  adState.modoRevivirActivo = modo;
  adState.recompensaGanada = false;

  const config = configRevivir[modo];
  if (config.btn) {
    config.btn.disabled = true;
  }
  await mostrarBonificado();
  if (config.btn) {
    config.btn.disabled = false;
  }
}

let intersticialCargado = false;

export async function prepararIntersticial() {
  if (!window.Capacitor?.Plugins?.AdMob || !adState.hayInternet) {
    intersticialCargado = false;
    return false;
  }

  try {
    intersticialCargado = false;
    await window.Capacitor.Plugins.AdMob.prepareInterstitial({
      adId: idIntersticial,
      isTesting: false,
    });
    intersticialCargado = true;
    return true;
  } catch (error) {
    intersticialCargado = false;
    console.error("Error al cargar el intersticial:", error);
    return false;
  }
}

export async function mostrarIntersticial() {
  if (!window.Capacitor?.Plugins?.AdMob || !adState.hayInternet) return false;

  if (!intersticialCargado) {
    const cargado = await prepararIntersticial();
    if (!cargado) return false;
  }

  try {
    await window.Capacitor.Plugins.AdMob.showInterstitial();
    intersticialCargado = false;
    prepararIntersticial();
    return true;
  } catch (error) {
    console.error("Error al mostrar el intersticial:", error);
    intersticialCargado = false;
    return false;
  }
}
