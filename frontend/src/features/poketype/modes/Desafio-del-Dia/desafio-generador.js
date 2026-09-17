import { validarTiposPokemon } from '../../utils.js';
import { types } from '../../../../config/config.js';
import { elegirAlAzar, mezclarConGenerador } from './prng-semilla.js';

// Elige dos tipos al azar (con semilla) y confirma que exista al menos
// un Pokémon en la Pokedex con esa combinación. Si no existe ninguno,
// vuelve a intentar con el siguiente número de la secuencia (determinista).
export function generarTiposDelDia(pokedex, generador) {
  const MAXIMO_INTENTOS = 50; // salvaguarda contra combinaciones imposibles repetidas

  for (let intento = 0; intento < MAXIMO_INTENTOS; intento++) {
    const type1 = elegirAlAzar(types, generador);
    const type2 = elegirAlAzar(types, generador);

    const hayAlMenosUno = pokedex.some(p => validarTiposPokemon(p, type1, type2));
    if (hayAlMenosUno) {
      return { type1, type2 };
    }
  }

  throw new Error('No se pudo generar una combinación de tipos válida tras varios intentos.');
}

// Dada una combinación de tipos ya generada, arma la ronda completa para
// la mecánica Campista: el Pokémon correcto + 3 opciones incorrectas, mezcladas.
export function generarRondaCampista(pokedex, type1, type2, generador) {
  const pokemonesValidos = pokedex.filter(p => validarTiposPokemon(p, type1, type2));
  const correctPokemon = elegirAlAzar(pokemonesValidos, generador);

  const opcionesIncorrectas = [];
  const MAXIMO_INTENTOS = 200;
  let intentos = 0;

  while (opcionesIncorrectas.length < 3 && intentos < MAXIMO_INTENTOS) {
    intentos++;
    const candidato = elegirAlAzar(pokedex, generador);

    const esElCorrecto = candidato.name === correctPokemon.name;
    const yaEstaEnLaLista = opcionesIncorrectas.some(p => p.name === candidato.name);
    const tieneLaMismaCombinacion = validarTiposPokemon(candidato, type1, type2);

    if (!esElCorrecto && !yaEstaEnLaLista && !tieneLaMismaCombinacion) {
      opcionesIncorrectas.push(candidato);
    }
  }

  if (opcionesIncorrectas.length < 3) {
    throw new Error('No se encontraron suficientes opciones incorrectas para esta ronda.');
  }

  const todasLasOpciones = mezclarConGenerador([correctPokemon, ...opcionesIncorrectas], generador);

  return { correctPokemon, opciones: todasLasOpciones };
}