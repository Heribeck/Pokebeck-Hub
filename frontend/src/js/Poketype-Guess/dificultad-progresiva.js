export function calcularVelocidadTiempo(velocidadBase, scoreActual, incrementoPorNivel, incrementoMaximo) {
  const nivelesSubidos = Math.floor(scoreActual / 5); 
  const incremento = Math.min(nivelesSubidos * incrementoPorNivel, incrementoMaximo);
  return velocidadBase + incremento;
}

export function elegirDistractoresDificiles(pokedex, correctPokemon, type1, type2, scoreActual, cantidad, validarTiposPokemon) {
  const NIVEL_DIFICIL = 15; 

  const candidatosValidos = pokedex.filter(p => {
    const esElCorrecto = p.name === correctPokemon.name;
    const tieneLaMismaCombinacion = validarTiposPokemon(p, type1, type2);
    return !esElCorrecto && !tieneLaMismaCombinacion;
  });

  const distractores = [];

  if (scoreActual >= NIVEL_DIFICIL) {
    const parecidos = candidatosValidos.filter(p =>
      p.types.includes(type1) || p.types.includes(type2)
    );
    const barajaParecidos = [...parecidos].sort(() => Math.random() - 0.5);

    for (const p of barajaParecidos) {
      if (distractores.length >= cantidad) break;
      distractores.push(p);
    }
  }

  const restantes = candidatosValidos.filter(p => !distractores.some(d => d.name === p.name));
  const barajaRestantes = [...restantes].sort(() => Math.random() - 0.5);

  for (const p of barajaRestantes) {
    if (distractores.length >= cantidad) break;
    distractores.push(p);
  }

  return distractores;
}