const CORAZONES_INICIALES = 3;

export function crearIntentoNivel(config) {
  return {
    config,
    rondaActual: 0,
    corazonesRestantes: CORAZONES_INICIALES,
    aciertos: 0,
    errores: 0,
    fallido: false,
  };
}

export function procesarRondaNivel(intento, esCorrecta) {
  if (intento.fallido || intento.rondaActual >= intento.config.totalRondas) {
    throw new Error('Este intento de nivel ya terminó, no se pueden procesar más rondas.');
  }

  intento.rondaActual += 1;

  if (esCorrecta) {
    intento.aciertos += 1;
    return {
      resultado: 'correcto',
      corazonesRestantes: intento.corazonesRestantes,
      nivelTerminado: intento.rondaActual >= intento.config.totalRondas,
      fallido: false,
    };
  }

  intento.errores += 1;
  intento.corazonesRestantes = Math.max(0, intento.corazonesRestantes - intento.config.corazonesPorError);

  if (intento.corazonesRestantes <= 0) {
    intento.fallido = true;
    return {
      resultado: 'incorrecto',
      corazonesRestantes: 0,
      nivelTerminado: true,
      fallido: true,
    };
  }

  return {
    resultado: 'incorrecto',
    corazonesRestantes: intento.corazonesRestantes,
    nivelTerminado: intento.rondaActual >= intento.config.totalRondas,
    fallido: false,
  };
}

export function calcularResultadoNivel(intento) {
  const totalRondas = intento.config.totalRondas;
  const completoTodasLasRondas = intento.rondaActual >= totalRondas;
  const cumplePuntuacionPerfecta = !intento.config.requierePuntuacionPerfecta || intento.errores === 0;

  const aprobado = !intento.fallido && completoTodasLasRondas && cumplePuntuacionPerfecta;

  return {
    aciertos: intento.aciertos,
    errores: intento.errores,
    totalRondas,
    aprobado,
  };
}
