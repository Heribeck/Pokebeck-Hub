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
  inputSelectAs,
  datalistAs,
  mensajeAciertoCampista,
  mensajeAciertoAs,
  cajainput,
  barraTiempoCampeon,
  respuestaInputCampeon,
  gameState,
  timeState,
  adState,
  scoreState
} from './config.js';

// Funciones importadas desde otros archivos
import { ocultarBanner, mostrarBanner, prepararBonificado, clickRevivir } from './admob.js';
import { 
  ocultarBotonRevivir, 
  campistaLogica, 
  AsLogica, 
  validarSelect, 
  logicaNoExisteAs, 
  CampeonLogica, 
  logicaNoExisteCampeon 
} from './modos.js';
import { iniciarGeneracion, generarTipos, iniciarBarraTiempo } from './generador.js';
import { mostrarNotificacion } from './utils.js';

// --- |Evento de boton de "Juego(Dificultades)"
btnJuego.addEventListener("click", () => {
  main.style.display = "none";
  dificultad.style.display = "flex";
  ocultarBanner();
});

// --- |Eventos del apartado "Panel-Campista"| --- //
btnCampista.addEventListener("click", () => {
  dificultad.style.display = "none";
  campista.style.display = "flex";
  pMaxCampista.textContent = scoreState.maxCampista;
  mostrarBanner("TOP_CENTER");
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
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnNextCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnIntentoCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento para mostrar el video bonificado
btnRevivirCampista.addEventListener("click", () => {
  clickRevivir("campista");
});

//Evento para reiniciar el score del campista
reinicioScoreCampista.addEventListener("click", () => {
  estadoJuego.scoreCampista = 0;
  pScoreCampista.textContent = 0;
  mostrarNotificacion("Score Reiniciado");
});

//Evento para aparecer la ventana de "Reiniciar Max"
btnReinicioMaxCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "flex";
});

//Evento de la confirmación sobre la eliminación del score Max
confirmarReinicioCampista.addEventListener("click", () => {
  localStorage.removeItem("maxCampista");
  scoreState.maxCampista = 0;
  pMaxCampista.textContent = 0;
  confirmacionCampista.style.display = "none";
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento para cancelar la eliminación del score Max
cancelarReinicioCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "none";
});

// --- |Eventos del Apartado "Panel-As"| --- //
btnAs.addEventListener("click", () => {
  As.style.display = "flex";
  dificultad.style.display = "none";
  pMaxAs.textContent = scoreState.maxAsDeBatalla;
  mostrarBanner("BOTTOM_CENTER");
});

//Evento del boton "Iniciar Juego" del modo As
btnIniciarJuegoAs.addEventListener("click", () => {
  ocultarBotonRevivir("as");
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
  inputSelectAs.disabled = true;
  validarSelect();
});

//Evento del Boton "No Existe" Del modo As
btnNoExisteAs.addEventListener("click", () => {
  logicaNoExisteAs();
});

//Evento del Boton "Siguiente" Del modo As
btnNextAs.addEventListener("click", () => {
  ocultarBotonRevivir("as");
  btnNextAs.style.display = "none";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  inputSelectAs.disabled = false;
  inputSelectAs.value = "";
  cajaSelect.style.display = "block";
  mensajeAciertoAs.textContent = "";
  datalistAs.innerHTML = "";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del Boton "Volver a intentar" del modo As
btnIntentoAs.addEventListener("click", () => {
  ocultarBotonRevivir("as");
  btnIntentoAs.style.display = "none";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  inputSelectAs.disabled = false;
  inputSelectAs.value = "";
  mensajeAciertoAs.innerHTML = "";
  datalistAs.innerHTML = "";
  cajaSelect.style.display = "block";
  inputSelectAs.style.display = "block";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
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
  confirmacionAs.style.display = "none";
  localStorage.removeItem("maxAsDeBatalla");
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento de la cancelación de reinicio Max As
cancelarReinicioAs.addEventListener("click", () => {
  confirmacionAs.style.display = "none";
});

//Evento de reinico del Score en As
reinicioScoreAs.addEventListener("click", () => {
  estadoJuego.scoreAsDeBatalla = 0;
  pScoreAs.textContent = 0;
  mostrarNotificacion("Score Reiniciado");
});

// --- |Eventos del Apartado "Panel-Campeon"| --- //
btnCampeon.addEventListener("click", () => {
  dificultad.style.display = "none";
  campeon.style.display = "flex";
  pMaxCampeon.textContent = scoreState.maxCampeon;
  mostrarBanner("TOP_CENTER");
});

//Evento Para iniciar el juego en el modo Campeon
btnIniciarJuegoCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnIniciarJuegoCampeon.style.display = "none";
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  gameState.tiempoCampeon = iniciarBarraTiempo(scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, gameState.tiempoCampeon, timeState.tiempoCampeonLeft, "campeon");
});

//Evento para verificar la respuesta del jugador en el modo Campeon
btnRevelarCampeon.addEventListener("click", () => {
  btnRevelarCampeon.style.display = "none";
  btnNoExisteCampeon.style.display = "none";
  btnNextCampeon.style.display = "flex";
  CampeonLogica();
});

//Evento del boton "siguiente" en el modo de Campeon
btnNextCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnNextCampeon.style.display = "none";
  cajainput.style.display = "block";
  btnNoExisteCampeon.style.display = "flex";
  btnRevelarCampeon.style.display = "flex";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  generarTipos(tipo1Campeon, tipo2Campeon);
  gameState.tiempoCampeon = iniciarBarraTiempo(scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, gameState.tiempoCampeon, timeState.tiempoCampeonLeft, "campeon");
});

//Evento del boton "No Existe" en el modo de Campeon
btnNoExisteCampeon.addEventListener("click", () => {
  logicaNoExisteCampeon();
});

//Evento del Boton "Volver a intentarlo" en el modo Campeon
btnIntentoCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnIntentoCampeon.style.display = "none";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";  
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  gameState.tiempoCampeon = iniciarBarraTiempo(scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, gameState.tiempoCampeon, timeState.tiempoCampeonLeft, "campeon");
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
  confirmacionCampeon.style.display = "none";
  localStorage.removeItem("maxCampeon");
  pMaxCampeon.textContent = "0";
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento del Boton "Cancelar Reinicio" en el modo Campeon
cancelarReinicioCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "none";
});

//Evento del Boton "Reiniciar Score" en el modo Campeon
reinicioScoreCampeon.addEventListener("click", () => {
  scoreState.scoreCampeon = 0;
  pScoreCampeon.textContent = scoreState.scoreCampeon;
  mostrarNotificacion("Score Reiniciado");
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
        window.open('https://t.me/heribeck', '_blank');
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
