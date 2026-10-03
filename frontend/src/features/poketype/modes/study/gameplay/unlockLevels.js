export function tieneHXParaNivel(nivelConfig, hxActual) {
  return hxActual >= nivelConfig.hxRequerido;
}

export function ligaCompletada(idsDeLaLiga, idsCompletados) {
  return idsDeLaLiga.every((id) => idsCompletados.includes(id));
}

export function dificultadesEntrenamientoDesbloqueadas(idsCompletados, nivelesPorLiga) {
  const campistaCompleta = ligaCompletada(nivelesPorLiga.campista, idsCompletados);
  const asCompleta = ligaCompletada(nivelesPorLiga.as, idsCompletados);

  return {
    facil: true,
    normal: campistaCompleta,
    dificil: asCompleta,
  };
}
