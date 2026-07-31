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
  barraTiempoCampista,
  dataState,
  adState,
  esperar
} from '../config.js';

import { yaFueUsado, registrarUsado, hayOpcionesNoUsadas, buscarPokemonCorrectoEvitandoRepetidos } from '../control-repeticion.js';
import { mostrarNotificacion, soundWin, soundLose, cambiarMusicaModes, vibrarWin, vibrarLose, validarSimilitudPalabra, validarTiposPokemon, capitalizarPrimeraLetra } from '../utils.js';
import { generarTipos, iniciarBarraTiempo } from '../Generador/generador.js';
import { calcularVelocidadTiempo, elegirDistractoresDificiles } from '../dificultad-progresiva.js';
import { celebrarHito } from '../../celebracion.js';

//Funcion que almacena el score por si el jugador revive
export function guardarScoreAntesDePerder(modo) {
  if (modo === "campista") scoreState.scoreCampistaAntesDePerder = scoreState.estadoJuego.scoreCampista;
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
      
  const noUsados = pokemonesValidos.filter(p => !yaFueUsado('campista', p.name));
  const poolFinal = noUsados.length > 0 ? noUsados : pokemonesValidos; // si se agotó el pool, permite repetir
  const correctPokemon = poolFinal[Math.floor(Math.random() * poolFinal.length)];
  registrarUsado('campista', correctPokemon.name);
  
  
  const wrongOptions = elegirDistractoresDificiles(
  dataState.pokedex, correctPokemon, gameState.type1Value, gameState.type2Value, scoreState.estadoJuego.scoreCampista, 3, validarTiposPokemon);

  console.log(wrongOptions.map(p => p.name));

  const allOptions = [correctPokemon, ...wrongOptions].sort(() => Math.random() - 0.5);
  let answered = false;
  
  gameState.tiempoCampista = iniciarBarraTiempo(
    scoreState.estadoJuego, "scoreCampista", pScoreCampista, btnIntentoCampista, 
    barraTiempoCampista, mensajeAciertoCampista, calcularVelocidadTiempo(3, scoreState.estadoJuego.scoreCampista, 0.15, 0.45), null, null, null, 
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
              
              celebrarHito(scoreState.estadoJuego.scoreCampista);

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
