// Lógica pura para la dificultad progresiva de Entrenamiento (Campista/As/Campeón).
// No toca el DOM: recibe el score actual y devuelve valores ajustados.

// Calcula la velocidad de la barra de tiempo (cuánto baja por tick) según el score actual.
// A mayor score, la barra baja más rápido = menos tiempo para responder.
// El incremento se limita con un máximo, para no volverse imposible.
export function calcularVelocidadTiempo(velocidadBase, scoreActual, incrementoPorNivel, incrementoMaximo) {
  const nivelesSubidos = Math.floor(scoreActual / 5); // sube de nivel cada 5 aciertos
  const incremento = Math.min(nivelesSubidos * incrementoPorNivel, incrementoMaximo);
  return velocidadBase + incremento;
}

// Elige las opciones incorrectas para el modo Campista. A mayor score, prioriza
// Pokémon que comparten AL MENOS UNO de los dos tipos con el correcto (más fáciles
// de confundir), en vez de opciones totalmente al azar sin relación.
export function elegirDistractoresDificiles(pokedex, correctPokemon, type1, type2, scoreActual, cantidad, validarTiposPokemon) {
  const NIVEL_DIFICIL = 15; // a partir de qué score empieza a preferir distractores parecidos

  const candidatosValidos = pokedex.filter(p => {
    const esElCorrecto = p.name === correctPokemon.name;
    const tieneLaMismaCombinacion = validarTiposPokemon(p, type1, type2);
    return !esElCorrecto && !tieneLaMismaCombinacion;
  });

  const distractores = [];

  if (scoreActual >= NIVEL_DIFICIL) {
    // Prioriza los que comparten al menos un tipo con el Pokémon correcto
    const parecidos = candidatosValidos.filter(p =>
      p.types.includes(type1) || p.types.includes(type2)
    );
    const barajaParecidos = [...parecidos].sort(() => Math.random() - 0.5);

    for (const p of barajaParecidos) {
      if (distractores.length >= cantidad) break;
      distractores.push(p);
    }
  }

  // Completa el resto (o todo, si el score aún no llegó al nivel difícil) al azar
  const restantes = candidatosValidos.filter(p => !distractores.some(d => d.name === p.name));
  const barajaRestantes = [...restantes].sort(() => Math.random() - 0.5);

  for (const p of barajaRestantes) {
    if (distractores.length >= cantidad) break;
    distractores.push(p);
  }

  return distractores;
}