// Variables importadas desde config.js
import {
  configRevivir,
  conteoBtnRevivir,
  gameState,
  scoreState,
  timeState,
  btnRevivirCampista,
  btnIntentoCampista,
  mensajeAciertoCampista,
  cajaOpcionesPokemon,
  tipo1Campista,
  tipo2Campista,
  pScoreCampista,
  pMaxCampista,
  btnNextCampista,
  btnRevivirAs,
  btnIntentoAs,
  mensajeAciertoAs,
  selectAs,
  cajaSelect,
  btnValidarAs,
  btnNoExisteAs,
  tipo1As,
  tipo2As,
  pScoreAs,
  pMaxAs,
  btnNextAs,
  btnRevivirCampeon,
  btnIntentoCampeon,
  mensajeAciertoCampeon,
  respuestaInputCampeon,
  btnNextCampeon,
  btnNoExisteCampeon,
  btnRevelarCampeon,
  cajainput,
  barraTiempoCampista,
  barraTiempoAs,
  barraTiempoCampeon,
  pScoreCampeon,
  pMaxCampeon,
  tipo1Campeon,
  tipo2Campeon,
  dataState,
  adState,
} from './config.js';

import { esperar } from './config.js';
import { mostrarNotificacion, soundWin, soundLose, cambiarMusicaModes, vibrarWin, vibrarLose, validarSimilitudPalabra, validarTiposPokemon, capitalizarPrimeraLetra, buscarPokemonCorrecto } from './utils.js';
import { generarTipos, iniciarBarraTiempo } from './generador.js';

//Funcion que almacena el score por si el jugador revive
export function guardarScoreAntesDePerder(modo) {
  if (modo === "campista") scoreState.scoreCampistaAntesDePerder = scoreState.estadoJuego.scoreCampista;
  if (modo === "as") scoreState.scoreAsAntesDePerder = scoreState.estadoJuego.scoreAsDeBatalla;
  if (modo === "campeon") scoreState.scoreCampeonAntesDePerder = scoreState.estadoJuego.scoreCampeon;
}

//Funcion que limpia o reinicia o cancela el contador de 7 segundos del boton Revivir
export function cancelarContadorRevivir() {
  if (timeState.intervaloContadorRevivir) {
    clearInterval(timeState.intervaloContadorRevivir);
    timeState.intervaloContadorRevivir = null;
  }
}

//Funcion que oculta el boton Revivir
export function ocultarBotonRevivir(modo) {
  cancelarContadorRevivir();
  const config = configRevivir[modo];
  if (!config) return;
  config.btn.style.display = "none";
  config.btn.disabled = false;
}

//Funcion que muestra el boton Revivir e inicia el conteo de 7 segundos
export function mostrarBotonRevivir(modo) {
  const config = configRevivir[modo];
  if (!config) return;

  cancelarContadorRevivir();
  adState.modoRevivirActivo = modo;
  config.btn.style.display = "flex";
  config.btn.disabled = false;

  let segundos = conteoBtnRevivir;
  config.btn.innerHTML = `Revivir Viendo un Video (${segundos})<i class="fa-solid fa-film" style="margin-left: 10px;"></i>`;

  timeState.intervaloContadorRevivir = setInterval(() => {
    segundos--;
    if (segundos <= 0) {
      ocultarBotonRevivir(modo);
      return;
    }
    config.btn.innerHTML = `Revivir Viendo un Video (${segundos})<i class="fa-solid fa-film" style="margin-left: 10px;"></i>`;
  }, 1000);
}

//Contador de segundos despues del bonificado
export async function cuentaRegresivaRevivir(elementoMensaje) {
  for (const numero of [3, 2, 1]) {
    elementoMensaje.innerHTML = `<span class="cuenta-revivir">${numero}</span>`;
    await esperar(1000);
  }
  elementoMensaje.innerHTML = "";
}

//Funcion que se ejecuta cuando el jugador ha revivido dependiendo de cada modo
export function ejecutarRevivir(modo) {
  if (modo === "campista") {
    scoreState.estadoJuego.scoreCampista = scoreState.scoreCampistaAntesDePerder;
    pScoreCampista.textContent = scoreState.estadoJuego.scoreCampista;
    btnRevivirCampista.style.display = "none";
    btnIntentoCampista.style.display = "none";
    mensajeAciertoCampista.innerHTML = "";
    cajaOpcionesPokemon.innerHTML = "";
    timeState.tiempoCampistaLeft = 100;
    generarTipos(tipo1Campista, tipo2Campista);
    campistaLogica();
    mostrarNotificacion("¡Revivido! Sigue jugando");
    vibrarWin();
    cambiarMusicaModes(musicaCampista);
    return;
  }

  if (modo === "as") {
    scoreState.estadoJuego.scoreAsDeBatalla = scoreState.scoreAsAntesDePerder;
    pScoreAs.textContent = scoreState.estadoJuego.scoreAsDeBatalla;
    btnRevivirAs.style.display = "none";
    btnIntentoAs.style.display = "none";
    mensajeAciertoAs.innerHTML = "";
    if (selectAs.tomselect) {
        selectAs.tomselect.clear();
    }
    selectAs.value = "";
    cajaSelect.style.display = "block";
    btnValidarAs.style.display = "flex";
    btnNoExisteAs.style.display = "flex";
    timeState.tiempoAsDeBatallaLeft = 100;
    generarTipos(tipo1As, tipo2As);
    AsLogica();
    mostrarNotificacion("¡Revivido! Sigue jugando");
    vibrarWin();
    cambiarMusicaModes(musicaAs);
    return;
  }

  if (modo === "campeon") {
    scoreState.estadoJuego.scoreCampeon = scoreState.scoreCampeonAntesDePerder;
    pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;
    btnRevivirCampeon.style.display = "none";
    btnIntentoCampeon.style.display = "none";
    mensajeAciertoCampeon.innerHTML = "";
    respuestaInputCampeon.value = "";
    respuestaInputCampeon.disabled = false;
    cajainput.style.display = "block";
    btnRevelarCampeon.style.display = "flex";
    btnNoExisteCampeon.style.display = "flex";
    timeState.tiempoCampeonLeft = 100;
    generarTipos(tipo1Campeon, tipo2Campeon);
    iniciarBarraTiempoCampeon();
    mostrarNotificacion("¡Revivido! Sigue jugando");
    vibrarWin();
    cambiarMusicaModes(musicaCampeon);
  }
}

//Funcion de toda la logica de juego del modo Campista
export async function campistaLogica(){
    const pokemonesValidos = dataState.pokedex.filter(pokemon => 
        validarTiposPokemon(pokemon, gameState.type1Value, gameState.type2Value)
    );
    console.log(pokemonesValidos);

    if(pokemonesValidos.length === 0){
      generarTipos(tipo1Campista, tipo2Campista);
      campistaLogica();
      console.log("No hay pokemones con esa combinación");
      return;
    }
        
    console.log(pokemonesValidos.map(p => p.name));

    const correctPokemon = pokemonesValidos[Math.floor(Math.random() * pokemonesValidos.length)];
    console.log(correctPokemon.name);
    
    const wrongOptions = [];
    while(wrongOptions.length < 3){
        const randomPokemon = dataState.pokedex[Math.floor(Math.random() * dataState.pokedex.length)];
        const isCorrect = randomPokemon.name === correctPokemon.name;
        const alreadyExists = wrongOptions.some(p => p.name === randomPokemon.name);
        const hasBothTypes = validarTiposPokemon(randomPokemon, gameState.type1Value, gameState.type2Value);
            
        if(!isCorrect && !alreadyExists && !hasBothTypes){
            wrongOptions.push(randomPokemon);
        }
    }
    console.log(wrongOptions.map(p => p.name));

    const allOptions = [correctPokemon, ...wrongOptions].sort(() => Math.random() - 0.5);
    let answered = false;
    
    gameState.tiempoCampista = iniciarBarraTiempo(
        scoreState.estadoJuego, "scoreCampista", pScoreCampista, btnIntentoCampista, 
        barraTiempoCampista, mensajeAciertoCampista, 3, null, null, null, 
        gameState.tiempoCampista, timeState.tiempoCampistaLeft, "campista", correctPokemon.name
    );

    allOptions.forEach(pokemon => {
        const button = document.createElement("button");
        button.textContent = pokemon.name.replaceAll("-"," ");
        button.className = "btn-opcion";
        button.dataset.name = pokemon.name;
        cajaOpcionesPokemon.appendChild(button);
        
        button.addEventListener('click', () => {
            if(answered) return;
            answered = true;
            clearInterval(gameState.tiempoCampista);
            
            if (pokemon.name === correctPokemon.name) {
                soundWin();
                vibrarWin();
                mensajeAciertoCampista.textContent = "¡Felicidades Sigue Sumando!";
                scoreState.estadoJuego.scoreCampista++;
                pScoreCampista.textContent = scoreState.estadoJuego.scoreCampista;

                if (scoreState.estadoJuego.scoreCampista > scoreState.maxCampista) {
                    scoreState.maxCampista = scoreState.estadoJuego.scoreCampista;
                    localStorage.setItem("maxCampista", scoreState.maxCampista);
                }
                pMaxCampista.textContent = scoreState.maxCampista;

                document.querySelectorAll(".btn-opcion").forEach(btn => btn.style.display = "none");
                btnNextCampista.style.display = "flex";

            } else {
              guardarScoreAntesDePerder("campista");
              mostrarBotonRevivir("campista");
              soundLose();
              vibrarLose();
              mensajeAciertoCampista.innerHTML = "Has Perdido.<br>La respuesa correcta era <strong>" + capitalizarPrimeraLetra(correctPokemon.name) + "</strong>";
              scoreState.estadoJuego.scoreCampista = 0;
              pScoreCampista.textContent = scoreState.estadoJuego.scoreCampista;
              btnIntentoCampista.style.display = "flex";
              document.querySelectorAll(".btn-opcion").forEach(btn => btn.style.display = "none");
            }
        });
    });
}   

//Funcion que crea el listado de los pokemones para el Modo AsDeBatalla
export function AsLogica() {
    gameState.pokemonesValidos = dataState.pokedex.filter(pokemon => pokemon.types.includes(gameState.type1Value));
    const pokemonesName = gameState.pokemonesValidos.map(p => p.name).sort();
    
    if (selectAs.tomselect) {
        selectAs.tomselect.destroy();
    }
    
    selectAs.innerHTML = "";
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona un Pokémon";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectAs.appendChild(defaultOption);
    
    pokemonesName.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name.replaceAll("-", " ");
      selectAs.appendChild(option);
    });
    
    new TomSelect(selectAs, {
        create: false,
        sortField: { field: "text", direction: "asc" },
        maxOptions: 1000,
        render: {
            option: function(data, escape) {
                return '<div class="option">' + escape(data.text) + '</div>';
            }
        }
    });
    
   const pokemonCorrect = buscarPokemonCorrecto(dataState.pokedex, gameState.type1Value, gameState.type2Value);

    if (pokemonCorrect){
      gameState.tiempoAsDeBatalla = iniciarBarraTiempo(
          scoreState.estadoJuego, "scoreAsDeBatalla", pScoreAs, btnIntentoAs, 
          barraTiempoAs, mensajeAciertoAs, 0.7, btnNoExisteAs, btnValidarAs, cajaSelect, 
          gameState.tiempoAsDeBatalla, timeState.tiempoAsDeBatallaLeft, "as", pokemonCorrect.name
      );
      console.log(pokemonCorrect);
    }else {
      gameState.tiempoAsDeBatalla = iniciarBarraTiempo(
          scoreState.estadoJuego, "scoreAsDeBatalla", pScoreAs, btnIntentoAs, 
          barraTiempoAs, mensajeAciertoAs, 0.7, btnNoExisteAs, btnValidarAs, cajaSelect, 
          gameState.tiempoAsDeBatalla, timeState.tiempoAsDeBatallaLeft, "as", null
      );
      console.log("No se encontró el pokemon correcto");
    }
}

//Funcion que valida la seleccion del usuario en el modo As
export function validarSelect() {
    gameState.selectedPokemon = selectAs.tomselect ? selectAs.tomselect.getValue() : selectAs.value;

    if (gameState.selectedPokemon === "") {
      console.log("No se seleccionó ningún pokemon");
      mostrarNotificacion("Por favor, selecciona un pokemon");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      if (selectAs.tomselect) {
          selectAs.tomselect.enable();
      }
      return;
    }

    const pokemonSeleccionado = dataState.pokedex.find(p => p.name === gameState.selectedPokemon);

    if(!pokemonSeleccionado) {
      mostrarNotificacion("El pokemon colocado no Existe o esta Mal escrito");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      if (selectAs.tomselect) {
          selectAs.tomselect.enable();
      }
      return;
    }
    
    const ambosTypes = validarTiposPokemon(pokemonSeleccionado, gameState.type1Value, gameState.type2Value);
    
    if (ambosTypes) {
        scoreState.estadoJuego.scoreAsDeBatalla++;
        pScoreAs.textContent = scoreState.estadoJuego.scoreAsDeBatalla;
        btnNextAs.style.display = "flex";
        mensajeAciertoAs.textContent = "¡Correcto! Sumas a tu racha.";
        soundWin();
        vibrarWin();
        clearInterval(gameState.tiempoAsDeBatalla);
        if (scoreState.estadoJuego.scoreAsDeBatalla > scoreState.maxAsDeBatalla) {
          scoreState.maxAsDeBatalla = scoreState.estadoJuego.scoreAsDeBatalla;
          localStorage.setItem("maxAsDeBatalla", scoreState.maxAsDeBatalla);
          pMaxAs.textContent = scoreState.maxAsDeBatalla;
        }
    }else {
        guardarScoreAntesDePerder("as");
        scoreState.estadoJuego.scoreAsDeBatalla = 0;
        pScoreAs.textContent = scoreState.estadoJuego.scoreAsDeBatalla;
        if (selectAs.tomselect) {
            selectAs.tomselect.clear();
        }
        btnIntentoAs.style.display = "flex";
        mostrarBotonRevivir("as");
        soundLose();
        vibrarLose();
        mensajeAciertoAs.innerHTML = "¡Incorrecto! <br/><strong>" + capitalizarPrimeraLetra(gameState.selectedPokemon) + "</strong> no tiene esa combinación de tipos.";
        clearInterval(gameState.tiempoAsDeBatalla);
    }
}

//Funcion que valida si no existe el pokemon con la combinacion de tipos en el modo As
export function logicaNoExisteAs() {
    const existeAlguno = dataState.pokedex.some(pokemon => 
        validarTiposPokemon(pokemon, gameState.type1Value, gameState.type2Value)
    );

    const correctPokemon = buscarPokemonCorrecto(dataState.pokedex, gameState.type1Value, gameState.type2Value);

    if(!existeAlguno){
        mensajeAciertoAs.textContent = "Bien Visto no hay pokemon con esa combinación!";
        scoreState.estadoJuego.scoreAsDeBatalla++;
        pScoreAs.textContent = scoreState.estadoJuego.scoreAsDeBatalla;
        clearInterval(gameState.tiempoAsDeBatalla);
        soundWin();
        vibrarWin();
        btnNextAs.style.display = "flex";
        btnValidarAs.style.display = "none";
        btnNoExisteAs.style.display = "none";
        cajaSelect.style.display = "none";
        if (scoreState.estadoJuego.scoreAsDeBatalla > scoreState.maxAsDeBatalla) {
          scoreState.maxAsDeBatalla = scoreState.estadoJuego.scoreAsDeBatalla;
          localStorage.setItem("maxAsDeBatalla", scoreState.maxAsDeBatalla);
          pMaxAs.textContent = scoreState.maxAsDeBatalla;
        }
    }else {
      guardarScoreAntesDePerder("as");
      mensajeAciertoAs.innerHTML = "¡Si hay Pokemon! <br/> <strong>" + capitalizarPrimeraLetra(correctPokemon.name) + "</strong> tiene esa combinación de Tipos!";
      scoreState.estadoJuego.scoreAsDeBatalla = 0;
      pScoreAs.textContent = scoreState.estadoJuego.scoreAsDeBatalla;
      btnIntentoAs.style.display = "flex";
      mostrarBotonRevivir("as");
      soundLose();
      vibrarLose();
      clearInterval(gameState.tiempoAsDeBatalla);
      btnValidarAs.style.display = "none";
      btnNoExisteAs.style.display = "none";
      cajaSelect.style.display = "none";
    }
}

//Función para validar la respuesta del usuario en el modo Campeon
export function CampeonLogica() {
  const pokemonSeleccionado = respuestaInputCampeon.value.trim().toLowerCase();

  const existe = dataState.pokedex.some(pokemon => pokemon.name === pokemonSeleccionado);

  const pokemonCorrecto = dataState.pokedex.find(pokemon => validarSimilitudPalabra(pokemonSeleccionado, pokemon.name, 70));

  const pokemonCorrectoSinValidar = dataState.pokedex.find(pokemon => pokemon.name === pokemonSeleccionado);

  if (pokemonCorrectoSinValidar) {
    console.log("este es el pokemon sin validar", pokemonCorrectoSinValidar)
  }

  const esCorrecto = pokemonCorrectoSinValidar ? validarTiposPokemon(pokemonCorrectoSinValidar, gameState.type1Value, gameState.type2Value) : pokemonCorrecto ? validarTiposPokemon(pokemonCorrecto, gameState.type1Value, gameState.type2Value) : false;

  if (esCorrecto) {
    scoreState.estadoJuego.scoreCampeon++;
    pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;

    if (existe){
      mensajeAciertoCampeon.innerHTML = "¡Correcto! Sumas a tu racha"
    }
    else if (pokemonSeleccionado !== pokemonCorrecto.name) {
      mensajeAciertoCampeon.innerHTML = "¡Es valido! <br/> (Seguro Quisiste decir : <strong>" + capitalizarPrimeraLetra(pokemonCorrecto.name) + "</strong>)";
    }

    respuestaInputCampeon.disabled = true;
    clearInterval(gameState.tiempoCampeon);        
    soundWin();
    vibrarWin();
    btnNextCampeon.style.display = "flex";
    if (scoreState.estadoJuego.scoreCampeon > scoreState.maxCampeon) {
      scoreState.maxCampeon = scoreState.estadoJuego.scoreCampeon;
      localStorage.setItem("maxCampeon", scoreState.maxCampeon);
      pMaxCampeon.textContent = scoreState.maxCampeon;
    }
  }else{
    guardarScoreAntesDePerder("campeon");
    btnIntentoCampeon.style.display = "flex";
    mostrarBotonRevivir("campeon");
    btnNextCampeon.style.display = "none";
    respuestaInputCampeon.disabled = true;

    if (!esCorrecto){
      const existe = dataState.pokedex.some(pokemon => pokemon.name === pokemonSeleccionado);
      scoreState.estadoJuego.scoreCampeon = 0;
      pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;

      if (existe){
        mensajeAciertoCampeon.innerHTML = "¡Piensalo bien!<br/> ⚠️El pokemon <strong>" + capitalizarPrimeraLetra(pokemonSeleccionado) + "</strong> no tiene esa combinación!⚠️";
      }
      else if (pokemonSeleccionado !== pokemonCorrecto.name) {
        mensajeAciertoCampeon.innerHTML = "¿Seguro quisiste decir <strong>" + capitalizarPrimeraLetra(pokemonCorrecto.name) + "</strong>?" + "<br/>" + "Ese pokemon no tiene esa combinación!";
      }
    }

    clearInterval(gameState.tiempoCampeon);
    soundLose();
    vibrarLose();
  }
}

//Función que valida si el input está vacío en el modo Campeon
export function seleccionadoVacio(){

  const pokemonSeleccionado = respuestaInputCampeon.value.trim().toLowerCase();
  const pokemonCorrecto = dataState.pokedex.find(pokemon => 
    validarSimilitudPalabra(pokemonSeleccionado,pokemon.name,70)
  );

  if (pokemonSeleccionado === "") {
    mostrarNotificacion("Por favor, selecciona un pokemon");
    btnNextCampeon.style.display = "none";
    btnRevelarCampeon.style.display = "flex";
    btnNoExisteCampeon.style.display = "flex";
    respuestaInputCampeon.disabled = false;
    return true;
  }

  if(!pokemonCorrecto) {
    console.log("El pokemon seleccionado no existe");
    mostrarNotificacion("El pokemon colocado no Existe");
    btnNextCampeon.style.display = "none";
    btnRevelarCampeon.style.display = "flex";
    btnNoExisteCampeon.style.display = "flex";
    respuestaInputCampeon.disabled = false;
    return true;
  }
  return false;
}

//Función que inicia la barra de tiempo en el modo Campeon
export function iniciarBarraTiempoCampeon() {
  const pokemonCorrect = buscarPokemonCorrecto(dataState.pokedex, gameState.type1Value, gameState.type2Value);

  if (pokemonCorrect){
    gameState.tiempoCampeon = iniciarBarraTiempo(
        scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, 
        barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, 
        cajainput, gameState.tiempoCampeon, timeState.tiempoCampeonLeft, "campeon", pokemonCorrect.name
    );
  } else {
    gameState.tiempoCampeon = iniciarBarraTiempo(
        scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, 
        barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, 
        cajainput, gameState.tiempoCampeon, timeState.tiempoCampeonLeft, "campeon", null
    );
  } 
}

//Funcion de la logica del boton "No Existe" en el modo Campeon
export function logicaNoExisteCampeon() {
    const existeAlguno = dataState.pokedex.some(pokemon => 
        validarTiposPokemon(pokemon, gameState.type1Value, gameState.type2Value)
    );

    const correctPokemon = buscarPokemonCorrecto(dataState.pokedex, gameState.type1Value, gameState.type2Value);

    if(!existeAlguno){
        mensajeAciertoCampeon.innerHTML = "Bien Visto no hay pokemon con esa combinación!";
        scoreState.estadoJuego.scoreCampeon++;
        pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;
        clearInterval(gameState.tiempoCampeon);
        soundWin();
        vibrarWin();
        btnNextCampeon.style.display = "flex";
        btnRevelarCampeon.style.display = "none";
        btnNoExisteCampeon.style.display = "none";
        cajainput.style.display = "none";
        if (scoreState.estadoJuego.scoreCampeon > scoreState.maxCampeon) {
          scoreState.maxCampeon = scoreState.estadoJuego.scoreCampeon;
          localStorage.setItem("maxCampeon", scoreState.maxCampeon);
          pMaxCampeon.textContent = scoreState.maxCampeon;
        }
    }else {
      guardarScoreAntesDePerder("campeon");
      mensajeAciertoCampeon.innerHTML = "¡Si Hay pokemon! <br/> <strong>" + capitalizarPrimeraLetra(correctPokemon.name) + "</strong> tiene esa combinación de Tipos!";
      scoreState.estadoJuego.scoreCampeon = 0;
      pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;
      btnIntentoCampeon.style.display = "flex";
      mostrarBotonRevivir("campeon");
      soundLose();
      vibrarLose();
      clearInterval(gameState.tiempoCampeon);
      btnRevelarCampeon.style.display = "none";
      btnNoExisteCampeon.style.display = "none";
      cajainput.style.display = "none";
    }
}
