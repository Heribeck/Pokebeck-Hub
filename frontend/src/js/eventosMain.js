import { ocultarBanner, mostrarBanner, prepararBonificado } from './admob.js';
import { btnAcerca, btnPoketype, poketype, sonidoTouch, main, acerca, telegram, adState } from './Poketype-Guess/config.js';
import { Capacitor } from '@capacitor/core';

// --- |Evento de boton de "PokeType Guess"|
btnPoketype.addEventListener("click", () => {
  main.style.display = "none";
  poketype.style.display = "flex";
  mostrarBanner("TOP_CENTER");
});

// --- |Eventos del Apartado de "Acerca del Proyecto"| --- //
btnAcerca.addEventListener("click", () => {
  main.style.display = "none";
  acerca.style.display = "flex";
  mostrarBanner("TOP_CENTER");
});

//Evento del boton de "Telegram"
telegram.addEventListener("click", () => {
    if (Capacitor.isNativePlatform()) {
        window.open('tg://resolve?domain=heribeck', '_system');
    } else {
        window.open('https://t.me/pokebeck', '_blank');
    }
});

// --- |Eventos de para comprobar conexion a internet
window.addEventListener("online", () => {
  adState.hayInternet = true;
  prepararBonificado();
  if (!adState.bannerVisible) {
    adState.bannerPendiente = true;
  }
});

//Evento Offline
window.addEventListener("offline", () => {
  adState.hayInternet = false;
});

//Evento Global sonido de los touch en botones
document.addEventListener("click", (evento) => {
  if (evento.target.tagName === "BUTTON") {
    sonidoTouch.currentTime = 0;
    sonidoTouch.play();
  }
});

