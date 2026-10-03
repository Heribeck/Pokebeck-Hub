// Motor de selección de rondas del Modo Estudio. No toca el DOM: solo pure data.
// Consume primero la "cola de rondas" precomputada de cada nivel (ver leagues/*.js)
// y, si se agota antes de completar el nivel, cae a un fallback dinámico que
// elige cualquier combinación de tipos todavía disponible en el pool filtrado.

import { filterPokedexByGeneration } from '../algorithms/pokedexFiltering.js';
import { validatePokemonTypes } from '../../../algorithms/pokemonTypes.js';

function obtenerClaveCombinacion(type1, type2) {
  const ordenado = [type1, type2].sort();
  return `${ordenado[0]}/${ordenado[1]}`;
}

function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function obtenerPokemonesDisponibles(poolFiltrado, type1, type2, repeticion, pokemonesUsados) {
  const validos = poolFiltrado.filter((p) => validatePokemonTypes(p, type1, type2));
  if (repeticion) return validos;
  return validos.filter((p) => !pokemonesUsados.has(p.name));
}

function obtenerCombinacionesDisponibles(poolFiltrado, repeticion, pokemonesUsados, combinacionesAgotadas) {
  const combinaciones = new Map();

  for (const pokemon of poolFiltrado) {
    const type1 = pokemon.types[0];
    const type2 = pokemon.types[1] || null;
    const clave = obtenerClaveCombinacion(type1, type2);

    if (combinaciones.has(clave) || combinacionesAgotadas.has(clave)) continue;

    const disponibles = obtenerPokemonesDisponibles(poolFiltrado, type1, type2, repeticion, pokemonesUsados);
    if (disponibles.length > 0) {
      combinaciones.set(clave, { type1, type2, pokemonesDisponibles: disponibles });
    }
  }

  return Array.from(combinaciones.values());
}

function obtenerOpcionesIncorrectas(poolFiltrado, correctPokemon, type1, type2) {
  const candidatos = poolFiltrado.filter(
    (p) => p.name !== correctPokemon.name && !validatePokemonTypes(p, type1, type2)
  );

  const candidatosUnicos = new Map();
  for (const p of candidatos) {
    if (!candidatosUnicos.has(p.name)) candidatosUnicos.set(p.name, p);
  }

  return mezclar(Array.from(candidatosUnicos.values())).slice(0, 3);
}

// Crea el estado inicial de la cola de rondas para un intento de nivel nuevo.
export function crearEstadoRondas(config, generador = Math.random) {
  return {
    colaRondas: config.generarColaRondas(generador),
    posicionCola: 0,
    pokemonesUsados: new Set(),
    combinacionesAgotadas: new Set(),
  };
}

// Genera la siguiente ronda disponible y devuelve el nuevo estado (inmutable).
// Devuelve { ronda: null, estado } si ya no hay ninguna combinación disponible.
export function generarSiguienteRonda(config, pokedex, estado) {
  const poolFiltrado = filterPokedexByGeneration(pokedex, config.filtroGeneracion, config.filtroEspecial);

  const nuevoEstado = {
    colaRondas: estado.colaRondas,
    posicionCola: estado.posicionCola,
    pokemonesUsados: new Set(estado.pokemonesUsados),
    combinacionesAgotadas: new Set(estado.combinacionesAgotadas),
  };

  let combinacionElegida = null;

  while (nuevoEstado.posicionCola < nuevoEstado.colaRondas.length) {
    const { type1, type2 } = nuevoEstado.colaRondas[nuevoEstado.posicionCola];
    const clave = obtenerClaveCombinacion(type1, type2);

    if (nuevoEstado.combinacionesAgotadas.has(clave)) {
      nuevoEstado.posicionCola += 1;
      continue;
    }

    const disponibles = obtenerPokemonesDisponibles(
      poolFiltrado,
      type1,
      type2,
      config.repeticion,
      nuevoEstado.pokemonesUsados
    );

    if (disponibles.length === 0) {
      nuevoEstado.combinacionesAgotadas.add(clave);
      nuevoEstado.posicionCola += 1;
      continue;
    }

    combinacionElegida = { type1, type2, pokemonesDisponibles: disponibles };
    nuevoEstado.posicionCola += 1;
    break;
  }

  if (!combinacionElegida) {
    const disponibles = obtenerCombinacionesDisponibles(
      poolFiltrado,
      config.repeticion,
      nuevoEstado.pokemonesUsados,
      nuevoEstado.combinacionesAgotadas
    );

    if (disponibles.length > 0) {
      combinacionElegida = disponibles[Math.floor(Math.random() * disponibles.length)];
    }
  }

  if (!combinacionElegida) {
    return { ronda: null, estado: nuevoEstado };
  }

  const { type1, type2, pokemonesDisponibles } = combinacionElegida;
  const correctPokemon = pokemonesDisponibles[Math.floor(Math.random() * pokemonesDisponibles.length)];
  const opcionesIncorrectas = obtenerOpcionesIncorrectas(poolFiltrado, correctPokemon, type1, type2);
  const opciones = mezclar([correctPokemon, ...opcionesIncorrectas]);

  nuevoEstado.pokemonesUsados.add(correctPokemon.name);

  return {
    ronda: { type1, type2, correctPokemon, opciones },
    estado: nuevoEstado,
  };
}
