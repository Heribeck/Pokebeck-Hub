import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

import { cargarPokedex } from './storage/pokedexStorage.js';
import { playTouchSound, resumeCurrentMusic, stopMusic } from '../shared/audio/index.js';
import { handleOnline } from '../shared/admob/index.js';
import { appState, dataState } from './state/state.js';
import { getTypeCombinationsWithCount, buildTypeCombinationsByDifficulty } from '../features/poketype/index.js';
import { delay } from '../shared/time/index.js';
import { loadMaxScores } from '../features/poketype/modes/training/storage/scoreStorage.js';
import { checkStreak } from './systems/streak/streakStorage.js';
import { obtenerVidasGenerales } from '../features/poketype/index.js';
import { inicializarPushFCM, requestNotificationPermission } from '../shared/notifications/index.js';
import { preloadNativeAds } from '../shared/admob/native/index.js';

export async function initApp(onNavigation, onStreakExpired, onGameDataReady, onGameDataError) {
    const progressBar = document.querySelector(".LoadingProgressBar");
    const updateProgress = (value) => {
        if (progressBar) {
            progressBar.value = Math.max(progressBar.value, value);
        }
    };

    const gameDataPromise = Promise.all([
        (async () => {
            await cargarPokedex();
            updateProgress(50);
            dataState.typeCombinations = getTypeCombinationsWithCount();
            dataState.typeCombinationsByDifficulty = buildTypeCombinationsByDifficulty();
            updateProgress(75);
        })(),
        obtenerVidasGenerales(),
        loadMaxScores(),
        checkStreak(),
    ]).then(
        (tasks) => ({ ok: true, tasks }),
        (error) => ({ ok: false, error }),
    );

    const nativeAdPromise = preloadNativeAds().catch((error) => {
        console.error('No se pudo preparar el anuncio nativo inicial:', error);
        return false;
    });
    initGlobalSound();
    initGlobalSound();

    await Promise.race([nativeAdPromise, delay(1000)]);
    updateProgress(25);

    onNavigation('home');

    const splash = document.querySelector('.SplashScreen');
    if (splash) {
        splash.style.opacity = "0";
        await delay(500);
        splash.remove();
    }

    initConnectivity();

    requestNotificationPermission()
        .then(() => inicializarPushFCM())
        .catch((error) => {
            console.error('No se pudo inicializar FCM:', error);
        });

    const gameDataResult = await gameDataPromise;
    if (!gameDataResult.ok) {
        console.error('No se pudieron preparar los modos de juego:', gameDataResult.error);
        onGameDataError?.();
        return;
    }

    const [, , , streakStatus] = gameDataResult.tasks;
    updateProgress(100);
    onGameDataReady?.();
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
            stopMusic();
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