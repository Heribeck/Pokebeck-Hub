// Variables importadas desde config.js (solo las necesarias para inicialización)
import {
  main,
  dificultad,
  generador,
  acerca,
  campista,
  As,
  campeon,
  adState
} from './config.js';

// Funciones importadas desde otros archivos
import { loadApp, cargarPokedex, detenerTodoElAudio } from './utils.js';
import { InicializarAdMob, mostrarBanner, prepararBonificado } from './admob.js';

// Cargar eventos.js para que se asignen los event listeners
import './eventos.js';

//Carga inicial
loadApp();
InicializarAdMob().then(() => {
  if (adState.hayInternet) {
    prepararBonificado();
  }
});

//Evento para el back de ventana o para volver al main y el caso de segundo plano
if(window.Capacitor){

  const App = window.Capacitor.Plugins.App;

  App.addListener("backButton", () => {
    if (main.style.display !== "none" && main.style.display !== ""){
      if(confirm("¿Seguro que quieres salir del juego?")){
        App.exitApp();
      }
      return;
    }

    main.style.display = "flex";
    acerca.style.display = "none";
    dificultad.style.display = "none";
    generador.style.display = "none";
    campista.style.display = "none";
    As.style.display = "none";
    campeon.style.display = "none";
    mostrarBanner("TOP_CENTER");
    detenerTodoElAudio();
  })

  App.addListener("appStateChange", (state) => {
    if (!state.isActive) {
      detenerTodoElAudio();
    }
  })
}
cargarPokedex();