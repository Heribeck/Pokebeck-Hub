// Lógica pura de desbloqueo: ¿puede el jugador entrar a este nivel?
// Depende del HX requerido del nivel Y de que la liga anterior esté graduada
// (si aplica). No toca el DOM ni storage directamente — recibe los datos ya leídos.

// ¿El jugador tiene suficiente HX para este nivel específico?
export function tieneHXParaNivel(nivelConfig, hxActual) {
  return hxActual >= nivelConfig.hxRequerido;
}

// ¿Completó todos los niveles de esta liga? (recibe la lista de IDs de la liga
// y la lista de IDs ya completados por el jugador)
export function ligaCompletada(idsDeLaLiga, idsCompletados) {
  return idsDeLaLiga.every(id => idsCompletados.includes(id));
}

// Determina qué dificultad de Entrenamiento está desbloqueada, según qué
// ligas ya graduó el jugador.
export function dificultadesEntrenamientoDesbloqueadas(idsCompletados, nivelesPorLiga) {
  const campistaCompleta = ligaCompletada(nivelesPorLiga.campista, idsCompletados);
  const asCompleta = ligaCompletada(nivelesPorLiga.as, idsCompletados);

  return {
    facil: true, // siempre libre
    normal: campistaCompleta,
    dificil: asCompleta,
  };
}   