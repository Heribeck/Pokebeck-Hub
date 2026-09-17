import { ocultarBanner, mostrarBanner, prepararBonificado } from '../shared/admob/admob.js';
import { btnAcerca, btnPoketype, poketype, sonidoTouch, main, acerca, telegram, adState } from '../config/config.js';
import { detenerTodoElAudio, volverAlMenu } from '../features/poketype/utils.js';
import { showNotification } from '../shared/notifications/localNotifications.js';

import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { NOTIFICATION_IDS } from '../shared/notifications/idsNotifications.js';

function mostrarPanel(panel){
  main.style.display = "none";
  poketype.style.display = "none";
  acerca.style.display = "none";

  panel.style.display = "flex";
};

function abrirTelegram(){
  const isNative = Capacitor.isNativePlatform()

  const url = isNative
    ? "tg://resolve?domain=pokebeck"
    : "https://t.me/pokebeck";

  window.open(url, isNative ? "_system" : "_blank");
}

if (Capacitor.isPluginAvailable('App')){

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

btnPoketype.addEventListener("click", () => {
  mostrarPanel(poketype);
});

btnAcerca.addEventListener("click", () => {
  mostrarPanel(acerca);
  showNotification({
    id: NOTIFICATION_IDS.RACHA_CASI_POR_EXPIRAR,
    title: "Acerca de",
    body: "Información sobre la aplicación",
    extra: "Prueba de la muestra de notificaciones"
  });
});

telegram.addEventListener("click", abrirTelegram);

window.addEventListener("online", () => {
  adState.hayInternet = true;
  prepararBonificado();
  if (!adState.bannerVisible) {
    adState.bannerPendiente = true;
  }
});

window.addEventListener("offline", () => {
  adState.hayInternet = false;
});

document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");

  if (boton) {
    sonidoTouch.currentTime = 0;
    sonidoTouch.play().catch((error) => {
      console.warn("No se pudo reproducir el sonido", error);
    })
  }
});

