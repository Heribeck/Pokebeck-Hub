import {
  panelEstudio,
  main,
  generador as panelGenerador,
  acerca,
  campista,
  desafio,
  gameState,
  timeState,
  dataState,
  tipo1Estudio,
  tipo2Estudio,
  barraTiempoEstudio,
  mensajeAciertoEstudio,
  btnIniciarJuegoEstudio,
  btnNextEstudio,
  btnIntentoEstudio,
  btnJugarDeNuevoEstudio,
  btnVolverAlMenuEstudio,
  rondaActualTextoEstudio,
  hxGanadoTextoEstudio,
  uiCampistaEstudio,
  cajaOpcionesPokemonEstudio,
  typesIcono,
  coloresTipos,
} from '../config.js';

import { mostrarNotificacion, soundWin, soundLose, vibrarWin, vibrarLose, capitalizarPrimeraLetra, buscarPokemonCorrecto, validarTiposPokemon, validarSimilitudPalabra, volverAlMenu } from '../utils.js';
import { generarTiposDelDia, generarRondaCampista } from '../Desafio del Dia/desafio-generador.js';
import { crearSesionDesafio, procesarRespuesta, calcularResultadoFinal, rechazarRevivir } from '../Desafio del Dia/desafio-motor.js';
import { esMecanicaDesbloqueada, hxFaltanteParaDesbloquear, obtenerHXPorAcierto } from '../hx-sistema.js';
import { obtenerHX, sumarHX } from '../hx-storage.js';
import { mostrarIntersticial } from '../../admob.js';
import { mostrarCelebracion } from '../../celebracion.js';

// Estado interno de la sesión de Estudio en curso
let sesionActual = null;
let correctPokemonRondaActual = null;
let hxGanadoEnEstaSesion = 0;
let hxPerdidoEnEstaSesion = 0;
let sesionesDesdeUltimoIntersticial = 0;

// Punto de entrada: se llama al elegir una dificultad en el menú de Estudio
export async function iniciarEstudio(mecanica) {
  const hxActual = await obtenerHX();

  if (!esMecanicaDesbloqueada(mecanica, hxActual)) {
    const faltante = hxFaltanteParaDesbloquear(mecanica, hxActual);
    mostrarNotificacion(`Necesitas ${faltante} HX más para desbloquear esta dificultad`);
    return;
  }

  sesionActual = crearSesionDesafio(mecanica);
  hxGanadoEnEstaSesion = 0;
  hxPerdidoEnEstaSesion = 0;

  mostrarPanelEstudio();
  actualizarTextoProgreso();
  
  tipo1Estudio.src = "assets/img/icons/icono-only.png";
  tipo2Estudio.src = "assets/img/icons/icono-only.png";
  tipo1Estudio.style.backgroundColor = "transparent";
  tipo2Estudio.style.backgroundColor = "transparent";

  uiCampistaEstudio.style.display = 'none';
  mensajeAciertoEstudio.innerHTML = '';
  cajaOpcionesPokemonEstudio.innerHTML = '';
  
  btnNextEstudio.style.display = 'none';
  btnIntentoEstudio.style.display = 'none';
  btnJugarDeNuevoEstudio.style.display = 'none';
  btnVolverAlMenuEstudio.style.display = 'none';

  btnIniciarJuegoEstudio.style.display = 'flex';
  
  btnIniciarJuegoEstudio.onclick = () => {
    btnIniciarJuegoEstudio.style.display = 'none';
    siguienteRonda();
  };
}

function mostrarPanelEstudio() {
  main.style.display = 'none';
  panelGenerador.style.display = 'none';
  acerca.style.display = 'none';
  campista.style.display = 'none';
  desafio.style.display = 'none';
  panelEstudio.style.display = 'flex';
}

function actualizarTextoProgreso() {
  rondaActualTextoEstudio.textContent = `Ronda ${Math.min(sesionActual.rondaActual + 1, 10)} de 10`;
  const balance = hxGanadoEnEstaSesion - hxPerdidoEnEstaSesion;
  hxGanadoTextoEstudio.textContent = `Balance HX: ${balance > 0 ? '+' : ''}${balance}`;
}

function siguienteRonda() {
  if (sesionActual.rondaActual >= 10) {
    finalizarSesion();
    return;
  }

  btnNextEstudio.style.display = 'none';
  btnIntentoEstudio.style.display = 'none';
  mensajeAciertoEstudio.innerHTML = '';
  cajaOpcionesPokemonEstudio.innerHTML = '';

  // Estudio usa Math.random() normal: no hace falta semilla por fecha,
  // ya que se puede jugar las veces que se quiera.
  const { type1, type2 } = generarTiposDelDia(dataState.pokedex, Math.random);
  gameState.type1ValueEstudio = type1;
  gameState.type2ValueEstudio = type2;

  tipo1Estudio.src = typesIcono[type1];
  tipo2Estudio.src = typesIcono[type2];
  tipo1Estudio.style.backgroundColor = coloresTipos[type1];
  tipo2Estudio.style.backgroundColor = coloresTipos[type2];

  if (sesionActual.mecanica === 'campista') {
    prepararRondaCampista(type1, type2);
  }

  actualizarTextoProgreso();
}

function prepararRondaCampista(type1, type2) {
  uiCampistaEstudio.style.display = 'flex';

  const { correctPokemon, opciones } = generarRondaCampista(dataState.pokedex, type1, type2, Math.random);
  correctPokemonRondaActual = correctPokemon;

  let respondida = false;

  opciones.forEach(pokemon => {
    const boton = document.createElement('button');
    boton.textContent = pokemon.name.replaceAll('-', ' ');
    boton.className = 'btn-opcion';
    boton.dataset.name = pokemon.name;
    cajaOpcionesPokemonEstudio.appendChild(boton);

    boton.addEventListener('click', () => {
      if (respondida) return;
      respondida = true;
      detenerBarraTiempoEstudio();
      const esCorrecta = pokemon.name === correctPokemonRondaActual.name;
      procesarResultadoDeRonda(esCorrecta);
    });
  });

  iniciarBarraTiempoEstudio(() => {
    if (respondida) return;
    respondida = true;
    procesarResultadoDeRonda(false);
  }, 3);
}

// Temporizador aislado para Estudio (mismo patrón que en el Desafío del Día)
function iniciarBarraTiempoEstudio(alAgotarseElTiempo, time = 3) {
  barraTiempoEstudio.style.width = '100%';
  timeState.tiempoEstudioLeft = 100;
  clearInterval(gameState.tiempoEstudio);

  gameState.tiempoEstudio = setInterval(() => {
    timeState.tiempoEstudioLeft -= time;
    barraTiempoEstudio.style.width = timeState.tiempoEstudioLeft + '%';

    if (timeState.tiempoEstudioLeft <= 0) {
      clearInterval(gameState.tiempoEstudio);
      alAgotarseElTiempo();
    }
  }, 100);
}

function detenerBarraTiempoEstudio() {
  clearInterval(gameState.tiempoEstudio);
}

// Procesa el resultado de una ronda (correcto/incorrecto), común a las 3 mecánicas
async function procesarResultadoDeRonda(esCorrecta) {
  const paso = procesarRespuesta(sesionActual, esCorrecta);
  const hxQueGanaria = obtenerHXPorAcierto(sesionActual.mecanica);
  const hxGanado = obtenerHXPorAcierto(sesionActual.mecanica);
  const hxPerdido = Math.floor(hxQueGanaria / 2);

  document.querySelectorAll('#opciones-pokemon-Estudio .btn-opcion').forEach(btn => {
    btn.style.display = 'none';
  });

  if (paso.resultado === 'correcto') {
    soundWin();
    vibrarWin();

    hxGanadoEnEstaSesion += hxGanado;

    mensajeAciertoEstudio.innerHTML = `¡Correcto! +${hxGanado} HX`;
    btnNextEstudio.style.display = 'flex';
    btnNextEstudio.onclick = () => siguienteRonda();

    actualizarTextoProgreso();

    if (paso.sesionTerminada) {
      finalizarSesion();
    }
    return;
  }

  let sesionTerminada = paso.sesionTerminada;
  if (paso.resultado === "fallo_pendiente_revivir"){
    const resultado = rechazarRevivir(sesionActual);
    sesionTerminada = resultado.sesionTerminada;
  }

  soundLose();
  vibrarLose();

  hxPerdidoEnEstaSesion += hxPerdido;

  const nombreRespuestaCorrecta = correctPokemonRondaActual
  ? capitalizarPrimeraLetra(correctPokemonRondaActual.name)
  : 'Ninguno (no existía esa combinación)';

  mensajeAciertoEstudio.innerHTML = `Fallaste. La respuesta correcta era <strong>${nombreRespuestaCorrecta}</strong>.<br><span style="color: #d32f2f;">-${hxPerdido} HX</span>`;
  actualizarTextoProgreso();

  if (paso.sesionTerminada) {
    finalizarSesion();
  } else {
    btnNextEstudio.style.display = 'flex';
    btnNextEstudio.onclick = () => siguienteRonda();
  }
}

// Se llama cuando la sesión de 10 rondas terminó
async function finalizarSesion() {
  const resultado = calcularResultadoFinal(sesionActual);

  let balanceFinal = hxGanadoEnEstaSesion - hxPerdidoEnEstaSesion;
  let mensajeBalance = "";

  const hxPorRonda = obtenerHXPorAcierto(sesionActual.mecanica);
  const puntuacionPerfecta = hxPorRonda * 10

  if (balanceFinal > 0) {
    if (hxGanadoEnEstaSesion === puntuacionPerfecta){
      mostrarCelebracion("¡Puntuación Perfecta!")
      balanceFinal += puntuacionPerfecta;
      mensajeBalance = `<span style="color: #43a047;">⚡ ¡Increible!<br/> Bono por Puntuación Perfecta: ${puntuacionPerfecta} HX <br/> Ganaste en Total <strong>${balanceFinal} HX <strong/> </span>`;
      await sumarHX(balanceFinal);
    } else {
      mensajeBalance = `<span style="color: #43a047;">⚡ Balance positivo: ganaste ${balanceFinal} HX limpios en total.</span>`;}
      await sumarHX(balanceFinal);

  } else if (balanceFinal < 0) {
    mensajeBalance = `<span style="color: #d32f2f;">⚠️ Balance negativo: perdiste ${Math.abs(balanceFinal)} HX en total.</span>`;
    await sumarHX(balanceFinal);

  } else {
    mensajeBalance = `<span style="color: #ff9800;">⚖️ Balance neutro: no ganaste ni perdiste HX.</span>`;
  }

  mensajeAciertoEstudio.innerHTML =
    `Estudio terminado: ${resultado.aciertos}/10 aciertos.<br>(${hxGanadoEnEstaSesion} ganados - ${hxPerdidoEnEstaSesion} perdidos)<br><br>${mensajeBalance}`;

  btnNextEstudio.style.display = 'none';
  btnIntentoEstudio.style.display = 'none';
  cajaOpcionesPokemonEstudio.innerHTML = '';

  btnJugarDeNuevoEstudio.style.display = 'flex';
  btnVolverAlMenuEstudio.style.display = 'flex';

  const mecanicaDeEstaSesion = sesionActual.mecanica;

  btnJugarDeNuevoEstudio.onclick = () => {
    btnJugarDeNuevoEstudio.style.display = 'none';
    iniciarEstudio(mecanicaDeEstaSesion);
  };
  btnVolverAlMenuEstudio.onclick = () => volverAlMenu();

  sesionActual = null;
  sesionesDesdeUltimoIntersticial++;
  if (sesionesDesdeUltimoIntersticial >= 3) {
    mostrarIntersticial();
    sesionesDesdeUltimoIntersticial = 0;
  }
}
