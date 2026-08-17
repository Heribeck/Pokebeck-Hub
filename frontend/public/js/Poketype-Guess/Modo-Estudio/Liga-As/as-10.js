const POOL_YA_VISTO = [
  { type1: 'rock', type2: 'ground' },   
  { type1: 'steel', type2: 'ground' },  
  { type1: 'rock', type2: 'water' },    
  { type1: 'steel', type2: 'psychic' }, 
  { type1: 'steel', type2: 'fairy' },   
  { type1: 'steel', type2: 'flying' },  
  { type1: 'rock', type2: 'flying' }, 
  { type1: 'steel', type2: 'bug' },  
  { type1: 'rock', type2: 'bug' },      
  { type1: 'steel', type2: 'dragon' }
];

const TOTAL_RONDAS = 16;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs10(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}