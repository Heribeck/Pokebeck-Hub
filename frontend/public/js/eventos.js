// Elementos del DOM importados desde config.js
import {
  main,
  dificultad,
  generador,
  acerca,
  campista,
  As,
  campeon,
  btnJuego,
  btnGenerador,
  btnAcerca,
  telegram,
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
  btnAs,
  btnIniciarJuegoAs,
  pMaxAs,
  pScoreAs,
  btnNextAs,
  btnIntentoAs,
  btnRevivirAs,
  reinicioScoreAs,
  btnReinicioMaxAs,
  confirmarReinicioAs,
  cancelarReinicioAs,
  btnCampeon,
  btnIniciarJuegoCampeon,
  pMaxCampeon,
  pScoreCampeon,
  btnNextCampeon,
  btnIntentoCampeon,
  btnRevivirCampeon,
  reinicioScoreCampeon,
  btnReinicioMaxCampeon,
  confirmarReinicioCampeon,
  cancelarReinicioCampeon,
  mensajeAciertoCampeon,
  confirmacionCampeon,
  btnValidarAs,
  btnNoExisteAs,
  btnNoExisteCampeon,
  btnRevelarCampeon,
  btnGenerar,
  tipo1Campista,
  tipo2Campista,
  tipo1As,
  tipo2As,
  tipo1Campeon,
  tipo2Campeon,
  cajaSelect,
  selectAs,
  mensajeAciertoCampista,
  mensajeAciertoAs,
  cajainput,
  respuestaInputCampeon,
  adState,
  scoreState,
  confirmacionAs,
  musicaCampista,
  musicaAsBatalla,
  musicaCampeon,
  sonidoTouch,
  btnDesafio,
} from './config.js';

// Funciones importadas desde otros archivos
import { ocultarBanner, prepararBonificado, clickRevivir } from './admob.js';
import { 
  ocultarBotonRevivir, 
  campistaLogica, 
  AsLogica, 
  validarSelect, 
  logicaNoExisteAs, 
  CampeonLogica, 
  logicaNoExisteCampeon, 
  seleccionadoVacio,
  iniciarBarraTiempoCampeon
} from './modos.js';
import { iniciarGeneracion, generarTipos } from './generador.js';
import { cambiarMusicaModes, reiniciarScoreActual, reiniciarScoreMax } from './utils.js';
import { iniciarDesafioDelDia } from './desafio-dia.js';

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

// --- |Evento de boton de "Juego(Dificultades)"
btnJuego.addEventListener("click", () => {
  main.style.display = "none";
  dificultad.style.display = "flex";
  ocultarBanner();
});

// --- |Evento del Apartado del Desafio Del Dia| -- //
btnDesafio.addEventListener('click', () => {
  iniciarDesafioDelDia()
  ocultarBanner();
});

// --- |Eventos del apartado "Panel-Campista"| --- //
btnCampista.addEventListener("click", () => {
  configurarModo(campista, dificultad, pMaxCampista, scoreState.maxCampista, musicaCampista);
});

//Evento del boton "Iniciar Juego"
btnIniciarJuegoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  btnIniciarJuegoCampista.style.display = "none";
  campistaLogica();
});

//Evento del boton "Siguiente"
btnNextCampista.addEventListener("click", () => {
  manejarBotonSiguiente("campista", tipo1Campista, tipo2Campista, campistaLogica, btnNextCampista, mensajeAciertoCampista);
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  manejarBotonIntento("campista", tipo1Campista, tipo2Campista, campistaLogica, btnIntentoCampista, mensajeAciertoCampista, musicaCampista);
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

// --- |Eventos del Apartado "Panel-As"| --- //
btnAs.addEventListener("click", () => {
  configurarModo(As, dificultad, pMaxAs, scoreState.maxAsDeBatalla, musicaAsBatalla);
});

//Evento del boton "Iniciar Juego" del modo As
btnIniciarJuegoAs.addEventListener("click", () => {
  ocultarBotonRevivir("as");
  cambiarMusicaModes(musicaAsBatalla);
  btnIniciarJuegoAs.style.display = "none";
  cajaSelect.style.display = "block";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del Boton "Validar" Del modo As
btnValidarAs.addEventListener("click", () => {
  btnValidarAs.style.display = "none";
  btnNoExisteAs.style.display = "none";
  if (selectAs.tomselect) {
      selectAs.tomselect.disable();
  }
  validarSelect();
});

//Evento del Boton "No Existe" Del modo As
btnNoExisteAs.addEventListener("click", () => {
  logicaNoExisteAs();
});

//Evento del Boton "Siguiente" Del modo As
btnNextAs.addEventListener("click", () => {
  manejarBotonSiguiente("as", tipo1As, tipo2As, AsLogica, btnNextAs, mensajeAciertoAs, {
    cajaSelect,
    btnValidar: btnValidarAs,
    btnNoExiste: btnNoExisteAs,
    selectElement: selectAs
  });
});

//Evento del Boton "Volver a intentar" del modo As
btnIntentoAs.addEventListener("click", () => {
  manejarBotonIntento("as", tipo1As, tipo2As, AsLogica, btnIntentoAs, mensajeAciertoAs, musicaAsBatalla, {
    cajaSelect,
    btnValidar: btnValidarAs,
    btnNoExiste: btnNoExisteAs,
    selectElement: selectAs
  });
});

//Evento para mostrar el video bonificado del modo As
btnRevivirAs.addEventListener("click", () => {
  clickRevivir("as");
});

//Evento del boton "Reiniciar Max" del modo As
btnReinicioMaxAs.addEventListener("click", () => {
  confirmacionAs.style.display = "flex";
});

//Evento de la confirmación de reinicio Max As
confirmarReinicioAs.addEventListener("click", () => {
  reiniciarScoreMax("maxAsDeBatalla", "maxAsDeBatalla", pMaxAs, scoreState, confirmacionAs);
});

//Evento de la cancelación de reinicio Max As
cancelarReinicioAs.addEventListener("click", () => {
  confirmacionAs.style.display = "none";
});

//Evento de reinico del Score en As
reinicioScoreAs.addEventListener("click", () => {
  reiniciarScoreActual("scoreAsDeBatalla", pScoreAs, scoreState);
});

// --- |Eventos del Apartado "Panel-Campeon"| --- //
btnCampeon.addEventListener("click", () => {
  configurarModo(campeon, dificultad, pMaxCampeon, scoreState.maxCampeon, musicaCampeon);
});

//Evento Para iniciar el juego en el modo Campeon
btnIniciarJuegoCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnIniciarJuegoCampeon.style.display = "none";
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  iniciarBarraTiempoCampeon();
});

//Evento para verificar la respuesta del jugador en el modo Campeon
btnRevelarCampeon.addEventListener("click", () => {
  btnRevelarCampeon.style.display = "none";
  btnNoExisteCampeon.style.display = "none";
  btnNextCampeon.style.display = "flex";
  seleccionadoVacio() || CampeonLogica();
});

//Evento del boton "siguiente" en el modo de Campeon
btnNextCampeon.addEventListener("click", () => {
  manejarBotonSiguiente("campeon", tipo1Campeon, tipo2Campeon, iniciarBarraTiempoCampeon, btnNextCampeon, mensajeAciertoCampeon, {
    cajaInput: cajainput,
    btnNoExiste: btnNoExisteCampeon,
    btnRevelar: btnRevelarCampeon,
    inputElement: respuestaInputCampeon
  });
});

//Evento del boton "No Existe" en el modo de Campeon
btnNoExisteCampeon.addEventListener("click", () => {
  logicaNoExisteCampeon();
});

//Evento del Boton "Volver a intentarlo" en el modo Campeon
btnIntentoCampeon.addEventListener("click", () => {
  manejarBotonIntento("campeon", tipo1Campeon, tipo2Campeon, iniciarBarraTiempoCampeon, btnIntentoCampeon, mensajeAciertoCampeon, musicaCampeon, {
    cajaInput: cajainput,
    btnNoExiste: btnNoExisteCampeon,
    btnRevelar: btnRevelarCampeon,
    inputElement: respuestaInputCampeon
  });
});

//Evento para mostrar el video bonificado del modo Campeon
btnRevivirCampeon.addEventListener("click", () => {
  clickRevivir("campeon");
});

//Evento del Boton "Reiniciar Max" en el modo Campeon
btnReinicioMaxCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "flex";
});

//Evento del Boton "Confirmar Reinicio" en el modo Campeon
confirmarReinicioCampeon.addEventListener("click", () => {
  reiniciarScoreMax("maxCampeon", "maxCampeon", pMaxCampeon, scoreState, confirmacionCampeon);
});

//Evento del Boton "Cancelar Reinicio" en el modo Campeon
cancelarReinicioCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "none";
});

//Evento del Boton "Reiniciar Score" en el modo Campeon
reinicioScoreCampeon.addEventListener("click", () => {
  reiniciarScoreActual("scoreCampeon", pScoreCampeon, scoreState);
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
