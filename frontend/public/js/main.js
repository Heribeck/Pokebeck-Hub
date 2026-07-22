//conexion de firebase con pokebeck
import './firebase-config.js';

// Variables importadas desde config.js (solo las necesarias para inicialización)
import { main, adState } from './config.js';

// Funciones importadas desde otros archivos
import { loadApp, cargarPokedex, detenerTodoElAudio, volverAlMenu } from './utils.js';
import { InicializarAdMob, prepararBonificado } from './admob.js';

// Cargar eventos.js para que se asignen los event listeners
import './eventos.js';

//Actualizar La racha del Usuario
import { actualizarRachaEnMenu } from './desafio-dia.js';

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

    volverAlMenu()
  })

  App.addListener("appStateChange", (state) => {
    if (!state.isActive) {
      detenerTodoElAudio();
    }
  })
}
cargarPokedex();
actualizarRachaEnMenu();