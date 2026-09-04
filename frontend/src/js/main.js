import './firebaseConfig.js';
import './eventosMain.js';
import './Poketype-Guess/eventosPoketype.js'
import './Poketype-Guess/Modo-Estudio/eventosEstudio.js'
import './Poketype-Guess/Modo-Entrenamiento/eventosEntrenamiento.js'

import { inicializarPushFCM } from './Poketype-Guess/notificaciones-locales.js';
import { dataState, splash, main, adState } from './Poketype-Guess/config.js';
import { InicializarAdMob, prepararBonificado } from './admob.js';
import { actualizarStatMenu } from './utilsMain.js';
import { verificarDesbloqueosPendientes } from './Poketype-Guess/sistema-desbloqueos.js';
import { verificarVictoriaAlIniciar } from './victoria.js';

import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// ============================================================
// SPLASH SCREEN
// ============================================================

async function desvanecerSplashScreen(){
  splash.style.opacity = "0";
  setTimeout(()=>{ splash.remove(); },500);
}

// ============================================================
// POKEDEX
// ============================================================

async function cargarPokedex(){
  const response = await fetch("./assets/data/pokedex.json");
  dataState.pokedex = await response.json();
}

// ============================================================
// INICIALIZACIÓN DE LA APP
// ============================================================

async function iniciarApp(){
  const progressBar = document.querySelector(".barra-carga")

  await cargarPokedex();
  progressBar.style.width = "33%"

  await actualizarStatMenu();
  progressBar.style.width = "66%"

  await verificarVictoriaAlIniciar();
  progressBar.style.width = "100%"

  desvanecerSplashScreen();
  
  verificarDesbloqueosPendientes();
  inicializarPushFCM();
  InicializarAdMob().then(() => {
    if (adState.hayInternet) {
      prepararBonificado();
    }
  });
}

iniciarApp();