const POOL_YA_VISTO = [
  { type1: 'normal', type2: 'flying' },
  { type1: 'grass', type2: 'poison' },
  { type1: 'bug', type2: 'flying' },
  { type1: 'bug', type2: 'poison' },
  { type1: 'dark', type2: 'dragon' },
  { type1: 'dark', type2: 'poison' },
  { type1: 'ghost', type2: 'steel' },
  { type1: 'bug', type2: 'grass' },
  { type1: 'rock', type2: 'steel' },
  { type1: 'dark', type2: 'flying' },
  { type1: 'fire', type2: 'fighting' },
  { type1: 'water', type2: 'rock' },
  { type1: 'dragon', type2: 'ground' },
];

const TOTAL_RONDAS = 18;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs4(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}