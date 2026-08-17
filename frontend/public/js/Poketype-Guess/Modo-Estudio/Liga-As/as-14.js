const POOL_YA_VISTO = [
  { type1: 'ghost', type2: 'poison' },  
  { type1: 'dark', type2: 'flying' },   
  { type1: 'psychic', type2: 'flying' },  
  { type1: 'ghost', type2: 'fire' },    
  { type1: 'psychic', type2: 'grass' }, 
  { type1: 'psychic', type2: 'fairy' }, 
  { type1: 'ghost', type2: 'grass' },  
  { type1: 'psychic', type2: 'normal' },
  { type1: 'dragon', type2: 'flying' },
  { type1: 'dragon', type2: 'ground' },  
  { type1: 'fighting', type2: 'psychic' },
  { type1: 'fighting', type2: 'dark' },   
  { type1: 'dragon', type2: 'water' },    
  { type1: 'dragon', type2: 'grass' },    
  { type1: 'dragon', type2: 'electric' },
  { type1: 'rock', type2: 'ground' },   
  { type1: 'steel', type2: 'ground' },  
  { type1: 'rock', type2: 'water' },    
  { type1: 'steel', type2: 'psychic' }, 
  { type1: 'steel', type2: 'fairy' },   
  { type1: 'steel', type2: 'flying' },  
  { type1: 'rock', type2: 'flying' }, 
  { type1: 'steel', type2: 'bug' },  
  { type1: 'rock', type2: 'bug' },      
  { type1: 'steel', type2: 'dragon' },
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
  { type1: 'water', type2: 'poison' }
];

const TOTAL_RONDAS = 20;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasAs14(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}