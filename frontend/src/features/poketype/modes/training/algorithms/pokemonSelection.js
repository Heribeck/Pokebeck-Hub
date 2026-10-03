import { wasUsed } from '../../../state/poketypeState.js';

const SPECIAL_FORM_ID_LIMIT = 10000;

export function hasUnusedOptions(modo, pokemonesValidos) {
  return pokemonesValidos.some(p => !wasUsed(modo, p.name));
}

export function selectPokemonWithFormPriority(pokemonesValidos, modo, generador = Math.random) {
  if (modo !== 'dificil') {
    const indice = Math.floor(generador() * pokemonesValidos.length);
    return pokemonesValidos[indice];
  }

  const formas = pokemonesValidos.filter(p => p.id >= SPECIAL_FORM_ID_LIMIT);
  const pool = formas.length > 0 ? formas : pokemonesValidos; 

  const indice = Math.floor(generador() * pool.length);
  return pool[indice];
}