import { btnVolverLigas, ligas, poketype } from '../config.js';

// --- |Evento de boton de "Volver" desde Ligas|
btnVolverLigas.addEventListener("click", () => {
  ligas.style.display = "none";
  poketype.style.display = "flex";
});