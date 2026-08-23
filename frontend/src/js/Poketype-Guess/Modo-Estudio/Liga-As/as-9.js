const POOL_YA_VISTO = [
  { type1: 'grass', type2: 'flying' },   
  { type1: 'fire', type2: 'flying' },    
  { type1: 'water', type2: 'flying' },   
  { type1: 'water', type2: 'ground' },   
  { type1: 'water', type2: 'ice' },      
  { type1: 'grass', type2: 'poison' },   
  { type1: 'electric', type2: 'flying' },
  { type1: 'grass', type2: 'dark' },     
  { type1: 'water', type2: 'rock' },     
  { type1: 'water', type2: 'psychic' },  
  { type1: 'water', type2: 'poison' },
];

const TOTAL_RONDAS = 16;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs9(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}