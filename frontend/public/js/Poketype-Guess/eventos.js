// Elementos del DOM importados desde config.js
import {
  main,
  poketype,
  dificultad,
  generador,
  acerca,
  campista,
  btnPoketype,
  btnReto,
  btnEntrenamiento,
  btnDesafio,
  btnGenerador,
  btnAcerca,
  btnVolverMenuPoketype,
  telegram,
  hxGlobal,
  hxGlobalPoketype,
  rachaTextoPoketype,
  btnCampista,
  btnIniciarJuegoCampista,
  pMaxCampista,
  pScoreCampista,
  btnNextCampista,
  btnIntentoCampista,
  btnRevivirCampista,
  reinicioScoreCampista,
  btnReinicioMaxCampista,
  confirmarReinicioCampista,
  confirmacionCampista,
  cancelarReinicioCampista,
  btnGenerar,
  tipo1Campista,
  tipo2Campista,
  mensajeAciertoCampista,
  adState,
  scoreState,
  musicaCampista,
  sonidoTouch
} from './config.js';

// Funciones importadas desde otros archivos
import { ocultarBanner, prepararBonificado, clickRevivir } from '../admob.js';
import { ocultarBotonRevivir, campistaLogica,} from './Modo Entrenamiento/entrenamiento.js';
import { iniciarGeneracion, generarTipos } from './Generador/generador.js';
import { cambiarMusicaModes, reiniciarScoreActual, reiniciarScoreMax } from './utils.js';
import { iniciarDesafioDelDia } from './Desafio del Dia/desafio-dia.js';
import { reiniciarUsados } from './control-repeticion.js';
import { programarNotificacionDePrueba } from './notificaciones-locales.js';
import { iniciarReto } from './Modo Estudio/estudio.js';

// Variable de estado para diferenciar Reto de Entrenamiento
let modoJuegoSeleccionado = 'entrenamiento'; // 'entrenamiento' o 'reto'

//Función auxiliar para configurar modo de juego
function configurarModo(modoPanel, dificultadPanel, pMaxElement, scoreMaxValue, musica) {
  dificultadPanel.style.display = "none";
  modoPanel.style.display = "flex";
  pMaxElement.textContent = scoreMaxValue;
  cambiarMusicaModes(musica);
}

//Función auxiliar para manejar botón "Siguiente"
function manejarBotonSiguiente(modo, tipo1Element, tipo2Element, logicaFuncion, btnNextElement, mensajeElement, elementosAdicionales = {}) {
  ocultarBotonRevivir(modo);
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnNextElement.style.display = "none";
  mensajeElement.innerHTML = "";

  if (elementosAdicionales.cajaSelect) {
    elementosAdicionales.cajaSelect.style.display = "block";
    if (elementosAdicionales.btnValidar) elementosAdicionales.btnValidar.style.display = "flex";
    if (elementosAdicionales.btnNoExiste) elementosAdicionales.btnNoExiste.style.display = "flex";
  }

  if (elementosAdicionales.cajaInput) {
    elementosAdicionales.cajaInput.style.display = "block";
    if (elementosAdicionales.btnNoExiste) elementosAdicionales.btnNoExiste.style.display = "flex";
    if (elementosAdicionales.btnRevelar) elementosAdicionales.btnRevelar.style.display = "flex";
  }

  if (elementosAdicionales.inputElement) {
    elementosAdicionales.inputElement.value = "";
    elementosAdicionales.inputElement.disabled = false;
  }

  if (elementosAdicionales.selectElement && elementosAdicionales.selectElement.tomselect) {
    elementosAdicionales.selectElement.tomselect.clear();
    elementosAdicionales.selectElement.tomselect.enable();
  }

  if (elementosAdicionales.selectElement) {
    elementosAdicionales.selectElement.value = "";
  }
}

//Función auxiliar para manejar botón "Intentar de Nuevo"
function manejarBotonIntento(modo, tipo1Element, tipo2Element, logicaFuncion, btnIntentoElement, mensajeElement, musica, elementosAdicionales = {}) {
  ocultarBotonRevivir(modo);
  cambiarMusicaModes(musica);
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnIntentoElement.style.display = "none";
  mensajeElement.innerHTML = "";

  if (elementosAdicionales.cajaSelect) {
    elementosAdicionales.cajaSelect.style.display = "block";
    if (elementosAdicionales.btnValidar) elementosAdicionales.btnValidar.style.display = "flex";
    if (elementosAdicionales.btnNoExiste) elementosAdicionales.btnNoExiste.style.display = "flex";
  }

  if (elementosAdicionales.selectElement && elementosAdicionales.selectElement.tomselect) {
    elementosAdicionales.selectElement.tomselect.enable();
    elementosAdicionales.selectElement.tomselect.clear();
  }

  if (elementosAdicionales.selectElement) {
    elementosAdicionales.selectElement.value = "";
  }

  if (elementosAdicionales.cajaInput) {
    elementosAdicionales.cajaInput.style.display = "block";
    elementosAdicionales.btnNoExiste.style.display = "flex";
  }

  if (elementosAdicionales.inputElement) {
    elementosAdicionales.inputElement.value = "";
    elementosAdicionales.inputElement.disabled = false;
  }

  if (elementosAdicionales.btnRevelar) {
    elementosAdicionales.btnRevelar.style.display = "flex";
  }
}

// --- |Evento de boton de "PokeType Guess"|
btnPoketype.addEventListener("click", () => {
  main.style.display = "none";
  poketype.style.display = "flex";
  ocultarBanner();
});

// --- |Evento de boton de "Volver al Menú" desde PokeType|
btnVolverMenuPoketype.addEventListener("click", () => {
  poketype.style.display = "none";
  main.style.display = "flex";
});

// --- |Evento de boton de "Entrenamiento(Dificultades)" desde PokeType|
btnEntrenamiento.addEventListener("click", () => {
  modoJuegoSeleccionado = 'entrenamiento';
  poketype.style.display = "none";
  dificultad.style.display = "flex";
  ocultarBanner();
});

// --- |Evento de boton de "Reto(Dificultades)" desde PokeType|
btnReto.addEventListener("click", () => {
  modoJuegoSeleccionado = 'reto';
  poketype.style.display = "none";
  dificultad.style.display = "flex";
  ocultarBanner();
});

// --- |Evento del Apartado del Desafio Del Dia desde PokeType| -- //
btnDesafio.addEventListener('click', () => {
  iniciarDesafioDelDia()
  ocultarBanner();
});

// --- |Evento del Generador desde PokeType|
btnGenerador.addEventListener("click", () => {
  poketype.style.display = "none";
  generador.style.display = "flex";
});

// --- |Eventos del apartado "Panel-Campista"| --- //
btnCampista.addEventListener("click", () => {
  if (modoJuegoSeleccionado === 'reto') {
    iniciarReto('campista');
  } else {
    configurarModo(campista, dificultad, pMaxCampista, scoreState.maxCampista, musicaCampista);
  }
});

//Evento del boton "Iniciar Juego"
btnIniciarJuegoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  btnIniciarJuegoCampista.style.display = "none";
  campistaLogica();
  reiniciarUsados("campista");
});

//Evento del boton "Siguiente"
btnNextCampista.addEventListener("click", () => {
  manejarBotonSiguiente("campista", tipo1Campista, tipo2Campista, campistaLogica, btnNextCampista, mensajeAciertoCampista);
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  manejarBotonIntento("campista", tipo1Campista, tipo2Campista, campistaLogica, btnIntentoCampista, mensajeAciertoCampista, musicaCampista);
  reiniciarUsados("campista");
});

//Evento para mostrar el video bonificado
btnRevivirCampista.addEventListener("click", () => {
  clickRevivir("campista");
});

//Evento para reiniciar el score del campista
reinicioScoreCampista.addEventListener("click", () => {
  reiniciarScoreActual("scoreCampista", pScoreCampista, scoreState);
});

//Evento para aparecer la ventana de "Reiniciar Max"
btnReinicioMaxCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "flex";
});

//Evento de la confirmación sobre la eliminación del score Max
confirmarReinicioCampista.addEventListener("click", () => {
  reiniciarScoreMax("maxCampista", "maxCampista", pMaxCampista, scoreState, confirmacionCampista);
});

//Evento para cancelar la eliminación del score Max
cancelarReinicioCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "none";
});

// --- |Eventos del Apartado "Generador"| --- //
btnGenerador.addEventListener("click", () => {
  generador.style.display = "flex";
  main.style.display = "none";
});

//Evento del Boton "Generar"
btnGenerar.addEventListener("click", () => {
  iniciarGeneracion();
});

// --- |Eventos del Apartado de "Acerca del Proyecto"| --- //
btnAcerca.addEventListener("click", () => {
  main.style.display = "none";
  acerca.style.display = "flex";
});

//Evento del boton de "Telegram"
telegram.addEventListener("click", () => {
    if (window.Capacitor && window.Capacitor.isNative) {
        window.open('tg://resolve?domain=heribeck', '_system');
    } else {
        window.open('https://t.me/pokebeck', '_blank');
    }
});

// --- |Eventos de para comprobar conexion a internet
window.addEventListener("online", () => {
  adState.hayInternet = true;
  prepararBonificado();
  if (!adState.bannerVisible) {
    adState.bannerPendiente = true;
  }
});

//Evento Offline
window.addEventListener("offline", () => {
  adState.hayInternet = false;
});

//Evento Global sonido de los touch en botones
document.addEventListener("click", (evento) => {
  if (evento.target.tagName === "BUTTON") {
    sonidoTouch.currentTime = 0;
    sonidoTouch.play();
  }
});
