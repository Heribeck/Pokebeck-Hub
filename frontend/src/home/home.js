import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

import { cargarPokedex } from './storage/pokedexStorage.js';
import { playTouchSound, resumeCurrentMusic } from '../shared/audio/index.js';
import { handleOnline, initAdMob } from '../shared/admob/index.js';
import { appState, dataState } from './state/state.js';
import { getTypeCombinationsWithCount, buildTypeCombinationsByDifficulty } from '../features/poketype/index.js';
import { delay } from '../shared/time/index.js';
import { loadMaxScores } from '../features/poketype/modes/training/storage/scoreStorage.js';
import { checkStreak } from './systems/streak/streakStorage.js';
import { obtenerVidasGenerales } from '../features/poketype/index.js';
import { requestNotificationPermission } from '../shared/notifications/index.js';
import { ADS_CONFIG } from '../config/index.js';
import { preloadNativeAds } from '../shared/admob/native/index.js';

export async function initApp(onNavigation, onStreakExpired){
    const progressBar = document.querySelector(".LoadingProgressBar")

    const streakStatus = await checkStreak();
    await obtenerVidasGenerales();
    await initAdMob();
    preloadNativeAds(ADS_CONFIG.NATIVE_AD);
    progressBar.value = 25;

    await cargarPokedex();
    progressBar.value = 50;

    //await actualizarStatMenu();
    dataState.typeCombinations = getTypeCombinationsWithCount();
    dataState.typeCombinationsByDifficulty = buildTypeCombinationsByDifficulty();
    progressBar.value = 75;

    //await verificarVictoriaAlIniciar();
    await loadMaxScores();
    progressBar.value = 100;

    onNavigation('home');

    //Desvanecimiento del SplashScreen
    const splash = document.querySelector('.SplashScreen');
    await delay(500);
    splash.style.opacity = "0";
    await delay(500);
    splash.remove(); 

    //verificarDesbloqueosPendientes();
    //inicializarPushFCM();
    initGlobalSound();
    initConnectivity();
    await requestNotificationPermission();
    if (streakStatus.expiredStreak) {
        onStreakExpired(streakStatus.expiredStreak);
    }
    
}

export function initBackButton(onNavigation){
    if (Capacitor.isPluginAvailable('App')){

    App.addListener("backButton", () => {
       onNavigation('home');
    })

    App.addListener("appStateChange", async (state) => {
        if (!state.isActive) {
        //detenerTodoElAudio();
        }
    })
    }
}

function initGlobalSound() {
    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button");
        if (boton) {
            resumeCurrentMusic();
            playTouchSound();
        }
    });
}

function initConnectivity() {
    window.addEventListener("online", () => {
      appState.internet = true;
      handleOnline();
    });

    window.addEventListener("offline", () => {
      appState.internet = false;
    });
}