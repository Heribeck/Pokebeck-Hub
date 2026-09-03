// Reglas puras de las 3 dificultades de Entrenamiento (Fácil/Normal/Difícil).
// No toca el DOM: recibe datos y devuelve valores/decisiones.

const VELOCIDAD_BASE = {
  facil: 0.5,
  normal: 1.5,
  dificil: 4,
};

const PERMITE_PROGRESION = {
  facil: false,
  normal: false,
  dificil: true,
};

const PERMITE_REPETIR_POKEMON = {
  facil: true,
  normal: false,
  dificil: false,
};

export function permiteRepetirPokemon(modo) {
  return PERMITE_REPETIR_POKEMON[modo] ?? false;
}

// Calcula la velocidad de la barra de tiempo para esta dificultad.
// Solo "dificil" sigue acelerando con el score; fácil/normal quedan fijos.
export function calcularVelocidadEntrenamiento(modo, scoreActual, incrementoPorNivel = 0.2, incrementoMaximo = 1) {
  const base = VELOCIDAD_BASE[modo] ?? VELOCIDAD_BASE.normal;

  if (!PERMITE_PROGRESION[modo]) {
    return base;
  }

  const nivelesSubidos = Math.floor(scoreActual / 5);
  const incremento = Math.min(nivelesSubidos * incrementoPorNivel, incrementoMaximo);
  return base + incremento;
}

// Calcula, para cada combinación válida de tipos en la Pokedex, cuántos
// Pokémon existen con ella. Deduplica (fire/water y water/fire son la misma combo).
export function obtenerCombinacionesConConteo(pokedex, types, validarTiposPokemon) {
  const combinaciones = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = i; j < types.length; j++) {
      const type1 = types[i];
      const type2 = types[j];
      const conteo = pokedex.filter(p => validarTiposPokemon(p, type1, type2)).length;

      if (conteo > 0) {
        combinaciones.push({ type1, type2, conteo });
      }
    }
  }

  return combinaciones;
}

// Elige una combinación de tipos según la dificultad, a partir de la lista
// ya calculada de combinaciones con conteo (para no recalcularla cada ronda).
// Se filtra por VALOR de rareza (no por posición), para que las combinaciones
// empatadas en conteo queden todas incluidas en el pool correspondiente.
export function elegirCombinacionPorDificultad(combinacionesConConteo, modo, generador = Math.random) {
  const conteos = combinacionesConConteo.map(c => c.conteo).sort((a, b) => a - b);
  const indicePercentil33 = Math.floor(conteos.length / 3);
  const indicePercentil66 = Math.floor((conteos.length * 2) / 3);

  const umbralBajo = conteos[Math.max(0, indicePercentil33 - 1)] ?? conteos[0];
  const umbralAlto = conteos[Math.min(conteos.length - 1, indicePercentil66)] ?? conteos[conteos.length - 1];

  let pool;
  if (modo === 'facil') {
    pool = combinacionesConConteo.filter(c => c.conteo >= umbralAlto);
  } else if (modo === 'dificil') {
    pool = combinacionesConConteo.filter(c => c.conteo <= umbralBajo);
  } else {
    pool = combinacionesConConteo;
  }

  if (pool.length === 0) pool = combinacionesConConteo; // salvaguarda por si el filtro deja vacío

  const indice = Math.floor(generador() * pool.length);
  return { type1: pool[indice].type1, type2: pool[indice].type2 };
}