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
  cajaOpcionesPokemon,
} from '../config.js';
import { reiniciarUsados } from '../control-repeticion.js';
import { generarTipos } from '../Generador/generador.js';
import { cambiarMusicaModes, reiniciarScoreActual, reiniciarScoreMax } from '../utils.js';
import { campistaLogica, ocultarBotonRevivir, establecerDificultadEntrenamiento } from './entrenamiento.js';

//Función auxiliar para manejar botón "Siguiente"
function manejarBotonSiguiente(modo, tipo1Element, tipo2Element, logicaFuncion, btnNextElement, mensajeElement) {
  ocultarBotonRevivir(modo);
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnNextElement.style.display = "none";
  mensajeElement.innerHTML = "";
}

//Función auxiliar para manejar botón "Intentar de Nuevo"
function manejarBotonIntento(modo, tipo1Element, tipo2Element, logicaFuncion, btnIntentoElement, mensajeElement, musica) {
  ocultarBotonRevivir(modo);
  cambiarMusicaModes(musica);
  generarTipos(tipo1Element, tipo2Element);
  logicaFuncion();
  btnIntentoElement.style.display = "none";
  mensajeElement.innerHTML = "";
}

function iniciarEntrenamiento(modo) {
  establecerDificultadEntrenamiento(modo);
  dificultadCampista.style.display = "none";
  campista.style.display = "flex";
  pMaxCampista.textContent = scoreState.maxCampista;
  cambiarMusicaModes(musicaCampista);

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
  iniciarEntrenamiento('facil');
});

//Evento del boton "Normal"
btnNormalEntrenamiento.addEventListener("click", () => {
  iniciarEntrenamiento('normal');
});

//Evento del boton "Difícil"
btnDificilEntrenamiento.addEventListener("click", () => {
  iniciarEntrenamiento('dificil');
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