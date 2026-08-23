const POOL_YA_VISTO = [
  { type1: 'dragon', type2: 'flying' },
  { type1: 'dragon', type2: 'ground' },  
  { type1: 'fighting', type2: 'psychic' },
  { type1: 'fighting', type2: 'dark' },   
  { type1: 'dragon', type2: 'water' },    
  { type1: 'dragon', type2: 'grass' },    
  { type1: 'dragon', type2: 'electric' }
];

const TOTAL_RONDAS = 16;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs11(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}