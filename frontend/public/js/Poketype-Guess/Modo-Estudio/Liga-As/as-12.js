const POOL_YA_VISTO = [
  { type1: 'ghost', type2: 'poison' },  
  { type1: 'dark', type2: 'flying' },   
  { type1: 'psychic', type2: 'flying' },  
  { type1: 'ghost', type2: 'fire' },    
  { type1: 'psychic', type2: 'grass' }, 
  { type1: 'psychic', type2: 'fairy' }, 
  { type1: 'ghost', type2: 'grass' },  
  { type1: 'psychic', type2: 'normal' } 
];

const TOTAL_RONDAS = 16;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs12(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}