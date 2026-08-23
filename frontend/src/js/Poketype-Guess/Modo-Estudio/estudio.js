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
  vistaLigas,
  vistaNivelesLiga,
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
  reproducirMusicaPorLiga,
  detenerMusica,
  reproducirSonidoGanar,
  reproducirSonidoPerder,
  detenerTodoElAudio,
} from "../utils.js";
import { verificarDesbloqueos } from "../sistema-desbloqueos.js";
import { generarTarjetasLigas, mostrarVistaNiveles } from "./ligas-ui.js";
import {
  crearIntentoNivel,
  procesarRondaNivel,
  calcularResultadoNivel,
} from "./nivel-motor.js";
import { obtenerConfiguracionNivel } from "./registroNiveles.js";
import { incrementarContadorRepeticionesNivel, verificarNivelEspecificoIntersticial } from "../../admob.js";
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
import { filtrarPokedexPorGeneracionEstudio } from "./filtroGeneracionEstudio.js";
import { obtenerVelocidadTiempo, calcularVelocidadDinamica } from "./tiempoEstudio.js";

// Estado interno del intento de nivel en curso
let intentoActual = null;
let colaRondas = [];
let pokemonesUsadosEnIntento = new Set();
let combinacionesAgotadasEnIntento = new Set();
let indiceRondaActual = 0;
let posicionColaActual = 0;
let correctPokemonRondaActual = null;
let nivelIdActual = null;
let configActual = null;
let velocidadBase = null;
let rondasTotales = null;
let totalRondasNivel = null;

// Funciones auxiliares para la selección dinámica de rondas

function obtenerPoolFiltradoEstudio() {
  return filtrarPokedexPorGeneracionEstudio(
    dataState.pokedex,
    configActual.filtroGeneracion,
    configActual.filtroEspecial
  );
}

function obtenerClaveCombinacion(type1, type2) {
  // Clave canónica ordenada para evitar duplicados (ghost+grass == grass+ghost)
  const ordenado = [type1, type2].sort();
  return `${ordenado[0]}/${ordenado[1]}`;
}

function obtenerPokemonesDisponiblesParaCombinacion(type1, type2) {
  const poolFiltrado = obtenerPoolFiltradoEstudio();
  const pokemonesValidos = poolFiltrado.filter(pokemon => 
    validarTiposPokemon(pokemon, type1, type2)
  );
  
  if (configActual.repeticion) {
    return pokemonesValidos;
  }
  
  // Si no hay repetición, filtrar los ya usados
  return pokemonesValidos.filter(pokemon =>
    !pokemonesUsadosEnIntento.has(pokemon.name)
  );
}

function obtenerCombinacionesDisponibles() {
  const poolFiltrado = obtenerPoolFiltradoEstudio();
  const combinacionesDisponibles = new Map(); // Map<claveCombinacion, {type1, type2, pokemones}>
  
  for (const pokemon of poolFiltrado) {
    const type1 = pokemon.types[0];
    const type2 = pokemon.types[1] || null;
    
    // Usar la clave canónica directamente, no generar combinaciones duplicadas
    const clave = obtenerClaveCombinacion(type1, type2);
    
    // Verificar si la combinación ya fue procesada
    if (combinacionesDisponibles.has(clave)) {
      continue;
    }
    
    // Verificar si la combinación está agotada
    if (combinacionesAgotadasEnIntento.has(clave)) {
      continue;
    }
    
    // Obtener Pokémon disponibles para esta combinación
    const pokemonesParaCombo = poolFiltrado.filter(p => 
      validarTiposPokemon(p, type1, type2)
    );
    
    // Si no hay repetición, filtrar los ya usados
    const disponibles = configActual.repeticion 
      ? pokemonesParaCombo
      : pokemonesParaCombo.filter(p => !pokemonesUsadosEnIntento.has(p.name));
    
    if (disponibles.length > 0) {
      combinacionesDisponibles.set(clave, {
        type1,
        type2,
        pokemonesDisponibles: disponibles
      });
    }
  }
  
  return Array.from(combinacionesDisponibles.values());
}

function generarCombinacionDisponibleAleatoria() {
  const combinacionesDisponibles = obtenerCombinacionesDisponibles();
  
  if (combinacionesDisponibles.length === 0) {
    console.error('No hay combinaciones disponibles en el pool filtrado');
    return null;
  }
  
  // Elegir aleatoriamente una combinación del conjunto
  const indiceAleatorio = Math.floor(Math.random() * combinacionesDisponibles.length);
  return combinacionesDisponibles[indiceAleatorio];
}

function obtenerOpcionesIncorrectas(correctPokemon, type1, type2) {
  const poolFiltrado = obtenerPoolFiltradoEstudio();
  
  // Obtener todos los candidatos válidos
  const candidatos = poolFiltrado.filter(pokemon => {
    const esCorrecto = pokemon.name === correctPokemon.name;
    const tieneLaMismaCombinacion = validarTiposPokemon(pokemon, type1, type2);
    return !esCorrecto && !tieneLaMismaCombinacion;
  });
  
  // Eliminar duplicados
  const candidatosUnicos = new Map();
  for (const p of candidatos) {
    if (!candidatosUnicos.has(p.name)) {
      candidatosUnicos.set(p.name, p);
    }
  }
  
  // Mezclar y tomar hasta 3
  const candidatosArray = Array.from(candidatosUnicos.values());
  mezclarArray(candidatosArray);
  
  return candidatosArray.slice(0, 3);
}

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
  configActual = config;
  pokemonesUsadosEnIntento = new Set();
  combinacionesAgotadasEnIntento = new Set();
  colaRondas = config.generarColaRondas(Math.random);
  indiceRondaActual = 0;
  posicionColaActual = 0;
  velocidadBase = obtenerVelocidadTiempo(config.tiempo);
  rondasTotales = config.totalRondas;
  totalRondasNivel = config.totalRondas;

  reproducirMusicaPorLiga(config.liga);

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
  rondaActualTextoEstudio.textContent = `Ronda ${indiceRondaActual + 1} de ${totalRondasNivel}`;

  const llenos = "❤️".repeat(intentoActual.corazonesRestantes);
  const vacios = "🖤".repeat(3 - intentoActual.corazonesRestantes);
  hxGanadoTextoEstudio.textContent = llenos + vacios;
}

function buscarSiguienteRondaDisponible() {
  while (posicionColaActual < colaRondas.length) {
    const { type1, type2 } = colaRondas[posicionColaActual];
    const claveCombinacion = obtenerClaveCombinacion(type1, type2);
    
    // Si la combinación ya está agotada, saltarla
    if (combinacionesAgotadasEnIntento.has(claveCombinacion)) {
      console.log(`Combinación agotada en cola: ${type1}/${type2}, saltando`);
      posicionColaActual++;
      continue;
    }
    
    const pokemonesDisponibles = obtenerPokemonesDisponiblesParaCombinacion(type1, type2);
    
    if (pokemonesDisponibles.length === 0) {
      // Marcar como agotada y continuar
      console.log(`Combinación sin Pokémon disponibles: ${type1}/${type2}, marcando como agotada`);
      combinacionesAgotadasEnIntento.add(claveCombinacion);
      posicionColaActual++;
      continue;
    }
    
    // Combinación válida encontrada
    return {
      type1,
      type2,
      pokemonesDisponibles
    };
  }
  
  return null;
}

function siguienteRonda() {
  // Verificar si se han completado todas las rondas configuradas
  if (indiceRondaActual >= totalRondasNivel) {
    finalizarNivel();
    return;
  }
  
  let ronda = buscarSiguienteRondaDisponible();
  
  // Si no hay ronda disponible en la cola, intentar generar una dinámicamente
  if (!ronda) {
    console.log('Fallback dinámico: cola agotada, buscando combinación disponible en pool');
    ronda = generarCombinacionDisponibleAleatoria();
    if (ronda) {
      console.log('Fallback dinámico: combinación elegida', ronda.type1, ronda.type2);
    }
  }
  
  if (!ronda) {
    console.error('No hay combinaciones disponibles en el pool filtrado');
    // Si no hay ninguna combinación disponible, finalizar el nivel
    finalizarNivel();
    return;
  }
  
  const { type1, type2, pokemonesDisponibles } = ronda;
  
  console.log(`Ronda ${indiceRondaActual + 1}/${totalRondasNivel}: ${type1}/${type2}, ${pokemonesDisponibles.length} Pokémon disponibles`);
  
  // Avanzar posición en la cola después de seleccionar una ronda válida
  posicionColaActual++;

  btnNextEstudio.style.display = "none";
  btnIntentoEstudio.style.display = "none";
  mensajeAciertoEstudio.innerHTML = "";
  cajaOpcionesPokemonEstudio.innerHTML = "";

  gameState.type1ValueEstudio = type1;
  gameState.type2ValueEstudio = type2;

  tipo1Estudio.src = typesIcono[type1];
  tipo2Estudio.src = typesIcono[type2];
  tipo1Estudio.style.backgroundColor = coloresTipos[type1];
  tipo2Estudio.style.backgroundColor = coloresTipos[type2];

  prepararOpciones(type1, type2, pokemonesDisponibles);
  actualizarTextoProgreso();
}

function prepararOpciones(type1, type2, pokemonesDisponibles) {
  uiCampistaEstudio.style.display = "flex";

  const correctPokemon = pokemonesDisponibles[Math.floor(Math.random() * pokemonesDisponibles.length)];
  console.log(correctPokemon)
  console.log(pokemonesDisponibles)
  if (!configActual.repeticion){
    pokemonesUsadosEnIntento.add(correctPokemon.name);
  }
  
  correctPokemonRondaActual = correctPokemon;

  const wrongOptions = obtenerOpcionesIncorrectas(correctPokemon, type1, type2);

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

  let velocidad = obtenerVelocidadTiempo(configActual.tiempo);
  
  if (configActual.tiempoDinamico && velocidadBase !== null && rondasTotales !== null) {
    velocidad = calcularVelocidadDinamica(velocidadBase, indiceRondaActual, rondasTotales);
  }

  iniciarBarraTiempoEstudio(() => {
    if (respondida) return;
    respondida = true;
    procesarResultadoRonda(false);
  }, velocidad);
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
  
  // Avanzar contador solo si no se han completado todas las rondas
  if (indiceRondaActual < totalRondasNivel - 1) {
    indiceRondaActual++;
  }

  if (esCorrecta) {
    reproducirSonidoGanar();
    vibrarWin();
    mensajeAciertoEstudio.textContent = "¡Correcto!";
  } else {
    reproducirSonidoPerder();
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
    btnNextEstudio.onclick = () => {
      siguienteRonda();
    };
  }
}

async function finalizarNivel() {
  const resultado = calcularResultadoNivel(intentoActual);
  const nivelQueTermino = nivelIdActual;
  const config = obtenerConfiguracionNivel(nivelQueTermino);
  detenerMusica()

  if (resultado.aprobado) {
    const yaLoHabiaCompletadoAntes = await yaCompletoNivel(nivelQueTermino);

    if (yaLoHabiaCompletadoAntes) {
      mensajeAciertoEstudio.innerHTML =
        `🏆 ¡Nivel superado de nuevo! ${resultado.aciertos}/${resultado.totalRondas} aciertos.<br>` +
        `Ya dominas este nivel, no otorga HX adicional.`;
      // Incrementar contador de repeticiones al completar nivel ya completado
      incrementarContadorRepeticionesNivel(nivelQueTermino);
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
      
      // Verificar desbloqueos
      await verificarDesbloqueos(nivelQueTermino, config.liga);
      
      // Actualizar UI de ligas inmediatamente
      await generarTarjetasLigas();

      // 🔥 4. RE-RENDERIZAR LA LISTA DE NIVELES INMEDIATAMENTE 🔥
      // Esto regenera el HTML del nivel recién desbloqueado en segundo plano
      await mostrarVistaNiveles(config.liga);
      
      // Verificar si es un nivel específico para mostrar intersticial
      verificarNivelEspecificoIntersticial(nivelQueTermino, config.liga);
      
      // Verificar si es campeon-18 y se completó correctamente
      if (nivelQueTermino === "campeon-18" && intentoActual.corazonesRestantes > 0) {
        if (window.victoriaPokeType) {
          window.victoriaPokeType.ejecutarVictoriaDefinitiva();
        }
      }
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
