import { domElements } from "../../config/config.js";
import { verificarRachaVigente } from "../../features/poketype/modes/Desafio-del-Dia/progreso-storage";
import { obtenerHX } from "../../shared/hx/hx-storage";

export async function actualizarStatMenu() {
  const rachaMain = domElements.main.rachaTextoMain
  const rachaPoketype = domElements.poketype.rachaTextoPoketype

  try {
    const hx = await obtenerHX();
    actualizarHXEnMenu(hx);
  } catch (error) {
    console.error("Error actualizando HX:", error);
  }

  try {
    const progreso = await verificarRachaVigente();

    if (rachaMain && rachaPoketype){
      rachaMain.textContent = `🔥 ${progreso.rachaGeneral} días`;
      rachaPoketype.textContent = `🔥 ${progreso.rachaGeneral} días`;
    }
  } catch (error) {
    console.error("Error actualizando racha general:", error);
  }
}

export function actualizarHXEnMenu(hx) {
  const hxGlobalMain = domElements.main.hxGlobalMain
  const hxGlobalPoketype = domElements.poketype.hxGlobal

  if (hxGlobalMain && hxGlobalPoketype){
  hxGlobalMain.textContent = `⚡ ${hx} HX`;
  hxGlobalPoketype.textContent = `⚡ ${hx} HX`;
  }
}