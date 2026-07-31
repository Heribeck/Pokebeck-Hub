import {
  panelReto,
  main,
  dificultad,
  generador as panelGenerador,
  acerca,
  campista,
  desafio,
  gameState,
  timeState,
  dataState,
  tipo1Reto,
  tipo2Reto,
  barraTiempoReto,
  mensajeAciertoReto,
  btnIniciarJuegoReto,
  btnNextReto,
  btnIntentoReto,
  btnJugarDeNuevoReto,
  btnVolverAlMenuReto,
  rondaActualTextoReto,
  hxGanadoTextoReto,
  uiCampistaReto,
  cajaOpcionesPokemonReto,
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

// Estado interno de la sesión de Reto en curso
let sesionActual = null;
let correctPokemonRondaActual = null;
let hxGanadoEnEstaSesion = 0;
let hxPerdidoEnEstaSesion = 0;
let sesionesDesdeUltimoIntersticial = 0;

// Punto de entrada: se llama al elegir una dificultad en el menú de Reto
export async function iniciarReto(mecanica) {
  const hxActual = await obtenerHX();

  if (!esMecanicaDesbloqueada(mecanica, hxActual)) {
    const faltante = hxFaltanteParaDesbloquear(mecanica, hxActual);
    mostrarNotificacion(`Necesitas ${faltante} HX más para desbloquear esta dificultad`);
    return;
  }

  sesionActual = crearSesionDesafio(mecanica);
  hxGanadoEnEstaSesion = 0;
  hxPerdidoEnEstaSesion = 0;

  mostrarPanelReto();
  actualizarTextoProgreso();
  
  tipo1Reto.src = "assets/img/icons/icono-only.png";
  tipo2Reto.src = "assets/img/icons/icono-only.png";
  tipo1Reto.style.backgroundColor = "transparent";
  tipo2Reto.style.backgroundColor = "transparent";

  uiCampistaReto.style.display = 'none';
  mensajeAciertoReto.innerHTML = '';
  cajaOpcionesPokemonReto.innerHTML = '';
  
  btnNextReto.style.display = 'none';
  btnIntentoReto.style.display = 'none';
  btnJugarDeNuevoReto.style.display = 'none';
  btnVolverAlMenuReto.style.display = 'none';

  btnIniciarJuegoReto.style.display = 'flex';
  
  btnIniciarJuegoReto.onclick = () => {
    btnIniciarJuegoReto.style.display = 'none';
    siguienteRonda();
  };
}

function mostrarPanelReto() {
  main.style.display = 'none';
  dificultad.style.display = 'none';
  panelGenerador.style.display = 'none';
  acerca.style.display = 'none';
  campista.style.display = 'none';
  desafio.style.display = 'none';
  panelReto.style.display = 'flex';
}

function actualizarTextoProgreso() {
  rondaActualTextoReto.textContent = `Ronda ${Math.min(sesionActual.rondaActual + 1, 10)} de 10`;
  const balance = hxGanadoEnEstaSesion - hxPerdidoEnEstaSesion;
  hxGanadoTextoReto.textContent = `Balance HX: ${balance > 0 ? '+' : ''}${balance}`;
}

function siguienteRonda() {
  if (sesionActual.rondaActual >= 10) {
    finalizarSesion();
    return;
  }

  btnNextReto.style.display = 'none';
  btnIntentoReto.style.display = 'none';
  mensajeAciertoReto.innerHTML = '';
  cajaOpcionesPokemonReto.innerHTML = '';

  // Reto usa Math.random() normal: no hace falta semilla por fecha,
  // ya que se puede jugar las veces que se quiera.
  const { type1, type2 } = generarTiposDelDia(dataState.pokedex, Math.random);
  gameState.type1ValueReto = type1;
  gameState.type2ValueReto = type2;

  tipo1Reto.src = typesIcono[type1];
  tipo2Reto.src = typesIcono[type2];
  tipo1Reto.style.backgroundColor = coloresTipos[type1];
  tipo2Reto.style.backgroundColor = coloresTipos[type2];

  if (sesionActual.mecanica === 'campista') {
    prepararRondaCampista(type1, type2);
  }

  actualizarTextoProgreso();
}

function prepararRondaCampista(type1, type2) {
  uiCampistaReto.style.display = 'flex';

  const { correctPokemon, opciones } = generarRondaCampista(dataState.pokedex, type1, type2, Math.random);
  correctPokemonRondaActual = correctPokemon;

  let respondida = false;

  opciones.forEach(pokemon => {
    const boton = document.createElement('button');
    boton.textContent = pokemon.name.replaceAll('-', ' ');
    boton.className = 'btn-opcion';
    boton.dataset.name = pokemon.name;
    cajaOpcionesPokemonReto.appendChild(boton);

    boton.addEventListener('click', () => {
      if (respondida) return;
      respondida = true;
      detenerBarraTiempoReto();
      const esCorrecta = pokemon.name === correctPokemonRondaActual.name;
      procesarResultadoDeRonda(esCorrecta);
    });
  });

  iniciarBarraTiempoReto(() => {
    if (respondida) return;
    respondida = true;
    procesarResultadoDeRonda(false);
  }, 3);
}

// Temporizador aislado para Reto (mismo patrón que en el Desafío del Día)
function iniciarBarraTiempoReto(alAgotarseElTiempo, time = 3) {
  barraTiempoReto.style.width = '100%';
  timeState.tiempoRetoLeft = 100;
  clearInterval(gameState.tiempoReto);

  gameState.tiempoReto = setInterval(() => {
    timeState.tiempoRetoLeft -= time;
    barraTiempoReto.style.width = timeState.tiempoRetoLeft + '%';

    if (timeState.tiempoRetoLeft <= 0) {
      clearInterval(gameState.tiempoReto);
      alAgotarseElTiempo();
    }
  }, 100);
}

function detenerBarraTiempoReto() {
  clearInterval(gameState.tiempoReto);
}

// Procesa el resultado de una ronda (correcto/incorrecto), común a las 3 mecánicas
async function procesarResultadoDeRonda(esCorrecta) {
  const paso = procesarRespuesta(sesionActual, esCorrecta);
  const hxQueGanaria = obtenerHXPorAcierto(sesionActual.mecanica);
  const hxGanado = obtenerHXPorAcierto(sesionActual.mecanica);
  const hxPerdido = Math.floor(hxQueGanaria / 2);

  document.querySelectorAll('#opciones-pokemon-reto .btn-opcion').forEach(btn => {
    btn.style.display = 'none';
  });

  if (paso.resultado === 'correcto') {
    soundWin();
    vibrarWin();

    hxGanadoEnEstaSesion += hxGanado;

    mensajeAciertoReto.innerHTML = `¡Correcto! +${hxGanado} HX`;
    btnNextReto.style.display = 'flex';
    btnNextReto.onclick = () => siguienteRonda();

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

  mensajeAciertoReto.innerHTML = `Fallaste. La respuesta correcta era <strong>${nombreRespuestaCorrecta}</strong>.<br><span style="color: #d32f2f;">-${hxPerdido} HX</span>`;
  actualizarTextoProgreso();

  if (paso.sesionTerminada) {
    finalizarSesion();
  } else {
    btnNextReto.style.display = 'flex';
    btnNextReto.onclick = () => siguienteRonda();
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

  mensajeAciertoReto.innerHTML =
    `Reto terminado: ${resultado.aciertos}/10 aciertos.<br>(${hxGanadoEnEstaSesion} ganados - ${hxPerdidoEnEstaSesion} perdidos)<br><br>${mensajeBalance}`;

  btnNextReto.style.display = 'none';
  btnIntentoReto.style.display = 'none';
  cajaOpcionesPokemonReto.innerHTML = '';

  btnJugarDeNuevoReto.style.display = 'flex';
  btnVolverAlMenuReto.style.display = 'flex';

  const mecanicaDeEstaSesion = sesionActual.mecanica;

  btnJugarDeNuevoReto.onclick = () => {
    btnJugarDeNuevoReto.style.display = 'none';
    iniciarReto(mecanicaDeEstaSesion);
  };
  btnVolverAlMenuReto.onclick = () => volverAlMenu();

  sesionActual = null;
  sesionesDesdeUltimoIntersticial++;
  if (sesionesDesdeUltimoIntersticial >= 3) {
    mostrarIntersticial();
    sesionesDesdeUltimoIntersticial = 0;
  }
}
