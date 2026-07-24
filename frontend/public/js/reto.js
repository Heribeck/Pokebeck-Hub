// Orquestador del modo Reto: sesión de 10 rondas, jugable ilimitadamente,
// otorga HX por cada acierto según la mecánica elegida. Reutiliza el mismo
// motor de sesión y generador de rondas que el Desafío del Día, pero con
// Math.random() normal (no hay semilla por fecha, no es "una vez al día").

import {
  panelReto,
  main,
  dificultad,
  generador as panelGenerador,
  acerca,
  campista,
  As,
  campeon,
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
  btnRevivirReto,
  btnJugarDeNuevoReto,
  btnVolverAlMenuReto,
  rondaActualTextoReto,
  hxGanadoTextoReto,
  uiCampistaReto,
  uiAsReto,
  uiCampeonReto,
  cajaOpcionesPokemonReto,
  selectReto,
  btnValidarReto,
  btnNoExisteReto,
  respuestaInputReto,
  btnRevelarReto,
  btnNoExisteCampeonReto,
  typesIcono,
  coloresTipos,
} from './config.js';

import { mostrarNotificacion, soundWin, soundLose, vibrarWin, vibrarLose, capitalizarPrimeraLetra, buscarPokemonCorrecto, validarTiposPokemon, validarSimilitudPalabra, volverAlMenu } from './utils.js';
import { generarTiposDelDia, generarRondaCampista } from './desafio-generador.js';
import { crearSesionDesafio, procesarRespuesta, confirmarRevivir, rechazarRevivir, calcularResultadoFinal } from './desafio-motor.js';
import { esMecanicaDesbloqueada, hxFaltanteParaDesbloquear, obtenerHXPorAcierto } from './hx-sistema.js';
import { obtenerHX, sumarHX } from './hx-storage.js';
import { clickRevivir } from './admob.js';
import { mostrarBotonRevivir, ocultarBotonRevivir } from './modos.js';

// Estado interno de la sesión de Reto en curso
let sesionActual = null;
let correctPokemonRondaActual = null;
let hxGanadoEnEstaSesion = 0;
let hxPerdidoEnEstaSesion = 0;

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
  uiAsReto.style.display = 'none';
  uiCampeonReto.style.display = 'none';
  mensajeAciertoReto.innerHTML = '';
  cajaOpcionesPokemonReto.innerHTML = '';
  
  btnNextReto.style.display = 'none';
  btnIntentoReto.style.display = 'none';
  ocultarBotonRevivir('reto');
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
  As.style.display = 'none';
  campeon.style.display = 'none';
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
  ocultarBotonRevivir('reto');
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
  } else if (sesionActual.mecanica === 'as') {
    prepararRondaAs(type1, type2);
  } else if (sesionActual.mecanica === 'campeon') {
    prepararRondaCampeon(type1, type2);
  }

  actualizarTextoProgreso();
}

function prepararRondaCampista(type1, type2) {
  uiCampistaReto.style.display = 'flex';
  uiAsReto.style.display = 'none';
  uiCampeonReto.style.display = 'none';

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
  });
}

function prepararRondaAs(type1, type2) {
  uiCampistaReto.style.display = 'none';
  uiAsReto.style.display = 'flex';
  btnValidarReto.style.display = 'flex';
  btnNoExisteReto.style.display = 'flex';
  uiCampeonReto.style.display = 'none';

  const nombresValidos = dataState.pokedex
    .filter(p => p.types.includes(type1))
    .map(p => p.name)
    .sort();

  if (selectReto.tomselect) {
    selectReto.tomselect.destroy();
  }
  selectReto.innerHTML = '';

  const opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.textContent = 'Selecciona un Pokémon';
  opcionDefault.disabled = true;
  opcionDefault.selected = true;
  selectReto.appendChild(opcionDefault);

  nombresValidos.forEach(name => {
    const opcion = document.createElement('option');
    opcion.value = name;
    opcion.textContent = name.replaceAll('-', ' ');
    selectReto.appendChild(opcion);
  });

  new TomSelect(selectReto, {
    create: false,
    sortField: { field: 'text', direction: 'asc' },
    maxOptions: 1000,
  });

  correctPokemonRondaActual = buscarPokemonCorrecto(dataState.pokedex, type1, type2);

  iniciarBarraTiempoReto(() => {
    procesarResultadoDeRonda(false);
  });
}

function prepararRondaCampeon(type1, type2) {
  uiCampistaReto.style.display = 'none';
  uiAsReto.style.display = 'none';
  uiCampeonReto.style.display = 'flex';
  btnRevelarReto.style.display = 'flex';
  btnNoExisteCampeonReto.style.display = 'flex';

  respuestaInputReto.value = '';
  respuestaInputReto.disabled = false;

  correctPokemonRondaActual = buscarPokemonCorrecto(dataState.pokedex, type1, type2);

  iniciarBarraTiempoReto(() => {
    procesarResultadoDeRonda(false);
  });
}

// Temporizador aislado para Reto (mismo patrón que en el Desafío del Día)
function iniciarBarraTiempoReto(alAgotarseElTiempo) {
  barraTiempoReto.style.width = '100%';
  timeState.tiempoRetoLeft = 100;
  clearInterval(gameState.tiempoReto);

  gameState.tiempoReto = setInterval(() => {
    timeState.tiempoRetoLeft -= 1;
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

    btnValidarReto.style.display = 'none';
  btnNoExisteReto.style.display = 'none';
  btnRevelarReto.style.display = 'none';
  btnNoExisteCampeonReto.style.display = 'none';
  document.querySelectorAll('#opciones-pokemon-reto .btn-opcion').forEach(btn => {
    btn.style.display = 'none';
  });

  if (paso.resultado === 'correcto') {
    soundWin();
    vibrarWin();

    const hxGanado = obtenerHXPorAcierto(sesionActual.mecanica);
    await sumarHX(hxGanado);
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

  soundLose();
  vibrarLose();

  const hxQueGanaria = obtenerHXPorAcierto(sesionActual.mecanica);
  const hxPerdido = Math.floor(hxQueGanaria / 2);
  hxPerdidoEnEstaSesion += hxPerdido;
  await sumarHX(-hxPerdido);
  actualizarTextoProgreso();

  const nombreRespuestaCorrecta = correctPokemonRondaActual
    ? capitalizarPrimeraLetra(correctPokemonRondaActual.name)
    : 'Ninguno (no existía esa combinación)';

  mensajeAciertoReto.innerHTML = `Fallaste. La respuesta correcta era <strong>${nombreRespuestaCorrecta}</strong>.<br><span style="color: #d32f2f;">-${hxPerdido} HX</span>`;

  if (paso.resultado === 'fallo_pendiente_revivir') {
    mostrarBotonRevivir('reto');
    btnRevivirReto.onclick = () => clickRevivir('reto');

    btnIntentoReto.textContent = 'Continuar sin revivir';
    btnIntentoReto.style.display = 'flex';
    btnIntentoReto.onclick = () => {
      const { sesionTerminada } = rechazarRevivir(sesionActual);
      if (sesionTerminada) {
        finalizarSesion();
      } else {
        siguienteRonda();
      }
    };
    return;
  }

  if (paso.sesionTerminada) {
    finalizarSesion();
  } else {
    btnNextReto.style.display = 'flex';
    btnNextReto.onclick = () => siguienteRonda();
  }
}

// Se llama cuando el jugador revivió viendo el anuncio (invocado desde admob.js)
export function continuarRetoTrasRevivir() {
  const { sesionTerminada } = confirmarRevivir(sesionActual);
  if (sesionTerminada) {
    finalizarSesion();
  } else {
    siguienteRonda();
  }
}

// Eventos de As/Campeón (se registran una sola vez, fuera de las funciones)
btnValidarReto.onclick = () => {
  const seleccionado = selectReto.tomselect ? selectReto.tomselect.getValue() : selectReto.value;

  if (!seleccionado) {
    mostrarNotificacion('Por favor, selecciona un Pokémon');
    return;
  }

  const pokemon = dataState.pokedex.find(p => p.name === seleccionado);
  if (!pokemon) {
    mostrarNotificacion('El Pokémon colocado no existe o está mal escrito');
    return;
  }

  detenerBarraTiempoReto();
  const esCorrecta = validarTiposPokemon(pokemon, gameState.type1ValueReto, gameState.type2ValueReto);
  procesarResultadoDeRonda(esCorrecta);
};

btnNoExisteReto.onclick = () => {
  detenerBarraTiempoReto();
  const existeAlguno = dataState.pokedex.some(p =>
    validarTiposPokemon(p, gameState.type1ValueReto, gameState.type2ValueReto)
  );
  procesarResultadoDeRonda(!existeAlguno);
};

btnRevelarReto.onclick = () => {
  const valor = respuestaInputReto.value.trim().toLowerCase();

  if (!valor) {
    mostrarNotificacion('Por favor, escribe un Pokémon');
    return;
  }

  detenerBarraTiempoReto();

  const pokemonExacto = dataState.pokedex.find(p => p.name === valor);
  const pokemonSimilar = dataState.pokedex.find(p => validarSimilitudPalabra(valor, p.name, 70));
  const pokemonEncontrado = pokemonExacto || pokemonSimilar;

  const esCorrecta = pokemonEncontrado
    ? validarTiposPokemon(pokemonEncontrado, gameState.type1ValueReto, gameState.type2ValueReto)
    : false;

  procesarResultadoDeRonda(esCorrecta);
};

btnNoExisteCampeonReto.onclick = () => {
  detenerBarraTiempoReto();
  const existeAlguno = dataState.pokedex.some(p =>
    validarTiposPokemon(p, gameState.type1ValueReto, gameState.type2ValueReto)
  );
  procesarResultadoDeRonda(!existeAlguno);
};

// Se llama cuando la sesión de 10 rondas terminó
async function finalizarSesion() {
  const resultado = calcularResultadoFinal(sesionActual);

  const balanceFinal = hxGanadoEnEstaSesion - hxPerdidoEnEstaSesion;
  let mensajeBalance = "";
  
  if (balanceFinal > 0) {
    mensajeBalance = `<span style="color: #43a047;">⚡ Balance positivo: ganaste ${balanceFinal} HX limpios en total.</span>`;
  } else if (balanceFinal < 0) {
    mensajeBalance = `<span style="color: #d32f2f;">⚠️ Balance negativo: perdiste ${Math.abs(balanceFinal)} HX en total.</span>`;
  } else {
    mensajeBalance = `<span style="color: #ff9800;">⚖️ Balance neutro: no ganaste ni perdiste HX.</span>`;
  }

  mensajeAciertoReto.innerHTML =
    `Reto terminado: ${resultado.aciertos}/10 aciertos.<br>(${hxGanadoEnEstaSesion} ganados - ${hxPerdidoEnEstaSesion} perdidos)<br><br>${mensajeBalance}`;

  btnNextReto.style.display = 'none';
  btnIntentoReto.style.display = 'none';
  ocultarBotonRevivir('reto');
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
}
