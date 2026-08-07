// Orquestador del Modo Estudio (Ligas de Maestría): conecta nivel-motor.js
// (corazones + evaluación), la receta de cada nivel (registro-niveles.js),
// la economía de HX y las vidas generales.

import {
  panelEstudio,
  main,
  generador as panelGenerador,
  acerca,
  campista,
  desafio,
  ligas,
  gameState,
  timeState,
  dataState,
  tipo1Estudio,
  tipo2Estudio,
  barraTiempoEstudio,
  mensajeAciertoEstudio,
  btnNextEstudio,
  btnIntentoEstudio,
  btnVolverLigasEstudio,
  btnJugarDeNuevoEstudio,
  btnVolverAlMenuEstudio,
  rondaActualTextoEstudio,
  hxGanadoTextoEstudio,
  uiCampistaEstudio,
  cajaOpcionesPokemonEstudio,
  typesIcono,
  coloresTipos,
  hxGlobal,
  hxGlobalPoketype,
} from "../config.js";

import {
  mostrarNotificacion,
  soundWin,
  soundLose,
  vibrarWin,
  vibrarLose,
  capitalizarPrimeraLetra,
  validarTiposPokemon,
  volverAlMenu,
} from "../utils.js";
import {
  crearIntentoNivel,
  procesarRondaNivel,
  calcularResultadoNivel,
} from "./nivel-motor.js";
import { obtenerConfiguracionNivel } from "./registroNiveles.js";
import { tieneHXParaNivel } from "./desbloqueoNiveles.js";
import { obtenerHX, sumarHX } from "../hx-storage.js";
import {
  yaCompletoNivel,
  marcarNivelCompletado,
} from "./progresoNivelesStorage.js";
import {
  obtenerVidasGenerales,
  restarVidaGeneral,
  actualizarCorazonesUI,
} from "../vidasGeneralesStorage.js";

// Estado interno del intento de nivel en curso
let intentoActual = null;
let colaRondas = [];
let indiceRondaActual = 0;
let correctPokemonRondaActual = null;
let nivelIdActual = null;

// Punto de entrada: se llama desde ligas-ui.js al tocar "Iniciar Nivel" en el modal
export async function iniciarNivelEstudio(nivelId) {
  const config = obtenerConfiguracionNivel(nivelId);

  if (!config) {
    mostrarNotificacion("Este nivel todavía está en construcción");
    return;
  }

  const vidasActuales = await obtenerVidasGenerales();
  if (vidasActuales <= 0) {
    mostrarNotificacion(
      "No te quedan vidas. Espera a que se regeneren o mira un anuncio para recuperar una.",
    );
    return;
  }

  const hxActual = await obtenerHX();
  if (!tieneHXParaNivel(config, hxActual)) {
    const faltante = config.hxRequerido - hxActual;
    mostrarNotificacion(
      `Necesitas ${faltante} HX más para desbloquear este nivel`,
    );
    return;
  }

  nivelIdActual = nivelId;
  intentoActual = crearIntentoNivel(config);
  colaRondas = config.generarColaRondas(Math.random);
  indiceRondaActual = 0;

  mostrarPanelEstudio();
  siguienteRonda();
}

function mostrarPanelEstudio() {
  main.style.display = "none";
  panelGenerador.style.display = "none";
  acerca.style.display = "none";
  campista.style.display = "none";
  desafio.style.display = "none";
  ligas.style.display = "none";
  panelEstudio.style.display = "flex";
}

// NOTA: reutilizo "hxGanadoTextoEstudio" para mostrar los corazones del intento
// actual. Si quieres, más adelante renombramos ese elemento a "corazonesTextoEstudio".
function actualizarTextoProgreso() {
  rondaActualTextoEstudio.textContent = `Ronda ${indiceRondaActual + 1} de ${
    colaRondas.length
  }`;

  const llenos = "❤️".repeat(intentoActual.corazonesRestantes);
  const vacios = "🖤".repeat(3 - intentoActual.corazonesRestantes);
  hxGanadoTextoEstudio.textContent = llenos + vacios;
}

function siguienteRonda() {
  if (indiceRondaActual >= colaRondas.length) {
    finalizarNivel();
    return;
  }

  btnNextEstudio.style.display = "none";
  btnIntentoEstudio.style.display = "none";
  mensajeAciertoEstudio.innerHTML = "";
  cajaOpcionesPokemonEstudio.innerHTML = "";

  const { type1, type2 } = colaRondas[indiceRondaActual];
  gameState.type1ValueEstudio = type1;
  gameState.type2ValueEstudio = type2;

  tipo1Estudio.src = typesIcono[type1];
  tipo2Estudio.src = typesIcono[type2];
  tipo1Estudio.style.backgroundColor = coloresTipos[type1];
  tipo2Estudio.style.backgroundColor = coloresTipos[type2];

  prepararOpciones(type1, type2);
  actualizarTextoProgreso();
}

function prepararOpciones(type1, type2) {
  uiCampistaEstudio.style.display = "flex";

  const pokemonesValidos = dataState.pokedex.filter((p) =>
    validarTiposPokemon(p, type1, type2),
  );
  const correctPokemon =
    pokemonesValidos[Math.floor(Math.random() * pokemonesValidos.length)];
  correctPokemonRondaActual = correctPokemon;

  const wrongOptions = [];
  while (wrongOptions.length < 3) {
    const candidato =
      dataState.pokedex[Math.floor(Math.random() * dataState.pokedex.length)];
    const esCorrecto = candidato.name === correctPokemon.name;
    const yaEnLista = wrongOptions.some((p) => p.name === candidato.name);
    const tieneLaMismaCombinacion = validarTiposPokemon(
      candidato,
      type1,
      type2,
    );

    if (!esCorrecto && !yaEnLista && !tieneLaMismaCombinacion) {
      wrongOptions.push(candidato);
    }
  }

  const allOptions = [correctPokemon, ...wrongOptions].sort(
    () => Math.random() - 0.5,
  );
  let respondida = false;

  allOptions.forEach((pokemon) => {
    const boton = document.createElement("button");
    boton.textContent = pokemon.name.replaceAll("-", " ");
    boton.className = "btn-opcion";
    boton.dataset.name = pokemon.name;
    cajaOpcionesPokemonEstudio.appendChild(boton);

    boton.addEventListener("click", () => {
      if (respondida) return;
      respondida = true;
      detenerBarraTiempoEstudio();
      const esCorrecta = pokemon.name === correctPokemon.name;
      procesarResultadoRonda(esCorrecta);
    });
  });

  iniciarBarraTiempoEstudio(() => {
    if (respondida) return;
    respondida = true;
    procesarResultadoRonda(false);
  });
}

// Temporizador aislado para Estudio. Velocidad fija por ahora (el Nivel 1
// dice "sin presión de tiempo"); niveles futuros con cronómetro dinámico
// van a pasar su propia velocidad aquí.
function iniciarBarraTiempoEstudio(alAgotarseElTiempo, velocidad = 1) {
  barraTiempoEstudio.style.width = "100%";
  timeState.tiempoEstudioLeft = 100;
  clearInterval(gameState.tiempoEstudio);

  gameState.tiempoEstudio = setInterval(() => {
    timeState.tiempoEstudioLeft -= velocidad;
    barraTiempoEstudio.style.width = timeState.tiempoEstudioLeft + "%";

    if (timeState.tiempoEstudioLeft <= 0) {
      clearInterval(gameState.tiempoEstudio);
      alAgotarseElTiempo();
    }
  }, 100);
}

function detenerBarraTiempoEstudio() {
  clearInterval(gameState.tiempoEstudio);
}

function procesarResultadoRonda(esCorrecta) {
  cajaOpcionesPokemonEstudio.querySelectorAll(".btn-opcion").forEach((btn) => {
    btn.style.display = "none";
  });

  const paso = procesarRondaNivel(intentoActual, esCorrecta);
  indiceRondaActual++;

  if (esCorrecta) {
    soundWin();
    vibrarWin();
    mensajeAciertoEstudio.textContent = "¡Correcto!";
  } else {
    soundLose();
    vibrarLose();
    const nombreCorrecta = capitalizarPrimeraLetra(
      correctPokemonRondaActual.name,
    );
    mensajeAciertoEstudio.innerHTML = paso.fallido
      ? `Incorrecto. Perdiste todos tus corazones.<br>La respuesta era <strong>${nombreCorrecta}</strong>`
      : `Incorrecto. La respuesta era <strong>${nombreCorrecta}</strong>`;
  }

  actualizarTextoProgreso();

  if (paso.nivelTerminado) {
    finalizarNivel();
  } else {
    btnNextEstudio.style.display = "flex";
    btnNextEstudio.onclick = () => siguienteRonda();
  }
}

async function finalizarNivel() {
  const resultado = calcularResultadoNivel(intentoActual);
  const nivelQueTermino = nivelIdActual;
  const config = obtenerConfiguracionNivel(nivelQueTermino);

  if (resultado.aprobado) {
    const yaLoHabiaCompletadoAntes = await yaCompletoNivel(nivelQueTermino);

    if (yaLoHabiaCompletadoAntes) {
      mensajeAciertoEstudio.innerHTML =
        `🏆 ¡Nivel superado de nuevo! ${resultado.aciertos}/${resultado.totalRondas} aciertos.<br>` +
        `Ya dominas este nivel, no otorga HX adicional.`;
    } else {
      await marcarNivelCompletado(nivelQueTermino);
      const nuevoHX = await sumarHX(config.hxRecompensa);
      obtenerHX()
        .then((hx) => {
          hxGlobal.textContent = `⚡ ${hx} HX`;
          hxGlobalPoketype.textContent = `⚡ ${hx} HX`;
        })
        .catch((e) => console.error(e));
      mensajeAciertoEstudio.innerHTML =
        `🏆 ¡Nivel superado! ${resultado.aciertos}/${resultado.totalRondas} aciertos.<br>` +
        `<span style="color: #43a047;">⚡ +${config.hxRecompensa} HX (Total: ${nuevoHX})</span>`;
    }
  } else {
    const vidasRestantes = await restarVidaGeneral();
    const { actualizarIndicadorVidas } = await import("../vidaUi.js");
    await actualizarIndicadorVidas();
    actualizarCorazonesUI(vidasRestantes);
    mensajeAciertoEstudio.innerHTML =
      `❌ Nivel no superado. ${resultado.aciertos}/${resultado.totalRondas} aciertos.<br>` +
      `<span style="color: #d32f2f;">Perdiste 1 vida general. Te quedan ${vidasRestantes}/3.</span>`;
  }

  btnNextEstudio.style.display = "none";
  btnIntentoEstudio.style.display = "none";
  cajaOpcionesPokemonEstudio.innerHTML = "";

  btnJugarDeNuevoEstudio.style.display = "flex";
  btnVolverLigasEstudio.style.display = "flex";

  btnJugarDeNuevoEstudio.onclick = async () => {
    const vidas = await obtenerVidasGenerales();
    btnJugarDeNuevoEstudio.style.display = "none";
    btnVolverLigasEstudio.style.display = "none";
    if (vidas === 0) {
      btnVolverLigasEstudio.style.display = "flex";
    }
    iniciarNivelEstudio(nivelQueTermino);
  };

  btnVolverLigasEstudio.onclick = () => {
    panelEstudio.style.display = "none";
    ligas.style.display = "flex";
    btnJugarDeNuevoEstudio.style.display = "none";
    btnVolverLigasEstudio.style.display = "none";
    btnVolverAlMenuEstudio.style.display = "none";
  };

  intentoActual = null;
}
