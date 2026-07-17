// Orquestador del Desafío del Día: conecta el motor de sesión (desafio-motor.js),
// el generador con semilla (prng-semilla.js + desafio-generador.js) y el progreso
// persistente (progreso-storage.js) con los elementos reales del DOM.
//
// NOTA: por ahora solo soporta la mecánica "campista" (opción múltiple).
// Las mecánicas "as" y "campeon" se agregan en un paso posterior, siguiendo
// el mismo patrón que aquí se establece.

import {
  desafio,
  main,
  dificultad,
  generador as panelGenerador,
  acerca,
  campista,
  As,
  campeon,
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
  uiAsDesafio,
  uiCampeonDesafio,
  cajaOpcionesPokemonDesafio,
  typesIcono,
  coloresTipos,
} from './config.js';

import { mostrarNotificacion, soundWin, soundLose, vibrarWin, vibrarLose, capitalizarPrimeraLetra } from './utils.js';
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
} from './progreso-storage.js';

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

  const intentosDisponibles = await obtenerIntentosDisponiblesHoy();
  if (intentosDisponibles <= 0) {
    mostrarNotificacion('Ya usaste tus 2 intentos de hoy. ¡Vuelve mañana!');
    return;
  }

  const progreso = await obtenerProgreso();
  const mecanica = obtenerMecanicaSegunRacha(progreso.racha);

  if (mecanica !== 'campista') {
    // TODO: implementar mecánica "as" y "campeon" en un paso posterior.
    // Por ahora, si la racha ya superó los 10 días, forzamos campista para no romper el flujo.
    console.warn(`Mecánica "${mecanica}" aún no implementada, usando "campista" temporalmente.`);
  }

  intentosRestantesAlIniciar = await consumirIntentoDeHoy();

  sesionActual = crearSesionDesafio('campista');
  generadorDelDia = crearGeneradorDelDia();

  mostrarPanelDesafio();
  actualizarTextoProgreso();
  siguienteRonda();
}

// Oculta el resto de paneles y muestra el del Desafío (mismo patrón que los otros modos)
function mostrarPanelDesafio() {
  main.style.display = 'none';
  dificultad.style.display = 'none';
  panelGenerador.style.display = 'none';
  acerca.style.display = 'none';
  campista.style.display = 'none';
  As.style.display = 'none';
  campeon.style.display = 'none';

  desafio.style.display = 'flex';
  uiCampistaDesafio.style.display = 'flex';
  uiAsDesafio.style.display = 'none';
  uiCampeonDesafio.style.display = 'none';
}

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
    manejarRespuestaCampista(null); // null = se acabó el tiempo, cuenta como fallo
  });

  actualizarTextoProgreso();
}

// Temporizador simple y aislado para el Desafío (no reutiliza iniciarBarraTiempo de
// generador.js a propósito: esa función está acoplada al scoreState de los modos
// infinitos, y el Desafío tiene su propio manejo de sesión vía desafio-motor.js)
function iniciarBarraTiempoDesafio(alAgotarseElTiempo) {
  barraTiempoDesafio.style.width = '100%';
  timeState.tiempoDesafioLeft = 100;
  clearInterval(gameState.tiempoDesafio);

  gameState.tiempoDesafio = setInterval(() => {
    timeState.tiempoDesafioLeft -= 3;
    barraTiempoDesafio.style.width = timeState.tiempoDesafioLeft + '%';

    if (timeState.tiempoDesafioLeft <= 0) {
      clearInterval(gameState.tiempoDesafio);
      alAgotarseElTiempo();
    }
  }, 100);
}

function detenerBarraTiempoDesafio() {
  clearInterval(gameState.tiempoDesafio);
}

// Procesa la respuesta del jugador (o null si se agotó el tiempo) para la ronda actual
function manejarRespuestaCampista(nombreSeleccionado) {
  const esCorrecta = nombreSeleccionado === correctPokemonRondaActual.name;
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
  soundLose();
  vibrarLose();
  mensajeAciertoDesafio.innerHTML =
    'Fallaste. La respuesta correcta era <strong>' +
    capitalizarPrimeraLetra(correctPokemonRondaActual.name) +
    '</strong>';

  if (paso.resultado === 'fallo_pendiente_revivir') {
    btnRevivirDesafio.style.display = 'flex';
    btnRevivirDesafio.onclick = () => {
      const { sesionTerminada } = confirmarRevivir(sesionActual);
      if (sesionTerminada) {
        finalizarSesion();
      } else {
        siguienteRonda();
      }
    };

    btnIntentoDesafio.textContent = 'Continuar sin revivir';
    btnIntentoDesafio.style.display = 'flex';
    btnIntentoDesafio.onclick = () => {
      const { sesionTerminada } = rechazarRevivir(sesionActual);
      if (sesionTerminada) {
        finalizarSesion();
      } else {
        siguienteRonda();
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

// Se llama cuando la sesión de 10 rondas terminó: calcula el resultado y actualiza la racha
async function finalizarSesion() {
  const resultado = calcularResultadoFinal(sesionActual);

  if (resultado.aprobado) {
    const progreso = await registrarDesafioAprobado();
    mensajeAciertoDesafio.innerHTML =
      `¡Desafío superado! ${resultado.porcentaje}% de aciertos.<br>🔥 Racha: ${progreso.racha} días`;
  } else if (intentosRestantesAlIniciar <= 0) {
    // Era el último intento disponible de hoy y no aprobó: la racha se reinicia
    await registrarDesafioFallido();
    mensajeAciertoDesafio.innerHTML =
      `No alcanzaste el 70% (sacaste ${resultado.porcentaje}%). Se acabaron tus intentos de hoy. Tu racha se reinició.`;
  } else {
    mensajeAciertoDesafio.innerHTML =
      `No alcanzaste el 70% (sacaste ${resultado.porcentaje}%). Te queda 1 intento más hoy.`;
  }

  btnNextDesafio.style.display = 'none';
  btnIntentoDesafio.style.display = 'none';
  btnRevivirDesafio.style.display = 'none';
  cajaOpcionesPokemonDesafio.innerHTML = '';

  sesionActual = null;
}