import {
  desafio,
  main,
  generador as panelGenerador,
  acerca,
  campista,
  gameState,
  timeState,
  dataState,
  tipo1Desafio,
  tipo2Desafio,
  barraTiempoDesafio,
  mensajeAciertoDesafio,
  btnNextDesafio,
  btnIntentoDesafio,
  btnRevivirDesafio,
  rondaActualTextoDesafio,
  intentosRestantesTextoDesafio,
  uiCampistaDesafio,
  cajaOpcionesPokemonDesafio,
  typesIcono,
  coloresTipos,
  btnVolverAlMenu,
  btnJugarDeNuevoDesafio,
  musicaCampista,
  rachaTextoPoketype,
  poketype
} from '../config.js';

import { clickRevivir, mostrarIntersticial } from '../../admob.js';
import { mostrarBotonRevivir } from '../Modo Entrenamiento/entrenamiento.js';
import { mostrarNotificacion, soundWin, soundLose, vibrarWin, vibrarLose, capitalizarPrimeraLetra, volverAlMenu, cambiarMusicaModes, detenerTodoElAudio } from '../utils.js';
import { crearGeneradorDelDia } from './prng-semilla.js';
import { generarTiposDelDia, generarRondaCampista } from './desafio-generador.js';
import {
  crearSesionDesafio,
  procesarRespuesta,
  confirmarRevivir,
  rechazarRevivir,
  calcularResultadoFinal,
} from './desafio-motor.js';

import {
  obtenerProgreso,
  obtenerIntentosDisponiblesHoy,
  consumirIntentoDeHoy,
  registrarDesafioAprobado,
  registrarDesafioFallido,
  obtenerMecanicaSegunRacha,
  yaCompletoDesafioHoy,
  verificarRachaVigente,
} from './progreso-storage.js';

import { cancelarNotificacionRacha } from '../notificaciones-locales.js';

// Estado interno de la sesión en curso (vive solo mientras el jugador está en el Desafío)
let sesionActual = null;
let generadorDelDia = null;
let correctPokemonRondaActual = null;
let intentosRestantesAlIniciar = 0;

// Punto de entrada: se llama cuando el jugador toca el botón del Desafío del Día en el menú
export async function iniciarDesafioDelDia() {
  const yaCompleto = await yaCompletoDesafioHoy();
  if (yaCompleto) {
    mostrarNotificacion('Ya completaste el Desafío de hoy. ¡Vuelve mañana!');
    return;
  }

  poketype.style.display = "none";

  const intentosDisponibles = await obtenerIntentosDisponiblesHoy();
  if (intentosDisponibles <= 0) {
    mostrarNotificacion('Ya usaste tus 2 intentos de hoy. ¡Vuelve mañana!');
    return;
  }

  const progreso = await verificarRachaVigente();
  const mecanica = obtenerMecanicaSegunRacha(progreso.racha);
  
  if (mecanica === 'campista') {
    cambiarMusicaModes(musicaCampista)
  }

  intentosRestantesAlIniciar = await consumirIntentoDeHoy();

  sesionActual = crearSesionDesafio(mecanica);
  generadorDelDia = crearGeneradorDelDia();

  mostrarPanelDesafio();
  actualizarTextoProgreso();
  siguienteRonda();
}

// Oculta el resto de paneles y muestra el del Desafío (mismo patrón que los otros modos)
function mostrarPanelDesafio() {
  main.style.display = 'none';
  panelGenerador.style.display = 'none';
  acerca.style.display = 'none';
  campista.style.display = 'none';

  desafio.style.display = 'flex';
  uiCampistaDesafio.style.display = 'flex';
}

//Actualiza el texto en la sesiones y los intentos del dia.
function actualizarTextoProgreso() {
  rondaActualTextoDesafio.textContent = `Ronda ${sesionActual.rondaActual + 1} de 10`;
  intentosRestantesTextoDesafio.textContent = `Intentos hoy: ${intentosRestantesAlIniciar}`;
}

// Genera y muestra la siguiente ronda, o finaliza la sesión si ya se jugaron las 10
function siguienteRonda() {
  if (sesionActual.rondaActual >= 10) {
    finalizarSesion();
    return;
  }

  btnNextDesafio.style.display = 'none';
  btnIntentoDesafio.style.display = 'none';
  btnRevivirDesafio.style.display = 'none';
  mensajeAciertoDesafio.innerHTML = '';
  cajaOpcionesPokemonDesafio.innerHTML = '';

  const { type1, type2 } = generarTiposDelDia(dataState.pokedex, generadorDelDia);
  gameState.type1ValueDesafio = type1;
  gameState.type2ValueDesafio = type2;

  tipo1Desafio.src = typesIcono[type1];
  tipo2Desafio.src = typesIcono[type2];
  tipo1Desafio.style.backgroundColor = coloresTipos[type1];
  tipo2Desafio.style.backgroundColor = coloresTipos[type2];

  if (sesionActual.mecanica === 'campista') {
    prepararRondaCampista(type1, type2);
  }

  actualizarTextoProgreso();
}

function prepararRondaCampista(type1, type2) {
  uiCampistaDesafio.style.display = 'flex';

  const { correctPokemon, opciones } = generarRondaCampista(dataState.pokedex, type1, type2, generadorDelDia);
  correctPokemonRondaActual = correctPokemon;

  let respondida = false;

  opciones.forEach(pokemon => {
    const boton = document.createElement('button');
    boton.textContent = pokemon.name.replaceAll('-', ' ');
    boton.className = 'btn-opcion';
    boton.dataset.name = pokemon.name;
    cajaOpcionesPokemonDesafio.appendChild(boton);

    boton.addEventListener('click', () => {
      if (respondida) return;
      respondida = true;
      detenerBarraTiempoDesafio();
      manejarRespuestaCampista(pokemon.name);
    });
  });

  iniciarBarraTiempoDesafio(() => {
    if (respondida) return;
    respondida = true;
    manejarRespuestaCampista(null);
  }, 3);
}

// Temporizador simple y aislado para el Desafío (no reutiliza iniciarBarraTiempo de generador.js a propósito: esa función está acoplada al scoreState de los modos infinitos, y el Desafío tiene su propio manejo de sesión vía desafio-motor.js)
function iniciarBarraTiempoDesafio(alAgotarseElTiempo, time = 3) {
  barraTiempoDesafio.style.width = '100%';
  timeState.tiempoDesafioLeft = 100;
  clearInterval(gameState.tiempoDesafio);

  gameState.tiempoDesafio = setInterval(() => {
    timeState.tiempoDesafioLeft -= time;
    barraTiempoDesafio.style.width = timeState.tiempoDesafioLeft + '%';

    if (timeState.tiempoDesafioLeft <= 0) {
      clearInterval(gameState.tiempoDesafio);
      detenerTodoElAudio();
      alAgotarseElTiempo();
    }
  }, 100);
}

//Funcion para solamente detener el tiempo
function detenerBarraTiempoDesafio() {
  clearInterval(gameState.tiempoDesafio);
}

// Procesa la respuesta del jugador (o null si se agotó el tiempo) para la ronda actual
function manejarRespuestaCampista(nombreSeleccionado) {
  const esCorrecta = nombreSeleccionado === correctPokemonRondaActual.name;
  procesarResultadoDeRonda(esCorrecta)
}

//Funcion para procesar todo el funcionamiento del resultado en cada ronda
function procesarResultadoDeRonda(esCorrecta){
  const paso = procesarRespuesta(sesionActual, esCorrecta);

  document.querySelectorAll('#opciones-pokemon-desafio .btn-opcion').forEach(btn => {
    btn.style.display = 'none';
  });

  if (paso.resultado === 'correcto') {
    soundWin();
    vibrarWin();
    mensajeAciertoDesafio.textContent = '¡Correcto!';
    btnNextDesafio.style.display = 'flex';
    btnNextDesafio.onclick = () => siguienteRonda();

    if (paso.sesionTerminada) {
      finalizarSesion();
    }
    return;
  }

  // Falló: ofrecer revivir (solo la primera vez en la sesión)
  detenerTodoElAudio();
  soundLose();
  vibrarLose();
  const nombreRespuestaCorrecta = correctPokemonRondaActual
  ? capitalizarPrimeraLetra(correctPokemonRondaActual.name)
  : 'Ninguno (no existía esa combinación)';

  mensajeAciertoDesafio.innerHTML = `Fallaste. La respuesta correcta era <strong>${nombreRespuestaCorrecta}</strong>`;

  if (paso.resultado === 'fallo_pendiente_revivir') {
    mostrarBotonRevivir('desafio');
    btnRevivirDesafio.onclick = () => clickRevivir('desafio');

    btnIntentoDesafio.style.display = 'flex';
    btnIntentoDesafio.onclick = () => {
      const { sesionTerminada } = rechazarRevivir(sesionActual);
      if (sesionTerminada) {
        finalizarSesion();
      } else {
        siguienteRonda();
      }

      if (sesionActual.mecanica === 'campista') {
      cambiarMusicaModes(musicaCampista)      
      } else if (sesionActual.mecanica === 'as') {
      cambiarMusicaModes(musicaAsBatalla)
      } else if (sesionActual.mecanica === 'campeon') {
      cambiarMusicaModes(musicaCampeon)
      }
    };
    return;
  }

  // Ya no tiene revivir disponible: el fallo ya se contó, solo avanza
  if (paso.sesionTerminada) {
    finalizarSesion();
  } else {
    btnNextDesafio.style.display = 'flex';
    btnNextDesafio.onclick = () => siguienteRonda();
  }
}

//Función que maneja la continuación tras usar el revivir(bonificado)
export function continuarDesafioTrasRevivir() {
  const { sesionTerminada } = confirmarRevivir(sesionActual);
  if (sesionTerminada) {
    finalizarSesion();
  } else {
    siguienteRonda();
  }
}

// Se llama cuando la sesión de 10 rondas terminó: calcula el resultado y actualiza la racha
async function finalizarSesion() {
  const resultado = calcularResultadoFinal(sesionActual);

  if (resultado.aprobado) {
    const progreso = await registrarDesafioAprobado();
    cancelarNotificacionRacha();
    mensajeAciertoDesafio.innerHTML =
      `¡Desafío superado! ${resultado.porcentaje}% de aciertos.<br>🔥 Racha: ${progreso.racha} días`;
  } else if (intentosRestantesAlIniciar <= 0) {
    // Era el último intento disponible de hoy y no aprobó: la racha se reinicia
    await registrarDesafioFallido();
    mensajeAciertoDesafio.innerHTML =
      `No alcanzaste el 70% (sacaste ${resultado.porcentaje}%). Se acabaron tus intentos de hoy. Tu racha se reinició.`;
  } else {
    btnJugarDeNuevoDesafio.style.display = 'flex';
    mensajeAciertoDesafio.innerHTML =
      `No alcanzaste el 70% (sacaste ${resultado.porcentaje}%). Te queda 1 intento más hoy.`;
  }

  btnVolverAlMenu.style.display = "flex"
  btnNextDesafio.style.display = 'none';
  btnIntentoDesafio.style.display = 'none';
  btnRevivirDesafio.style.display = 'none';
  cajaOpcionesPokemonDesafio.innerHTML = '';

  btnVolverAlMenu.onclick = () => {
    volverAlMenu();
    btnVolverAlMenu.style.display = "none"
    btnJugarDeNuevoDesafio.style.display = "none"
  }
  btnJugarDeNuevoDesafio.onclick = () => {
    btnJugarDeNuevoDesafio.style.display = 'none';
    btnVolverAlMenu.style.display = "none";
    iniciarDesafioDelDia();
  };

  sesionActual = null;
  mostrarIntersticial();
}

// Actualiza la racha Diaria al momento
export async function actualizarRachaEnMenu() {
  const progreso = await verificarRachaVigente();

  if (rachaTextoPoketype) {
    rachaTextoPoketype.textContent = `🔥 ${progreso.racha} días`;
  }
}