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

import { solicitarPermisoNotificaciones, programarNotificacionRacha } from './notificaciones-locales.js';

import { obtenerProgreso, yaCompletoDesafioHoy } from './progreso-storage.js';
import { obtenerHX } from './hx-storage.js';
import { hxGlobal, hxGlobalPoketype, rachaTextoPoketype } from './config.js';

// Funcion global o expuesta para recargar los stats del menu
export async function actualizarStatsMenu() {
    actualizarRachaEnMenu();
    try {
        const hx = await obtenerHX();
        if (hxGlobal) {
            hxGlobal.textContent = `⚡ ${hx} HX`;
        }
        if (hxGlobalPoketype) {
            hxGlobalPoketype.textContent = `⚡ ${hx} HX`;
        }
    } catch (e) {
        console.error("Error actualizando HX:", e);
    }
}

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

  App.addListener("appStateChange", async (state) => {
    if (!state.isActive) {
      detenerTodoElAudio();
    } else {
      // Al volver a primer plano, verificar y reprogramar notificaciones
      try {
        const { verificarRachaVigente } = await import('./progreso-storage.js');
        const progreso = await verificarRachaVigente();
        if (progreso.racha > 0) {
          await programarNotificacionRacha();
        }
      } catch (error) {
        console.error('Error reprogramando notificaciones al volver de segundo plano:', error);
      }
    }
  })
}
cargarPokedex();
actualizarStatsMenu();

solicitarPermisoNotificaciones().then(async () => {
  const completoHoy = await yaCompletoDesafioHoy();
  if (!completoHoy) {
    const progreso = await obtenerProgreso();
    programarNotificacionRacha(progreso.racha);
  }
});