// Motor puro del Desafío del Día: controla el estado de una sesión de 10 rondas.
// No toca el DOM ni depende de config.js — solo maneja la lógica de la sesión,
// para que se pueda probar de forma aislada y reutilizar sin importar la mecánica
// (Campista/As/Campeón) que se use para presentar cada pregunta.

const TOTAL_RONDAS = 10;
const PORCENTAJE_APROBACION = 0.70;

// Crea una sesión nueva del Desafío del Día
export function crearSesionDesafio(mecanica) {
  return {
    mecanica,              // 'campista' | 'as' | 'campeon', según la racha del jugador
    rondaActual: 0,        // rondas ya jugadas (0 a 10)
    resultados: [],        // historial: 'correcto' | 'incorrecto' | 'perdonado'
    revivioUsado: false,   // solo se puede revivir una vez por sesión
  };
}

// Se llama cada vez que el jugador responde una ronda.
// Devuelve información sobre qué pasó, para que la UI reaccione en consecuencia.
export function procesarRespuesta(sesion, esCorrecta) {
  if (sesion.rondaActual >= TOTAL_RONDAS) {
    throw new Error('La sesión ya terminó, no se pueden procesar más respuestas.');
  }

  if (esCorrecta) {
    sesion.resultados.push('correcto');
    sesion.rondaActual += 1;
    return {
      resultado: 'correcto',
      puedeRevivir: false,
      sesionTerminada: sesion.rondaActual >= TOTAL_RONDAS,
    };
  }

  // Falló la ronda: ¿todavía tiene disponible el revivir de esta sesión?
  if (!sesion.revivioUsado) {
    // Se ofrece la opción de revivir. OJO: esta ronda NO avanza todavía
    // hasta que se confirme si el jugador revivió o no (ver confirmarRevivir/rechazarRevivir).
    return {
      resultado: 'fallo_pendiente_revivir',
      puedeRevivir: true,
      sesionTerminada: false,
    };
  }

  // Ya había usado su revivir antes: este fallo cuenta normal
  sesion.resultados.push('incorrecto');
  sesion.rondaActual += 1;
  return {
    resultado: 'incorrecto',
    puedeRevivir: false,
    sesionTerminada: sesion.rondaActual >= TOTAL_RONDAS,
  };
}

// El jugador decide revivir (vio el anuncio) tras un 'fallo_pendiente_revivir'.
// La ronda queda perdonada: no cuenta como acierto ni como error.
export function confirmarRevivir(sesion) {
  sesion.revivioUsado = true;
  sesion.resultados.push('perdonado');
  sesion.rondaActual += 1;
  return {
    sesionTerminada: sesion.rondaActual >= TOTAL_RONDAS,
  };
}

// El jugador decide NO revivir tras un 'fallo_pendiente_revivir' (o ya no quiere seguir).
// La ronda cuenta como un error normal.
export function rechazarRevivir(sesion) {
  sesion.resultados.push('incorrecto');
  sesion.rondaActual += 1;
  return {
    sesionTerminada: sesion.rondaActual >= TOTAL_RONDAS,
  };
}

// Calcula el resultado final de una sesión terminada (10 rondas jugadas).
export function calcularResultadoFinal(sesion) {
  const aciertos = sesion.resultados.filter(r => r === 'correcto').length;
  const erroresContados = sesion.resultados.filter(r => r === 'incorrecto').length;
  const perdonados = sesion.resultados.filter(r => r === 'perdonado').length;

  const totalValido = aciertos + erroresContados; // excluye las rondas perdonadas
  const porcentaje = totalValido === 0 ? 0 : aciertos / totalValido;
  const aprobado = porcentaje >= PORCENTAJE_APROBACION;

  return {
    aciertos,
    erroresContados,
    perdonados,
    totalRondas: sesion.resultados.length,
    porcentaje: Math.round(porcentaje * 100), // como número entero, ej. 77
    aprobado,
  };
}