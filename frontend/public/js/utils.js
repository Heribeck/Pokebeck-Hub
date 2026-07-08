// Variables importadas desde config.js
import { 
    toastMensaje, 
    notificacion, 
    splash, 
    dataState, 
    sonidoGanar, 
    sonidoPerder, 
    musicActual 
} from './config.js';

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
    // Pasar todo a minúsculas y quitar espacios raros para evitar falsos errores
    const s1 = palabraUsuario.toLowerCase().trim();
    const s2 = palabraCorrecta.toLowerCase().trim();

    // Si son idénticas, es 100% correcto de una
    if (s1 === s2) return true;
    if (s1.length === 0 || s2.length === 0) return false;

    // Crear la matriz para el algoritmo de Levenshtein
    const matriz = [];
    for (let i = 0; i <= s1.length; i++) matriz[i] = [i];
    for (let j = 0; j <= s2.length; j++) matriz[0][j] = j;

    // Llenar la matriz calculando las ediciones (borrar, insertar, sustituir)
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                matriz[i][j] = matriz[i - 1][j - 1];
            } else {
                matriz[i][j] = Math.min(
                    matriz[i - 1][j] + 1,    // Borrado
                    matriz[i][j - 1] + 1,    // Inserción
                    matriz[i - 1][j - 1] + 1 // Sustitución
                );
            }
        }
    }

    // La distancia final es el último elemento de la matriz
    const distanciaFinal = matriz[s1.length][s2.length];
    
    // Calcular el porcentaje de similitud real basado en la palabra más larga
    const longitudMaxima = Math.max(s1.length, s2.length);
    const porcentajeSimilitud = ((longitudMaxima - distanciaFinal) / longitudMaxima) * 100;

    // Retorna true si el porcentaje real es mayor o igual al que tú pides (70)
    return porcentajeSimilitud >= porcentajeRequerido;
}