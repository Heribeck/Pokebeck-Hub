import { mostrarBanner } from '../../../../shared/admob/admob.js';
import { btnVolverPoketypeLigas, ligas, poketype } from '../../../../config/config.js';

btnVolverPoketypeLigas.addEventListener("click", () => {
  ligas.style.display = "none";
  poketype.style.display = "flex";
  mostrarBanner("TOP_CENTER")
})
// Nota: La navegación interna del panel de ligas (vista ligas ↔ vista niveles)
// se maneja en ligas-ui.js con btnVolverLigas
// Este archivo maneja la navegación principal del panel