import { clickRevivir } from '../../admob.js';
import{
  btnIniciarJuegoCampista,
  btnFacilEntrenamiento,
  btnNormalEntrenamiento,
  btnDificilEntrenamiento,
  pMaxCampista,
  pScoreCampista,
  btnNextCampista,
  btnIntentoCampista,
  btnRevivirCampista,
  btnVolverDificultadCampista,
  btnVolverPoketypeDificultad,
  reinicioScoreCampista,
  btnReinicioMaxCampista,
  confirmarReinicioCampista,
  confirmacionCampista,
  cancelarReinicioCampista,
  tipo1Campista,
  tipo2Campista,
  mensajeAciertoCampista,
  scoreState,
  musicaCampista,
  dificultadCampista,
  campista,
  poketype,
  cajaOpcionesPokemon,
  panelJuego,
} from '../config.js';
import { reiniciarUsados } from '../control-repeticion.js';
import { generarTipos } from '../Generador/generador.js';
import { cambiarMusicaModes, reiniciarScoreActual, reiniciarScoreMax, reproducirMusicaPorDificultad, detenerMusica, reproducirSonidoGanar, reproducirSonidoPerder } from '../utils.js';
import { campistaLogica, ocultarBotonRevivir, establecerDificultadEntrenamiento, getDificultadEntrenamientoActual } from './entrenamiento.js';
import { estaDesbloqueado, mostrarMensajeBloqueo, DESBLOQUEOS } from '../sistema-desbloqueos.js';

// Función para actualizar el estado visual de las dificultades
export function actualizarEstadoDificultades() {
  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_FACIL)) {
    btnFacilEntrenamiento.classList.add('tarjeta-dificultad-bloqueada');
  } else {
    btnFacilEntrenamiento.classList.remove('tarjeta-dificultad-bloqueada');
  }

  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_NORMAL)) {
    btnNormalEntrenamiento.classList.add('tarjeta-dificultad-bloqueada');
  } else {
    btnNormalEntrenamiento.classList.remove('tarjeta-dificultad-bloqueada');
  }

  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_DIFICIL)) {
    btnDificilEntrenamiento.classList.add('tarjeta-dificultad-bloqueada');
  } else {
    btnDificilEntrenamiento.classList.remove('tarjeta-dificultad-bloqueada');
  }
}

//Función auxiliar para manejar botón "Siguiente"
function manejarBotonSiguiente(modo, tipo1Element, tipo2Element, logicaFuncion, btnNextElement, mensajeElement) {
  ocultarBotonRevivir(modo);
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnNextElement.style.display = "none";
  mensajeElement.innerHTML = "";
}

//Función auxiliar para manejar botón "Intentar de Nuevo"
function manejarBotonIntento(modo, tipo1Element, tipo2Element, logicaFuncion, btnIntentoElement, mensajeElement) {
  ocultarBotonRevivir(modo);
  reproducirMusicaPorDificultad(getDificultadEntrenamientoActual());
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnIntentoElement.style.display = "none";
  mensajeElement.innerHTML = "";
}

function iniciarEntrenamiento(modo) {
  establecerDificultadEntrenamiento(modo);
  dificultadCampista.style.display = "none";
  campista.style.display = "flex";
  panelJuego.style.display = "flex"
  pMaxCampista.textContent = scoreState.maxCampista;
  
  reproducirMusicaPorDificultad(modo);

  ocultarBotonRevivir("campista");
  btnIniciarJuegoCampista.style.display = "none";
  btnNextCampista.style.display = "none";
  btnIntentoCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML = "";
  cajaOpcionesPokemon.innerHTML = "";

  scoreState.estadoJuego.scoreCampista = 0;
  pScoreCampista.textContent = 0;

  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
}

//Evento del boton "Fácil"
btnFacilEntrenamiento.addEventListener("click", () => {
  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_FACIL)) {
    mostrarMensajeBloqueo(DESBLOQUEOS.ENTRENAMIENTO_FACIL);
    return;
  }
  iniciarEntrenamiento('facil');
});

//Evento del boton "Normal"
btnNormalEntrenamiento.addEventListener("click", () => {
  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_NORMAL)) {
    mostrarMensajeBloqueo(DESBLOQUEOS.ENTRENAMIENTO_NORMAL);
    return;
  }
  iniciarEntrenamiento('normal');
});

//Evento del boton "Difícil"
btnDificilEntrenamiento.addEventListener("click", () => {
  if (!estaDesbloqueado(DESBLOQUEOS.ENTRENAMIENTO_DIFICIL)) {
    mostrarMensajeBloqueo(DESBLOQUEOS.ENTRENAMIENTO_DIFICIL);
    return;
  }
  iniciarEntrenamiento('dificil');
});

//Evento del boton "Iniciar Juego"
btnIniciarJuegoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  btnIniciarJuegoCampista.style.display = "none";
  campistaLogica();
  reiniciarUsados("campista");
  reproducirMusicaPorDificultad(getDificultadEntrenamientoActual());
});

//Evento del boton "Siguiente"
btnNextCampista.addEventListener("click", () => {
  manejarBotonSiguiente("campista", tipo1Campista, tipo2Campista, campistaLogica, btnNextCampista, mensajeAciertoCampista);
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  manejarBotonIntento("campista", tipo1Campista, tipo2Campista, campistaLogica, btnIntentoCampista, mensajeAciertoCampista);
  reiniciarUsados("campista");
  btnVolverDificultadCampista.style.display = "none"
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

//Evento para volver a la selección de dificultad desde el juego
btnVolverDificultadCampista.addEventListener("click", () => {
  campista.style.display = "flex";
  dificultadCampista.style.display = "flex"
  panelJuego.style.display = "none"
  btnVolverDificultadCampista.style.display = "none";
  btnIniciarJuegoCampista.style.display = "flex";
  btnNextCampista.style.display = "none";
  btnIntentoCampista.style.display = "none";
  btnRevivirCampista.style.display = "none";
  cajaOpcionesPokemon.innerHTML = "";
  mensajeAciertoCampista.innerHTML = "";
});

//Evento para volver a Poketype desde la selección de dificultad
btnVolverPoketypeDificultad.addEventListener("click", () => {
  campista.style.display = "none";
  poketype.style.display = "flex";
});