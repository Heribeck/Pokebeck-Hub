import { domElements } from "./Poketype-Guess/config";
import { verificarRachaVigente } from "./Poketype-Guess/Desafio-del-Dia/progreso-storage";
import { obtenerHX } from "./Poketype-Guess/hx-storage";


// ============================================================
// ACTUALIZACIÓN DE STASTS(HX Y RACHA)
// ============================================================

export async function actualizarStatsMenu() {
  try {
    const hx = await obtenerHX();
    await actualizarTodosLosHX(hx);
  } catch (x) {
    console.error("Error actualizando HX:", x);
  }

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

export async function actualizarTodosLosHX(valor) {
  if (domElements.main.hxGlobalMain) {
    domElements.main.hxGlobalMain.textContent = `⚡ ${valor} HX`;
  }

  if (domElements.poketype.hxGlobal) {
    domElements.poketype.hxGlobal.textContent = `⚡ ${valor} HX`;
  }
}