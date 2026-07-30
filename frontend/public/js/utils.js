// Variables importadas desde config.js
import { 
    toastMensaje, 
    notificacion, 
    splash, 
    dataState, 
    sonidoGanar, 
    sonidoPerder, 
    musicActual, 
    campista,
    As,
    campeon,
    acerca,
    generador,
    dificultad,
    main,
    desafio
} from './config.js';

import { mostrarBanner } from './admob.js';
import { actualizarRachaEnMenu } from './desafio-dia.js';
import { obtenerHX } from './hx-storage.js';
import { hxGlobal, panelReto } from './config.js';

// Función para generar números aleatorios
export function Aleatoriedad(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

//Funcion de barra de carga del SplashScreen
export function loadApp() {
    const progressBar = document.querySelector(".barra-carga");
    let progress = 0;

    const fakeLoader = setInterval(()=>{

    progress += 10;

    progressBar.style.width = progress + "%";

    if(progress >= 100){

    clearInterval(fakeLoader);

    startGame();

    }

},300);
}

//Funcion de inicio del juego (Se acaba el SplashScreen)
export async function startGame(){

  splash.style.opacity = "0";

  setTimeout(()=>{

    splash.remove();

  },500);

}

//Funcion para cargar la pokedex
export async function cargarPokedex(){

    const response = await fetch(
      "./assets/data/pokedex.json"
    );

    dataState.pokedex = await response.json();
}

// Función para mostrar notificaciones
export function mostrarNotificacion(mensaje) {

    toastMensaje.textContent = mensaje;
    
    notificacion.classList.add("mostrar");

    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 2000);
}

//Funcion para detener musica, sonidos y vibracion de los modos
export function detenerTodoElAudio() {
    if (musicActual.musicActualPlay) {
        musicActual.musicActualPlay.pause();
        musicActual.musicActualPlay.currentTime = 0;
        musicActual.musicActualPlay = null;
    }
    
    sonidoGanar.pause();
    sonidoGanar.currentTime = 0;
    sonidoPerder.pause();
    sonidoPerder.currentTime = 0;
    navigator.vibrate(0);

}

//Funcion para cambiarMusicaModes
export function cambiarMusicaModes(musicModo) {
    detenerTodoElAudio();
    musicActual.musicActualPlay = musicModo;
    musicActual.musicActualPlay.play().catch(error => {
        mostrarNotificacion("La música no pudo iniciar, hubo algún error: " + error);
    });
}

//Funcion que dispare el sonido de ganar
export function soundWin() {
    sonidoGanar.play();
}

//Funcion que dispare el sonido de perder
export function soundLose() {
    detenerTodoElAudio();
    sonidoPerder.play();
}

//Funcion para vibrar el dispositivo cuando acierte el jugador
export function vibrarWin() {
    navigator.vibrate(100);
}

//Funcion para vibrar el dispositivo cuando se equivoque el jugador
export function vibrarLose() {
    navigator.vibrate(200, 100, 200);
}

//Funcion para validar la similitud de la palabra del usuario con la palabra correcta
export function validarSimilitudPalabra(palabraUsuario, palabraCorrecta, porcentajeRequerido = 70) {
    const s1 = palabraUsuario.toLowerCase().trim();
    const s2 = palabraCorrecta.toLowerCase().trim();

    if (s1 === s2) return true;
    if (s1.length === 0 || s2.length === 0) return false;

    const matriz = [];
    for (let i = 0; i <= s1.length; i++) matriz[i] = [i];
    for (let j = 0; j <= s2.length; j++) matriz[0][j] = j;

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                matriz[i][j] = matriz[i - 1][j - 1];
            } else {
                matriz[i][j] = Math.min(
                    matriz[i - 1][j] + 1,
                    matriz[i][j - 1] + 1,
                    matriz[i - 1][j - 1] + 1
                );
            }
        }
    }

    const distanciaFinal = matriz[s1.length][s2.length];
    const longitudMaxima = Math.max(s1.length, s2.length);
    const porcentajeSimilitud = ((longitudMaxima - distanciaFinal) / longitudMaxima) * 100;

    return porcentajeSimilitud >= porcentajeRequerido;
}

//Función genérica para validar si un Pokémon tiene los tipos correctos
export function validarTiposPokemon(pokemon, type1, type2) {
    if (type1 === type2) {
        return pokemon.types.length === 1 && pokemon.types.includes(type1);
    }
    return pokemon.types.includes(type1) && pokemon.types.includes(type2);
}

//Función genérica para capitalizar primera letra
export function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

//Función genérica para buscar Pokémon correcto según tipos
export function buscarPokemonCorrecto(pokedex, type1, type2) {
    return type1 !== type2
        ? pokedex.find(p => p.types.includes(type1) && p.types.includes(type2))
        : pokedex.find(p => p.types.includes(type1) && p.types.length === 1);
}

//Función genérica para reiniciar score actual
export function reiniciarScoreActual(scoreKey, pScoreElement, scoreState) {
    scoreState.estadoJuego[scoreKey] = 0;
    pScoreElement.textContent = 0;
    mostrarNotificacion("Score Reiniciado");
}

//Función genérica para reiniciar score máximo
export function reiniciarScoreMax(maxKey, localStorageKey, pMaxElement, scoreState, confirmacionElement) {
    localStorage.removeItem(localStorageKey);
    scoreState[maxKey] = 0;
    pMaxElement.textContent = 0;
    confirmacionElement.style.display = "none";
    mostrarNotificacion("Score Máximo Reiniciado");
    location.reload();
}

//Funcion para regresar al panel de Main
export function volverAlMenu(){
    main.style.display = "flex";
    if (acerca) {acerca.style.display = "none";}
    if (dificultad) {dificultad.style.display = "none";}
    if (generador) {generador.style.display = "none";}
    if (campista) {campista.style.display = "none";}
    if (As) {As.style.display = "none";}
    if (campeon) {campeon.style.display = "none";}
    if (desafio) {desafio.style.display = "none"}
    if (panelReto) {panelReto.style.display = "none"}
    mostrarBanner("TOP_CENTER");
    detenerTodoElAudio();
    actualizarRachaEnMenu();
    obtenerHX().then(hx => {
        if (hxGlobal) hxGlobal.textContent = `⚡ ${hx} HX`;
    }).catch(e => console.error(e));
}