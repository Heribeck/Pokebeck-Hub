// Variables importadas desde config.js
import {
  idBanner,
  idBonificado,
  eventosBonificado,
  adState,
  configRevivir,
  idIntersticial,
  CONTADOR_SELECCION_DIFICULTAD_KEY,
  CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY,
  CONTADOR_REPETICIONES_NIVEL_PREFIX,
  LIMITE_SELECCION_DIFICULTAD,
  LIMITE_PERDIDAS_ENTRENAMIENTO,
  LIMITE_REPETICIONES_NIVEL,
  gameState,
} from './Poketype-Guess/config.js';

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

// Evita que se ejecuten varias cargas del bonificado al mismo tiempo.
let preparandoBonificado = null;

// Promesa utilizada para esperar el evento real de "cargado".
let resolverCargaBonificado = null;

// Timeout de seguridad para evitar quedarse esperando indefinidamente.
let timeoutCargaBonificado = null;


// ============================================================
// FUNCION AUXILIAR: COMPROBAR ADMOB
// ============================================================

function admobDisponible() {
  return Capacitor.isPluginAvailable('AdMob');
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

    // ----------------------------------------------------------
    // LISTENERS
    // ----------------------------------------------------------
    // Los registramos ANTES de preparar cualquier anuncio.
    // Así evitamos perder eventos de carga.
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // PREPARAR ANUNCIOS
    // ----------------------------------------------------------

    await mostrarBanner("TOP_CENTER");

    await prepararIntersticial();

    // Preparamos también el bonificado desde el inicio.
    // Así el primer clic de revivir no tiene que empezar
    // la carga desde cero.
    prepararBonificado();

  } catch (error) {
    console.error("Error al inicializar AdMob:", error);
  }
}


// ============================================================
// MOSTRAR BANNER
// ============================================================

export async function mostrarBanner(posicionBanner) {
  if (!admobDisponible()) return;

  if (!adState.hayInternet) return;

  const settingsAdMob = {
    adId: idBanner,
    adSize: "ADAPTIVE_BANNER",
    position: posicionBanner,
    margin: 0,
    isTesting: false
  };

  try {
    await AdMob.showBanner(settingsAdMob);

    adState.bannerVisible = true;
    adState.bannerPendiente = false;

    console.log("Banner mostrado");

  } catch (error) {
    console.error("Error al mostrar banner:", error);
  }
}


// ============================================================
// OCULTAR BANNER
// ============================================================

export async function ocultarBanner() {
  if (!admobDisponible()) return;

  try {
    await AdMob.removeBanner();

    adState.bannerVisible = false;

  } catch (error) {
    console.error("Error al ocultar banner:", error);
  }
}


// ============================================================
// PREPARAR BONIFICADO
// ============================================================

export async function prepararBonificado() {
  if (!admobDisponible() || !adState.hayInternet) {
    adState.bonificadoCargado = false;
    return false;
  }

  // Si ya está cargado, no hacemos otra petición.
  if (adState.bonificadoCargado) {
    return true;
  }

  // Si ya hay una carga en progreso, esperamos esa misma carga.
  if (preparandoBonificado) {
    return preparandoBonificado;
  }

  preparandoBonificado = (async () => {
    try {
      adState.bonificadoCargado = false;

      console.log("AdMob: preparando anuncio bonificado...");

      // Comenzamos la preparación.
      await AdMob.prepareRewardVideoAd({
        adId: idBonificado,
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
        console.log("AdMob: video bonificado confirmado como cargado.");
        return true;
      }

      console.warn(
        "AdMob: prepareRewardVideoAd terminó pero el anuncio no confirmó carga."
      );

      adState.bonificadoCargado = false;

      return false;

    } catch (error) {
      adState.bonificadoCargado = false;

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

export async function mostrarBonificado() {
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
  // SI NO ESTÁ CARGADO, PREPARAMOS
  // ----------------------------------------------------------

  if (!adState.bonificadoCargado) {
    mostrarNotificacion("Cargando anuncio...");

    const cargado = await prepararBonificado();

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
    console.log("AdMob: mostrando anuncio bonificado...");

    await AdMob.showRewardVideoAd();

    // Una vez mostrado, ya no debemos considerar que tenemos
    // otro anuncio listo.
    adState.bonificadoCargado = false;

    console.log("AdMob: anuncio bonificado mostrado.");

    return true;

  } catch (error) {
    adState.bonificadoCargado = false;

    console.error(
      "Error al mostrar el anuncio bonificado:",
      error
    );

    mostrarNotificacion(
      "Error al mostrar el anuncio"
    );

    // Intentamos dejar preparado el siguiente.
    prepararBonificado();

    return false;
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

  const anuncioMostrado = await mostrarBonificado();

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

export async function prepararIntersticial() {
  if (!admobDisponible() || !adState.hayInternet) {
    intersticialCargado = false;
    return false;
  }

  try {
    intersticialCargado = false;

    await AdMob.prepareInterstitial({
      adId: idIntersticial,
      isTesting: false,
    });

    intersticialCargado = true;

    return true;

  } catch (error) {
    intersticialCargado = false;

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

export async function mostrarIntersticial() {
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
  // PREPARAR SI NO ESTÁ LISTO
  // ----------------------------------------------------------

  if (!intersticialCargado) {
    const cargado = await prepararIntersticial();

    if (!cargado) {
      return false;
    }
  }

  // ----------------------------------------------------------
  // MOSTRAR
  // ----------------------------------------------------------

  try {
    await AdMob.showInterstitial();

    intersticialCargado = false;

    // Preparar el siguiente intersticial.
    prepararIntersticial();

    return true;

  } catch (error) {
    console.error(
      "Error al mostrar el intersticial:",
      error
    );

    intersticialCargado = false;

    return false;
  }
}


// ============================================================
// CONTADOR: SELECCIÓN DE DIFICULTAD
// ============================================================

export function incrementarContadorSeleccionDificultad() {
  const contador = parseInt(
    localStorage.getItem(
      CONTADOR_SELECCION_DIFICULTAD_KEY
    ) || '0',
    10
  );

  const nuevoContador = contador + 1;

  localStorage.setItem(
    CONTADOR_SELECCION_DIFICULTAD_KEY,
    nuevoContador.toString()
  );

  if (nuevoContador >= LIMITE_SELECCION_DIFICULTAD) {
    localStorage.setItem(
      CONTADOR_SELECCION_DIFICULTAD_KEY,
      '0'
    );

    mostrarIntersticial();
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

    mostrarIntersticial();
  }
}


// ============================================================
// CONTADOR: REPETICIONES POR NIVEL
// ============================================================

export function incrementarContadorRepeticionesNivel(nivelId) {
  const key =
    CONTADOR_REPETICIONES_NIVEL_PREFIX + nivelId;

  const contador = parseInt(
    localStorage.getItem(key) || '0',
    10
  );

  const nuevoContador = contador + 1;

  localStorage.setItem(
    key,
    nuevoContador.toString()
  );

  if (nuevoContador >= LIMITE_REPETICIONES_NIVEL) {
    localStorage.setItem(key, '0');

    mostrarIntersticial();
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
    mostrarIntersticial();
  }
}
