import '../config/firebaseConfig.js';
import './eventosMain.js';
import '../features/poketype/eventosPoketype.js'
import '../features/poketype/modes/Modo-Estudio/eventosEstudio.js'
import '../features/poketype/modes/Modo-Entrenamiento/eventosEntrenamiento.js'
import '../features/poketype/victoria.js';

import { inicializarPushFCM } from '../shared/notifications/pushNotifications.js';
import { dataState, splash, adState } from '../config/config.js';
import { InicializarAdMob, prepararBonificado } from '../shared/admob/admob.js';
import { actualizarStatMenu } from '../shared/utils/utilsMain.js';
import { verificarDesbloqueosPendientes } from '../features/poketype/sistema-desbloqueos.js';
import { verificarVictoriaAlIniciar } from '../features/poketype/victoria.js';
import { requestNotificationPermission } from '../shared/notifications/permissionsNotifications.js';

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
  progressBar.value = 33;

  await actualizarStatMenu();
  progressBar.value = 66;

  await verificarVictoriaAlIniciar();
  progressBar.value = 100;

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
requestNotificationPermission();