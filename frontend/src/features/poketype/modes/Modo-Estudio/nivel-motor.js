// Motor genérico de un intento de nivel en el Modo Estudio (Ligas de Maestría).
// No toca el DOM. Cada nivel define sus propias reglas (cuántas rondas, cuánto
// daño hace un error), pero el motor que las ejecuta es el mismo para todos.

const CORAZONES_INICIALES = 3;

// Crea un intento de nivel nuevo, a partir de su configuración
// (config trae: totalRondas, corazonesPorError)
export function crearIntentoNivel(config) {
  return {
    config,
    rondaActual: 0,
    corazonesRestantes: CORAZONES_INICIALES,
    aciertos: 0,
    errores: 0,
    fallido: false, // true si se quedó sin corazones
  };
}

// Se llama al responder cada ronda. Devuelve info de qué pasó.
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

// Evalúa el resultado final. Un nivel se aprueba si NO falló (no se quedó sin
// corazones) Y llegó al final de las rondas. Algunos niveles exigen puntuación
// perfecta (config.requierePuntuacionPerfecta) — eso ya queda garantizado
// indirectamente si corazonesPorError === 3 (un solo error basta para fallar),
// pero se valida explícito por claridad.
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