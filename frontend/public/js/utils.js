// Variables importadas desde config.js
import { toastMensaje, notificacion, splash, dataState } from './config.js';

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
