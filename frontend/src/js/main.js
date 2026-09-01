//conexion de firebase con pokebeck
import './firebase-config.js';

// Variables importadas desde config.js (solo las necesarias para inicialización)
import { main, adState } from './Poketype-Guess/config.js';

// Funciones importadas desde otros archivos
import { loadApp, cargarPokedex, detenerTodoElAudio, volverAlMenu } from './Poketype-Guess/utils.js';
import { InicializarAdMob, prepararBonificado } from './admob.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Cargar eventos.js para que se asignen los event listeners
import './eventosMain.js';
import './Poketype-Guess/eventosPoketype.js'
import './Poketype-Guess/Modo-Estudio/eventosEstudio.js'
import './Poketype-Guess/Modo Entrenamiento/eventosEntrenamiento.js'

//Actualizar La racha del Usuario
import { actualizarRachaEnMenu } from './Poketype-Guess/Desafio del Dia/desafio-dia.js';

import {inicializarPushFCM } from './Poketype-Guess/notificaciones-locales.js';

import { obtenerProgreso, yaCompletoDesafioHoy, verificarRachaVigente } from './Poketype-Guess/Desafio del Dia/progreso-storage.js';
import { obtenerHX, actualizarTodosLosHX } from './Poketype-Guess/hx-storage.js';
import { domElements } from './Poketype-Guess/config.js';

// Funcion global o expuesta para recargar los stats del menu
export async function actualizarStatsMenu() {
    actualizarRachaEnMenu();
    try {
        const hx = await obtenerHX();
        await actualizarTodosLosHX(hx);
    } catch (e) {
        console.error("Error actualizando HX:", e);
    }

    // Actualizar racha general en menú principal
    try {
        const progreso = await verificarRachaVigente();
        if (domElements.main.rachaMain) {
            domElements.main.rachaMain.textContent = `🔥 ${progreso.rachaGeneral} días`;
        }
        if (domElements.poketype.rachaTexto)
        domElements.poketype.rachaTexto.textContent = `🔥 ${progreso.rachaGeneral} días`;
    } catch (e) {
        console.error("Error actualizando racha general:", e);
    }
}

//Carga inicial
loadApp();

InicializarAdMob().then(() => {
  if (adState.hayInternet) {
    prepararBonificado();
  }
});

//Si existe o esta disponibles el plugin de app entonces ...
if(Capacitor.isPluginAvailable('App')){

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
    }
  })
}
cargarPokedex();
actualizarStatsMenu();

// Verificar victoria al cargar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    if (window.victoriaPokeType) {
        window.victoriaPokeType.verificarVictoriaAlIniciar();
    }
});

inicializarPushFCM();