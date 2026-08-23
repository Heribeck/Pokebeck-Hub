const POOL_YA_VISTO = [
  { type1: 'ghost', type2: 'grass' },
  { type1: 'dragon', type2: 'grass' },
  { type1: 'normal', type2: 'flying' },
  { type1: 'water', type2: 'bug' },
  { type1: 'fairy', type2: 'grass' },
  { type1: 'dragon', type2: 'fighting' },
  { type1: 'dragon', type2: 'ghost' },
  { type1: 'dragon', type2: 'ice' },
  { type1: 'rock', type2: 'poison' },
  { type1: 'fairy', type2: 'psychic' },
  { type1: 'bug', type2: 'fighting' },
  { type1: 'dragon', type2: 'water' },
  { type1: 'ghost', type2: 'fire' },
  { type1: 'fairy', type2: 'dark' },
];

const TOTAL_RONDAS = 18;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs8(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}