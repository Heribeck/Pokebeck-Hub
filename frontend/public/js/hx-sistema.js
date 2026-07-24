// Reglas puras del sistema HX (Hexium): cuánto se gana por acierto en cada
// mecánica, y qué mecánicas están desbloqueadas según el HX actual del jugador.

export const HX_INICIAL = 700;

const UMBRALES_DESBLOQUEO = {
  campista: 0,     // siempre disponible
  as: 2000,
  campeon: 3000,
};

const HX_POR_ACIERTO = {
  campista: 10,
  as: 20,
  campeon: 35,
};

// ¿Está desbloqueada esta mecánica con el HX actual del jugador?
export function esMecanicaDesbloqueada(mecanica, hxActual) {
  const umbral = UMBRALES_DESBLOQUEO[mecanica];
  if (umbral === undefined) return false;
  return hxActual >= umbral;
}

// Cuánto HX falta para desbloquear esta mecánica (0 si ya está desbloqueada)
export function hxFaltanteParaDesbloquear(mecanica, hxActual) {
  const umbral = UMBRALES_DESBLOQUEO[mecanica];
  if (umbral === undefined) return null;
  return Math.max(0, umbral - hxActual);
}

// Cuánto HX otorga un acierto en esta mecánica
export function obtenerHXPorAcierto(mecanica) {
  return HX_POR_ACIERTO[mecanica] ?? 0;
}