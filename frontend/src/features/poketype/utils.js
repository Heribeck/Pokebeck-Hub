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
    acerca,
    generador,
    main,
    desafio,
    musicaCampista,
    musicaAsBatalla,
    musicaCampeon,
    ligas,
    poketype,
    domElements
} from '../../config/config.js';

import { Capacitor } from '@capacitor/core';

import { cambiarBanner } from '../../shared/admob/admob.js';
import { obtenerHX } from '../../shared/hx/hx-storage.js';
import { hxGlobal, panelEstudio } from '../../config/config.js';
import { verificarDesbloqueosPendientes } from './sistema-desbloqueos.js';
import { verificarRachaVigente } from './modes/Desafio-del-Dia/progreso-storage.js';


// Función para generar números aleatorios
export function Aleatoriedad(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

// Función para mostrar notificaciones
export function mostrarNotificacion(mensaje) {

    toastMensaje.textContent = mensaje;

    notificacion.classList.add("mostrar");

    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 2000);
}

// Función para mostrar notificación especial de racha activa
export function mostrarNotificacionRacha(rachaAnterior, rachaActual) {
    const notificacionRacha = document.getElementById('notificacion-racha');
    if (!notificacionRacha) {
        console.warn('Elemento notificacion-racha no encontrado');
        return;
    }

    const rachaTexto = document.getElementById('racha-notificacion-texto');
    if (rachaTexto) {
        rachaTexto.innerHTML = `<span class="racha-anterior">${rachaAnterior}</span> ➜ <span class="racha-actual">${rachaActual} 🔥</span>`;
    }

    notificacionRacha.classList.add('mostrar');

    setTimeout(() => {
        notificacionRacha.classList.remove('mostrar');
    }, 5000);
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
  // Normalizar tipos del Pokémon
  let tiposPokemon;
  
  if (pokemon.types && Array.isArray(pokemon.types)) {
    tiposPokemon = pokemon.types.map(t => t?.toLowerCase()?.trim()).filter(t => t);
  } else if (pokemon.type1 || pokemon.type2) {
    tiposPokemon = [pokemon.type1, pokemon.type2]
      .map(t => t?.toLowerCase()?.trim())
      .filter(t => t);
  } else {
    return false;
  }
  
  // Normalizar tipos de la ronda
  const t1 = type1?.toLowerCase()?.trim();
  const t2 = type2?.toLowerCase()?.trim();
  
  // Caso monotipo
  if (!t2 || t2 === undefined || t1 === t2) {
    return tiposPokemon.length === 1 && tiposPokemon[0] === t1;
  }
  
  // Caso doble tipo - comparar como conjunto
  const tiposRonda = [t1, t2].sort();
  const tiposPokemonOrdenados = tiposPokemon.sort();
  
  return tiposPokemonOrdenados.length === 2 &&
         tiposPokemonOrdenados[0] === tiposRonda[0] &&
         tiposPokemonOrdenados[1] === tiposRonda[1];
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

// Funciones de audio para música y efectos de sonido
export function reproducirMusicaPorLiga(ligaId) {
    detenerMusica();
    
    switch(ligaId) {
        case 'campista':
            musicaCampista.volume = 0.3;
            musicaCampista.play().catch(e => console.log('Audio play failed:', e));
            break;
        case 'as':
            musicaAsBatalla.volume = 0.3;
            musicaAsBatalla.play().catch(e => console.log('Audio play failed:', e));
            break;
        case 'campeon':
            musicaCampeon.volume = 0.3;
            musicaCampeon.play().catch(e => console.log('Audio play failed:', e));
            break;
    }
}

export function reproducirMusicaPorDificultad(dificultad) {
    detenerMusica();
    
    switch(dificultad) {
        case 'facil':
            musicaCampista.volume = 0.3;
            musicaCampista.play().catch(e => console.log('Audio play failed:', e));
            break;
        case 'normal':
            musicaAsBatalla.volume = 0.3;
            musicaAsBatalla.play().catch(e => console.log('Audio play failed:', e));
            break;
        case 'dificil':
            musicaCampeon.volume = 0.3;
            musicaCampeon.play().catch(e => console.log('Audio play failed:', e));
            break;
    }
}

export function detenerMusica() {
    musicaCampista.pause();
    musicaCampista.currentTime = 0;
    musicaAsBatalla.pause();
    musicaAsBatalla.currentTime = 0;
    musicaCampeon.pause();
    musicaCampeon.currentTime = 0;
}

export function reproducirSonidoGanar() {
    sonidoGanar.volume = 0.7;
    sonidoGanar.currentTime = 0;
    sonidoGanar.play().catch(e => console.log('Sound play failed:', e));
}

export function reproducirSonidoPerder() {
    sonidoPerder.volume = 0.7;
    sonidoPerder.currentTime = 0;
    sonidoPerder.play().catch(e => console.log('Sound play failed:', e));
}

//Funcion para regresar al panel de Main
export function volverAlMenu(){
    main.style.display = "flex";
    if (acerca) {acerca.style.display = "none";}
    if (generador) {generador.style.display = "none";}
    if (campista) {campista.style.display = "none";}
    if (desafio) {desafio.style.display = "none"}
    if (panelEstudio) {panelEstudio.style.display = "none"}
    if (ligas) {ligas.style.display = "none"}
    if (poketype) {poketype.style.display = "none"}

    cambiarBanner("main");
    detenerTodoElAudio();
    verificarVictoriaAlVolverAlMain();
}