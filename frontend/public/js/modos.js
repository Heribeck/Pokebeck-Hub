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
  datalistAs,
  inputSelectAs,
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
import { mostrarNotificacion, soundWin, soundLose, cambiarMusicaModes, vibrarWin, vibrarLose } from './utils.js';
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
    datalistAs.innerHTML = "";
    inputSelectAs.value = "";
    inputSelectAs.disabled = false;
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
    gameState.tiempoCampeon = iniciarBarraTiempo(scoreState.estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, null, timeState.tiempoCampeonLeft, "campeon");
    mostrarNotificacion("¡Revivido! Sigue jugando");
    vibrarWin();
    cambiarMusicaModes(musicaCampeon);
  }
}

//Funcion de toda la logica de juego del modo Campista
export async function campistaLogica(){

    let pokemonesValidos;
    if (gameState.type1Value === gameState.type2Value){
      pokemonesValidos = dataState.pokedex.filter(pokemon => pokemon.types.includes(gameState.type1Value) && pokemon.types.length === 1);
    }else {
      pokemonesValidos = dataState.pokedex.filter(pokemon => pokemon.types.includes(gameState.type1Value) && pokemon.types.includes(gameState.type2Value));
    }
    console.log(pokemonesValidos);

    if(pokemonesValidos.length === 0){
      generarTipos(tipo1Campista, tipo2Campista)
      campistaLogica();
      console.log("No hay pokemones con esa combinación");
      return;
    }
        
    console.log(pokemonesValidos.map(p => p.name));

    const correctPokemon = pokemonesValidos[Math.floor(Math.random() * pokemonesValidos.length)];

    console.log(correctPokemon.name);
    
    const wrongOptions = [];
    while(wrongOptions.length < 3){

        const randomId = Math.floor(Math.random() * dataState.pokedex.length) + 1;

        const randomPokemon = dataState.pokedex[randomId - 1];

        const isCorrect = randomPokemon.name === correctPokemon.name;

        const alreadyExists = wrongOptions.some( p => p.name === randomPokemon.name);

        const hasBothTypes = randomPokemon.types.includes(gameState.type1Value) && randomPokemon.types.includes(gameState.type2Value);
            
        if(!isCorrect && !alreadyExists && !hasBothTypes){
            wrongOptions.push(randomPokemon);
        }

    }
    console.log(wrongOptions.map(p => p.name));

    const allOptions = [correctPokemon,...wrongOptions];

    allOptions.sort(() => Math.random() - 0.5);

    let answered = false;
    gameState.tiempoCampista = iniciarBarraTiempo(scoreState.estadoJuego, "scoreCampista", pScoreCampista, btnIntentoCampista, barraTiempoCampista, mensajeAciertoCampista, 3, null, null, null, gameState.tiempoCampista, timeState.tiempoCampistaLeft, "campista");

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
                console.log("Correcto");
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

                const buttons = document.querySelectorAll(".btn-opcion");

                buttons.forEach(btn => {
                    btn.style.display = "none";
                });
                btnNextCampista.style.display = "flex";

            } else {
              guardarScoreAntesDePerder("campista");
              mostrarBotonRevivir("campista");
              soundLose();
              vibrarLose();
              mensajeAciertoCampista.innerHTML = "Has Perdido.<br>La respuesa correcta era <strong>" + correctPokemon.name.charAt(0).toUpperCase() + correctPokemon.name.slice(1) + "</strong>";
              scoreState.estadoJuego.scoreCampista = 0;
              pScoreCampista.textContent = scoreState.estadoJuego.scoreCampista;
              btnIntentoCampista.style.display = "flex";
              const buttons = document.querySelectorAll(".btn-opcion");

              buttons.forEach(btn => {
                  btn.style.display = "none";
              });
            }
        });
        });
}   

//Funcion que crea el listado de los pokemones para el Modo AsDeBatalla
export function AsLogica() {
    gameState.pokemonesValidos = dataState.pokedex.filter(pokemon => pokemon.types.includes(gameState.type1Value));
    const pokemonesName = gameState.pokemonesValidos.map(p => p.name).sort();
    console.log(pokemonesName);
    pokemonesName.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name.replaceAll("-", " ");
      datalistAs.appendChild(option);
    });
    gameState.tiempoAsDeBatalla = iniciarBarraTiempo(scoreState.estadoJuego, "scoreAsDeBatalla", pScoreAs, btnIntentoAs, barraTiempoAs, mensajeAciertoAs, 0.7, btnNoExisteAs, btnValidarAs, cajaSelect, gameState.tiempoAsDeBatalla, timeState.tiempoAsDeBatallaLeft, "as");
    console.log(dataState.pokedex.find(p => p.types.includes(gameState.type1Value) && p.types.includes(gameState.type2Value)));
}

//Funcion que valida la seleccion del usuario en el modo As
export function validarSelect() {
    gameState.selectedPokemon = inputSelectAs.value;
    console.log(gameState.selectedPokemon)

    if (gameState.selectedPokemon === "") {
      console.log("No se seleccionó ningún pokemon");
      mostrarNotificacion("Por favor, selecciona un pokemon");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      inputSelectAs.disabled = false;
      return;
    }

    const pokemonSeleccionado = dataState.pokedex.find(p => p.name === gameState.selectedPokemon);
    console.log(pokemonSeleccionado);

    let ambosTypes = false;

    if(!pokemonSeleccionado) {
      mostrarNotificacion("El pokemon colocado no Existe o esta Mal escrito");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      inputSelectAs.disabled = false;
      return;
    }
    
    if (gameState.type1Value === gameState.type2Value) {
        ambosTypes = pokemonSeleccionado.types.length === 1 && pokemonSeleccionado.types.includes(gameState.type1Value);
    } else {
        ambosTypes = pokemonSeleccionado.types.includes(gameState.type1Value) && pokemonSeleccionado.types.includes(gameState.type2Value);
    }
    
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
        datalistAs.innerHTML = "";
        btnIntentoAs.style.display = "flex";
        mostrarBotonRevivir("as");
        soundLose();
        vibrarLose();
        mensajeAciertoAs.innerHTML = "¡Incorrecto! <br/><strong>" + gameState.selectedPokemon.charAt(0).toUpperCase() + gameState.selectedPokemon.slice(1) + "</strong> no tiene esa combinación de tipos.";
        clearInterval(gameState.tiempoAsDeBatalla);
    }
}

//Funcion que valida si no existe el pokemon con la combinacion de tipos en el modo As
export function logicaNoExisteAs() {

    const existeAlguno = dataState.pokedex.some(pokemon => {
        const tiposDelPokemon = pokemon.types
        const tieneTipo1 = tiposDelPokemon.includes(gameState.type1Value);
        const tieneTipo2 = tiposDelPokemon.includes(gameState.type2Value);

        return tieneTipo1 && tieneTipo2;
        
    });

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

    }else if(existeAlguno){
        guardarScoreAntesDePerder("as");
        mensajeAciertoAs.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
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
    console.log(pokemonSeleccionado)

    if (pokemonSeleccionado === "") {
        console.log("No se seleccionó ningún pokemon");
        mostrarNotificacion("Por favor, selecciona un pokemon");
        btnNextCampeon.style.display = "none";
        btnRevelarCampeon.style.display = "flex";
        btnNoExisteCampeon.style.display = "flex";
        respuestaInputCampeon.disabled = false;
        return;
    }
    
    const pokemonSeleccionadoTypes = dataState.pokedex.find(pokemon => pokemon.name === pokemonSeleccionado);

    if(!pokemonSeleccionadoTypes) {
      console.log("El pokemon seleccionado no existe");
      mostrarNotificacion("El pokemon colocado no Existe");
      btnNextCampeon.style.display = "none";
      btnRevelarCampeon.style.display = "flex";
      btnNoExisteCampeon.style.display = "flex";
      respuestaInputCampeon.disabled = false;
      return;
    }

    let esCorrecto = false;
    if (gameState.type1Value === gameState.type2Value) {
        esCorrecto = pokemonSeleccionadoTypes.types.length === 1 && pokemonSeleccionadoTypes.types.includes(gameState.type1Value);
    } else {
        esCorrecto = pokemonSeleccionadoTypes.types.includes(gameState.type1Value) && pokemonSeleccionadoTypes.types.includes(gameState.type2Value);
    }

    if (esCorrecto) {
        scoreState.estadoJuego.scoreCampeon++;
        pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;
        mensajeAciertoCampeon.innerHTML = "¡Correcto! Sumas a tu racha";
        respuestaInputCampeon.disabled = true;
        clearInterval(gameState.tiempoCampeon);        
        soundWin();
        vibrarWin();
        if (scoreState.estadoJuego.scoreCampeon > scoreState.maxCampeon) {
          scoreState.maxCampeon = scoreState.estadoJuego.scoreCampeon;
          localStorage.setItem("maxCampeon", scoreState.maxCampeon);
          pMaxCampeon.textContent = scoreState.maxCampeon;
        }

    }else{
        guardarScoreAntesDePerder("campeon");
        scoreState.estadoJuego.scoreCampeon = 0;
        pScoreCampeon.textContent = scoreState.estadoJuego.scoreCampeon;
        btnIntentoCampeon.style.display = "flex";
        mostrarBotonRevivir("campeon");
        btnNextCampeon.style.display = "none";
        respuestaInputCampeon.disabled = true;
        mensajeAciertoCampeon.innerHTML = "¡Te equivocas! <br/>" + pokemonSeleccionado.charAt(0).toUpperCase() + pokemonSeleccionado.slice(1) + " no tiene esa combinación!";
        clearInterval(gameState.tiempoCampeon);
        soundLose();
        vibrarLose();
      }
}

//Funcion de la logica del boton "No Existe" en el modo Campeon
export function logicaNoExisteCampeon() {
    const existeAlguno = dataState.pokedex.some(pokemon => {
        const tiposDelPokemon = pokemon.types
        const tieneTipo1 = tiposDelPokemon.includes(gameState.type1Value);
        const tieneTipo2 = tiposDelPokemon.includes(gameState.type2Value);

        return tieneTipo1 && tieneTipo2;
        
    });

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

    }else if(existeAlguno){
      guardarScoreAntesDePerder("campeon");
      mensajeAciertoCampeon.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
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
