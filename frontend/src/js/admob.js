// Variables importadas desde config.js
import {
  adState,
  configRevivir,
  gameState,
} from './Poketype-Guess/config.js';

import { LIMITE_GENERADOR, CONTADOR_GENERADOR_KEY, LIMITE_PERDIDAS_ENTRENAMIENTO, CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY, ADS_CONFIG, eventosBonificado } from './adsConfig.js';

import { mostrarNotificacion } from './Poketype-Guess/utils.js';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import {
  ocultarBotonRevivir,
  cuentaRegresivaRevivir,
  ejecutarRevivir,
  cancelarContadorRevivir
} from './Poketype-Guess/Modo Entrenamiento/entrenamiento.js';


// ============================================================
// ESTADO INTERNO DE ADMOB
// ============================================================

let intersticialCargado = false;
let intersticialPreparadoId = null;

// Evita que se ejecuten varias cargas del bonificado al mismo tiempo.
let preparandoBonificado = null;

// Promesa utilizada para esperar el evento real de "cargado".
let resolverCargaBonificado = null;

// Timeout de seguridad para evitar quedarse esperando indefinidamente.
let timeoutCargaBonificado = null;

// ID del rewarded actualmente preparado
let bonificadoPreparadoId = null;

// Banner actualmente activo
let bannerActivo = null;

// Flag para evitar inicialización doble
let inicializado = false;

// Referencias a listeners para poder eliminarlos
let listenersRegistrados = false;

// ============================================================
// FUNCION AUXILIAR: COMPROBAR ADMOB
// ============================================================

function admobDisponible() {
  return Capacitor.isPluginAvailable('AdMob');
}

function esPlataformaNativa() {
  return Capacitor.isNativePlatform();
}

// ============================================================
// FUNCIONES DE SIMULACIÓN WEB (FALLBACK)
// ============================================================

function simularBanner() {
  console.log("[AdMob Web] Simulando banner...");
  return Promise.resolve();
}

function simularRewarded(callbackRecompensa) {
  console.log("[AdMob Web] Simulando anuncio bonificado...");
  setTimeout(() => {
    console.log("[AdMob Web] Recompensa concedida.");
    if (callbackRecompensa) {
      callbackRecompensa();
    }
  }, 1000);
}

function simularInterstitial(callbackCierre) {
  console.log("[AdMob Web] Simulando interstitial...");
  setTimeout(() => {
    console.log("[AdMob Web] Interstitial cerrado.");
    if (callbackCierre) {
      callbackCierre();
    }
  }, 1000);
}

// ============================================================
// FUNCION AUXILIAR: ESPERAR A QUE ADMOB CONFIRME LA CARGA
// ============================================================

function esperarBonificadoCargado(timeoutMs = 15000) {
  // Si ya sabemos que está cargado, no necesitamos esperar.
  if (adState.bonificadoCargado) {
    return Promise.resolve(true);
  }

  // Si ya existe una espera activa, reutilizamos esa misma promesa.
  if (resolverCargaBonificado) {
    return resolverCargaBonificado;
  }

  return new Promise((resolve) => {
    resolverCargaBonificado = resolve;

    timeoutCargaBonificado = setTimeout(() => {
      if (resolverCargaBonificado) {
        resolverCargaBonificado(false);
        resolverCargaBonificado = null;
      }

      timeoutCargaBonificado = null;

      console.warn(
        `AdMob: el bonificado no confirmó la carga después de ${timeoutMs} ms.`
      );
    }, timeoutMs);
  });
}

// ============================================================
// INICIALIZAR ADMOB
// ============================================================

export async function InicializarAdMob() {
  // Protección contra inicialización doble
  if (inicializado) {
    console.warn("AdMob ya está inicializado. Evitando inicialización duplicada.");
    return;
  }

  if (!admobDisponible()) {
    console.warn("AdMob no está disponible en este dispositivo.");
    return;
  }

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false
    });

    console.log("AdMob listo");

    if (listenersRegistrados) {
      console.warn("Listeners ya registrados. Evitando duplicación.");
    } else {
      AdMob.addListener(
        eventosBonificado.cargado,
        () => {
          console.log("AdMob: anuncio bonificado cargado.");

          adState.bonificadoCargado = true;

          // Resolver cualquier espera pendiente.
          if (resolverCargaBonificado) {
            resolverCargaBonificado(true);
            resolverCargaBonificado = null;
          }

          if (timeoutCargaBonificado) {
            clearTimeout(timeoutCargaBonificado);
            timeoutCargaBonificado = null;
          }
        }
      );

      AdMob.addListener(
        eventosBonificado.falloCarga,
        (error) => {
          console.warn("AdMob: fallo al cargar anuncio bonificado.", error);

          adState.bonificadoCargado = false;

          // Resolver cualquier espera pendiente como fallo.
          if (resolverCargaBonificado) {
            resolverCargaBonificado(false);
            resolverCargaBonificado = null;
          }

          if (timeoutCargaBonificado) {
            clearTimeout(timeoutCargaBonificado);
            timeoutCargaBonificado = null;
          }
        }
      );

      AdMob.addListener(
        eventosBonificado.recompensa,
        () => {
          console.log("AdMob: recompensa recibida.");

          adState.recompensaGanada = true;
        }
      );

      AdMob.addListener(
        eventosBonificado.cerrado,
        async () => {
          console.log("AdMob: anuncio bonificado cerrado.");

          // ------------------------------------------------------
          // VIDAS GENERALES
          // ------------------------------------------------------

          if (
            adState.recompensaGanada &&
            adState.modoRevivirActivo === 'vidas-generales'
          ) {
            const {
              restaurarVidaPorAnuncio,
              actualizarTiempoRegeneracionUI
            } = await import(
              './Poketype-Guess/vidasGeneralesStorage.js'
            );

            const {
              actualizarIndicadorVidas
            } = await import(
              './Poketype-Guess/vidaUi.js'
            );

            await restaurarVidaPorAnuncio();
            await actualizarTiempoRegeneracionUI();
            await actualizarIndicadorVidas();

            mostrarNotificacion('¡Vida recuperada!');

            adState.recompensaGanada = false;
            adState.modoRevivirActivo = null;

            // Preparar el siguiente anuncio.
            prepararBonificado();

            return;
          }

          // ------------------------------------------------------
          // REVIVIR NORMAL
          // ------------------------------------------------------

          if (
            adState.recompensaGanada &&
            adState.modoRevivirActivo
          ) {
            const modo = adState.modoRevivirActivo;
            const config = configRevivir[modo];

            if (config) {
              ocultarBotonRevivir(modo);

              if (config.btnIntento) {
                config.btnIntento.style.display = "none";
              }

              // --------------------------------------------------
              // OCULTAR BOTÓN VOLVER A DIFICULTAD SI ES CAMPISTA
              // --------------------------------------------------

              if (modo === 'campista') {
                const {
                  btnVolverDificultadCampista
                } = await import('./Poketype-Guess/config.js');

                if (btnVolverDificultadCampista) {
                  btnVolverDificultadCampista.style.display = "none";
                }
              }

              await cuentaRegresivaRevivir(config.mensaje);

              // --------------------------------------------------
              // CONTINUAR DESAFÍO
              // --------------------------------------------------

              if (modo === 'desafio') {
                const {
                  continuarDesafioTrasRevivir
                } = await import(
                  './Poketype-Guess/Desafio del Dia/desafio-dia.js'
                );

                continuarDesafioTrasRevivir();

              // --------------------------------------------------
              // CONTINUAR RETO
              // --------------------------------------------------

              } else if (modo === 'reto') {
                const {
                  continuarRetoTrasRevivir
                } = await import(
                  './Poketype-Guess/Modo-Estudio/estudio.js'
                );

                continuarRetoTrasRevivir();

              // --------------------------------------------------
              // OTROS MODOS
              // --------------------------------------------------

              } else {
                ejecutarRevivir(modo);
              }
            }

            adState.recompensaGanada = false;
          }

          // ------------------------------------------------------
          // CAMPISTA
          // ------------------------------------------------------

          if (
            adState.modoRevivirActivo === 'campista' &&
            !adState.recompensaGanada
          ) {
            const {
              btnVolverDificultadCampista
            } = await import('./Poketype-Guess/config.js');

            if (btnVolverDificultadCampista) {
              btnVolverDificultadCampista.style.display = "none";
            }
          }

          // Limpiar estado del modo después de terminar.
          adState.recompensaGanada = false;
          adState.modoRevivirActivo = null;

          // Preparar el siguiente anuncio.
          prepararBonificado();
        }
      );

      listenersRegistrados = true;
    }

    // ----------------------------------------------------------
    // PREPARAR ANUNCIOS
    // ----------------------------------------------------------

    await mostrarBanner("TOP_CENTER");

    await prepararIntersticial();

    // Preparamos también el bonificado desde el inicio.
    // Así el primer clic de revivir no tiene que empezar
    // la carga desde cero.
    prepararBonificado();

    // Marcar como inicializado exitosamente
    inicializado = true;

  } catch (error) {
    console.error("Error al inicializar AdMob:", error);
  }
}

// ============================================================
// MOSTRAR BANNER
// ============================================================

export async function mostrarBanner(posicionBanner, tipoBanner = 'main') {
  // Fallback web: simular banner en navegador
  if (!esPlataformaNativa()) {
    return simularBanner();
  }

  if (!admobDisponible()) return;

  if (!adState.hayInternet) return;

  // Seleccionar ID según tipo
  const adId = tipoBanner === 'generador'
    ? ADS_CONFIG.BANNER_GENERADOR
    : ADS_CONFIG.BANNER_MAIN;

  const settingsAdMob = {
    adId: adId,
    adSize: "ADAPTIVE_BANNER",
    position: posicionBanner,
    margin: 0,
    isTesting: false
  };

  try {
    await AdMob.showBanner(settingsAdMob);

    adState.bannerVisible = true;
    adState.bannerPendiente = false;
    bannerActivo = tipoBanner;

    console.log(`Banner mostrado (${tipoBanner})`);

  } catch (error) {
    console.error("Error al mostrar banner:", error);
  }
}

// ============================================================
// OCULTAR BANNER
// ============================================================

export async function ocultarBanner() {
  // Fallback web: no hacer nada en navegador
  if (!esPlataformaNativa()) {
    adState.bannerVisible = false;
    bannerActivo = null;
    return;
  }

  if (!admobDisponible()) return;

  try {
    await AdMob.removeBanner();

    adState.bannerVisible = false;
    bannerActivo = null;

  } catch (error) {
    console.error("Error al ocultar banner:", error);
  }
}

// ============================================================
// CAMBIAR BANNER
// ============================================================

export async function cambiarBanner(tipoBanner) {
  if (!admobDisponible()) return;

  // Si ya está activo el mismo banner, no hacer nada
  if (bannerActivo === tipoBanner && adState.bannerVisible) {
    return;
  }

  // Ocultar banner actual si está visible
  if (adState.bannerVisible) {
    await ocultarBanner();
  }

  // Mostrar nuevo banner
  await mostrarBanner("TOP_CENTER", tipoBanner);
}

// ============================================================
// PREPARAR BONIFICADO
// ============================================================

export async function prepararBonificado(adUnitId = null) {
  // Si no se proporciona ID, usar el default (vidas generales)
  const idAUsar = adUnitId || ADS_CONFIG.REWARDED_VIDAS;

  if (!admobDisponible() || !adState.hayInternet) {
    adState.bonificadoCargado = false;
    bonificadoPreparadoId = null;
    return false;
  }

  // Si ya está cargado el mismo ID, no hacemos otra petición.
  if (adState.bonificadoCargado && bonificadoPreparadoId === idAUsar) {
    return true;
  }

  // Si hay un ID diferente preparado, necesitamos recargar
  if (adState.bonificadoCargado && bonificadoPreparadoId !== idAUsar) {
    adState.bonificadoCargado = false;
  }

  // Si ya hay una carga en progreso, esperamos esa misma carga.
  if (preparandoBonificado) {
    return preparandoBonificado;
  }

  preparandoBonificado = (async () => {
    try {
      adState.bonificadoCargado = false;
      bonificadoPreparadoId = null;

      console.log(`AdMob: preparando anuncio bonificado (${idAUsar})...`);

      // Comenzamos la preparación.
      await AdMob.prepareRewardVideoAd({
        adId: idAUsar,
        isTesting: false,
      });

      console.log(
        "AdMob: prepareRewardVideoAd terminó. Esperando confirmación de carga..."
      );

      // IMPORTANTE:
      // NO ponemos bonificadoCargado = true aquí.
      //
      // Esperamos al evento real de "cargado".
      const cargado = await esperarBonificadoCargado(15000);

      if (cargado) {
        console.log(`AdMob: video bonificado confirmado como cargado (${idAUsar}).`);
        bonificadoPreparadoId = idAUsar;
        return true;
      }

      console.warn(
        "AdMob: prepareRewardVideoAd terminó pero el anuncio no confirmó carga."
      );

      adState.bonificadoCargado = false;
      bonificadoPreparadoId = null;

      return false;

    } catch (error) {
      adState.bonificadoCargado = false;
      bonificadoPreparadoId = null;

      console.error(
        "Error al preparar el video bonificado:",
        error
      );

      return false;

    } finally {
      preparandoBonificado = null;
    }
  })();

  return preparandoBonificado;
}

// ============================================================
// MOSTRAR ANUNCIO BONIFICADO
// ============================================================

export async function mostrarBonificado(adUnitId = null) {
  // Si no se proporciona ID, usar el que está preparado o default
  const idAUsar = adUnitId || bonificadoPreparadoId || ADS_CONFIG.REWARDED_VIDAS;

  // Fallback web: simular rewarded en navegador
  if (!esPlataformaNativa()) {
    return new Promise((resolve) => {
      simularRewarded(() => {
        // Simular recompensa
        adState.recompensaGanada = true;
        // Simular cierre del anuncio
        setTimeout(() => {
          if (adState.modoRevivirActivo) {
            // Ejecutar la lógica de recompensa que normalmente estaría en el listener
            procesarRecompensaWeb();
          }
          adState.recompensaGanada = false;
          adState.modoRevivirActivo = null;
          resolve(true);
        }, 500);
      });
    });
  }

  if (!admobDisponible()) {
    mostrarNotificacion(
      "Anuncios no disponibles en este dispositivo"
    );

    return false;
  }

  // NO utilizamos navigator.onLine.
  //
  // adState.hayInternet es el estado de conectividad que utiliza
  // la aplicación. Si AdMob no consigue conectar con sus servidores,
  // la propia preparación del anuncio devolverá el fallo.
  if (!adState.hayInternet) {
    mostrarNotificacion(
      "Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir."
    );

    return false;
  }

  // ----------------------------------------------------------
  // SI NO ESTÁ CARGADO O ES ID DIFERENTE, PREPARAMOS
  // ----------------------------------------------------------

  if (!adState.bonificadoCargado || bonificadoPreparadoId !== idAUsar) {
    mostrarNotificacion("Cargando anuncio...");

    const cargado = await prepararBonificado(idAUsar);

    if (!cargado || !adState.bonificadoCargado) {
      mostrarNotificacion(
        "No se pudo cargar el anuncio. Revisa tu conexión e inténtalo de nuevo."
      );

      return false;
    }
  }

  // ----------------------------------------------------------
  // MOSTRAR
  // ----------------------------------------------------------

  try {
    console.log(`AdMob: mostrando anuncio bonificado (${idAUsar})...`);

    await AdMob.showRewardVideoAd();

    // Una vez mostrado, ya no debemos considerar que tenemos
    // otro anuncio listo.
    adState.bonificadoCargado = false;
    bonificadoPreparadoId = null;

    console.log("AdMob: anuncio bonificado mostrado.");

    return true;

  } catch (error) {
    adState.bonificadoCargado = false;
    bonificadoPreparadoId = null;

    console.error(
      "Error al mostrar el anuncio bonificado:",
      error
    );

    mostrarNotificacion(
      "Error al mostrar el anuncio"
    );

    // Intentamos dejar preparado el siguiente.
    prepararBonificado(idAUsar);

    return false;
  }
}

// Función auxiliar para procesar recompensa en web fallback
async function procesarRecompensaWeb() {
  const modo = adState.modoRevivirActivo;
  if (!modo) return;

  const config = configRevivir[modo];
  if (!config) return;

  // Lógica específica para vidas-generales
  if (modo === 'vidas-generales') {
    const {
      restaurarVidaPorAnuncio,
      actualizarTiempoRegeneracionUI
    } = await import('./Poketype-Guess/vidasGeneralesStorage.js');
    const {
      actualizarIndicadorVidas
    } = await import('./Poketype-Guess/vidaUi.js');
    await restaurarVidaPorAnuncio();
    await actualizarTiempoRegeneracionUI();
    await actualizarIndicadorVidas();
    mostrarNotificacion('¡Vida recuperada!');
    return;
  }

  // Lógica para otros modos de revivir
  ocultarBotonRevivir(modo);
  if (config.btnIntento) {
    config.btnIntento.style.display = "none";
  }
  if (modo === 'campista') {
    const {
      btnVolverDificultadCampista
    } = await import('./Poketype-Guess/config.js');
    if (btnVolverDificultadCampista) {
      btnVolverDificultadCampista.style.display = "none";
    }
  }
  await cuentaRegresivaRevivir(config.mensaje);
  if (modo === 'desafio') {
    const {
      continuarDesafioTrasRevivir
    } = await import('./Poketype-Guess/Desafio del Dia/desafio-dia.js');
    continuarDesafioTrasRevivir();
  } else if (modo === 'reto') {
    const {
      continuarRetoTrasRevivir
    } = await import('./Poketype-Guess/Modo-Estudio/estudio.js');
    continuarRetoTrasRevivir();
  } else {
    ejecutarRevivir(modo);
  }
}

// ============================================================
// CLICK REVIVIR
// ============================================================

export async function clickRevivir(modo) {
  if (!adState.hayInternet) {
    mostrarNotificacion(
      "Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir."
    );

    return;
  }

  cancelarContadorRevivir();

  adState.modoRevivirActivo = modo;
  adState.recompensaGanada = false;

  const config = configRevivir[modo];

  if (config?.btn) {
    config.btn.disabled = true;
  }

  // ----------------------------------------------------------
  // SELECCIONAR ID SEGÚN MODO
  // ----------------------------------------------------------

  let adUnitId;
  if (modo === 'vidas-generales') {
    adUnitId = ADS_CONFIG.REWARDED_VIDAS;
  } else if (modo === 'desafio') {
    adUnitId = ADS_CONFIG.REWARDED_DESAFIO_DIA;
  } else {
    // campista, reto, entrenamiento, etc.
    adUnitId = ADS_CONFIG.REWARDED_ENTRENAMIENTO;
  }

  // ----------------------------------------------------------
  // PAUSAR TIEMPO DEL JUEGO
  // ----------------------------------------------------------

  if (modo !== 'vidas-generales') {
    if (gameState.tiempoCampista) {
      clearInterval(gameState.tiempoCampista);
    }

    if (gameState.tiempoEstudio) {
      clearInterval(gameState.tiempoEstudio);
    }

    if (gameState.tiempoDesafio) {
      clearInterval(gameState.tiempoDesafio);
    }
  }

  // ----------------------------------------------------------
  // MOSTRAR BONIFICADO
  // ----------------------------------------------------------

  const anuncioMostrado = await mostrarBonificado(adUnitId);

  if (config?.btn) {
    config.btn.disabled = false;
  }

  // Si el anuncio no pudo mostrarse, limpiamos el modo activo.
  // De esta manera no queda un modo de revivir antiguo
  // esperando una recompensa que nunca llegará.
  if (!anuncioMostrado) {
    adState.modoRevivirActivo = null;
    adState.recompensaGanada = false;
  }
}

// ============================================================
// PREPARAR INTERSTICIAL
// ============================================================

export async function prepararIntersticial(adUnitId = null) {
  // Si no se proporciona ID, usar el default (desafío del día)
  const idAUsar = adUnitId || ADS_CONFIG.INTERSTITIAL_DESAFIO_DIA;

  if (!admobDisponible() || !adState.hayInternet) {
    intersticialCargado = false;
    intersticialPreparadoId = null;
    return false;
  }

  try {
    intersticialCargado = false;
    intersticialPreparadoId = null;

    console.log(`AdMob: preparando interstitial (${idAUsar})...`);

    await AdMob.prepareInterstitial({
      adId: idAUsar,
      isTesting: false,
    });

    intersticialCargado = true;
    intersticialPreparadoId = idAUsar;

    console.log(`AdMob: interstitial preparado (${idAUsar}).`);

    return true;

  } catch (error) {
    intersticialCargado = false;
    intersticialPreparadoId = null;

    console.error(
      "Error al cargar el intersticial:",
      error
    );

    return false;
  }
}

// ============================================================
// MOSTRAR INTERSTICIAL
// ============================================================

export async function mostrarIntersticial(adUnitId = null) {
  // Si no se proporciona ID, usar el que está preparado o default
  const idAUsar = adUnitId || intersticialPreparadoId || ADS_CONFIG.INTERSTITIAL_DESAFIO_DIA;

  // Fallback web: simular interstitial en navegador
  if (!esPlataformaNativa()) {
    // Pausar tiempo del juego
    if (gameState.tiempoCampista) {
      clearInterval(gameState.tiempoCampista);
    }
    if (gameState.tiempoEstudio) {
      clearInterval(gameState.tiempoEstudio);
    }
    if (gameState.tiempoDesafio) {
      clearInterval(gameState.tiempoDesafio);
    }

    return new Promise((resolve) => {
      simularInterstitial(() => {
        resolve(true);
      });
    });
  }

  if (!admobDisponible() || !adState.hayInternet) {
    return false;
  }

  // ----------------------------------------------------------
  // PAUSAR TIEMPO DEL JUEGO
  // ----------------------------------------------------------

  if (gameState.tiempoCampista) {
    clearInterval(gameState.tiempoCampista);
  }

  if (gameState.tiempoEstudio) {
    clearInterval(gameState.tiempoEstudio);
  }

  if (gameState.tiempoDesafio) {
    clearInterval(gameState.tiempoDesafio);
  }

  // ----------------------------------------------------------
  // PREPARAR SI NO ESTÁ LISTO O ES ID DIFERENTE
  // ----------------------------------------------------------

  if (!intersticialCargado || intersticialPreparadoId !== idAUsar) {
    const cargado = await prepararIntersticial(idAUsar);

    if (!cargado) {
      return false;
    }
  }

  // ----------------------------------------------------------
  // MOSTRAR
  // ----------------------------------------------------------

  try {
    console.log(`AdMob: mostrando interstitial (${idAUsar})...`);

    await AdMob.showInterstitial();

    intersticialCargado = false;
    intersticialPreparadoId = null;

    console.log("AdMob: interstitial mostrado.");

    // Preparar el siguiente intersticial con el mismo ID.
    prepararIntersticial(idAUsar);

    return true;

  } catch (error) {
    console.error(
      "Error al mostrar el intersticial:",
      error
    );

    intersticialCargado = false;
    intersticialPreparadoId = null;

    return false;
  }
}

// ============================================================
// CONTADOR: PERDIDAS ENTRENAMIENTO
// ============================================================

export function incrementarContadorPerdidasEntrenamiento() {
  const contador = parseInt(
    localStorage.getItem(
      CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY
    ) || '0',
    10
  );

  const nuevoContador = contador + 1;

  localStorage.setItem(
    CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY,
    nuevoContador.toString()
  );

  if (nuevoContador >= LIMITE_PERDIDAS_ENTRENAMIENTO) {
    localStorage.setItem(
      CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY,
      '0'
    );

    mostrarIntersticial(ADS_CONFIG.INTERSTITIAL_ENTRENAMIENTO);
  }
}

// ============================================================
// INTERSTICIAL POR NIVEL ESPECÍFICO
// ============================================================

export function verificarNivelEspecificoIntersticial(
  nivelId,
  liga
) {
  const nivelNumero = parseInt(
    nivelId.split('-')[1],
    10
  );

  let mostrarAd = false;

  if (liga === 'campista') {
    mostrarAd =
      nivelNumero === 4 ||
      nivelNumero === 8;

  } else if (liga === 'as') {
    mostrarAd =
      nivelNumero === 4 ||
      nivelNumero === 8 ||
      nivelNumero === 12;

  } else if (liga === 'campeon') {
    mostrarAd =
      nivelNumero === 4 ||
      nivelNumero === 8 ||
      nivelNumero === 12 ||
      nivelNumero === 16;
  }

  if (mostrarAd) {
    mostrarIntersticial(ADS_CONFIG.INTERSTITIAL_NIVELES);
  }
}

// ============================================================
// CONTADOR: GENERADOR
// ============================================================

export function incrementarContadorGenerador() {
  const contador = parseInt(
    localStorage.getItem(CONTADOR_GENERADOR_KEY) || '0',
    10
  );

  const nuevoContador = contador + 1;

  localStorage.setItem(CONTADOR_GENERADOR_KEY, nuevoContador.toString());

  if (nuevoContador >= LIMITE_GENERADOR) {
    localStorage.setItem(CONTADOR_GENERADOR_KEY, '0');
    mostrarIntersticial(ADS_CONFIG.INTERSTITIAL_GENERADOR);
  }
}
