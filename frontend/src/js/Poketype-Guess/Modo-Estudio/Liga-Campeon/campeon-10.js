const COMBOS_NIVEL = [ 

  //Sliggo Hisui - Goodra Hisui
  { type1: 'dragon', type2: 'steel' },  

  //Rotom Fan - Oricorio Pom Pom
  { type1: 'electric', type2: 'flying' }, 
  
  //Lilligant Hisui - Decidueye Hisui
  { type1: 'fighting', type2: 'grass' },   

  //Growlithe Hisui - Arcanine Hisui
  { type1: 'fire', type2: 'rock' },  

  //Zorua Hisui - Zoroak Hisui  
  { type1: 'ghost', type2: 'normal' },

  //Necrozma Dawn - Calyrex Shadow
  { type1: 'ghost', type2: 'psychic' },

  //Mr Mime Galar - Calyrex Ice
  { type1: 'ice', type2: 'psychic' },

  //Sandshrew Alola - Sandslash Alola
  { type1: 'ice', type2: 'steel' },

  //Urshifu Estilo Fluido - Tauros Aqua Paldea
  { type1: 'fighting', type2: 'water' },
];

const VECES_POR_COMBO = 2;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon10(generador = Math.random) {
  const cola = [];

  COMBOS_NIVEL.forEach(combo => {
    for (let i = 0; i < VECES_POR_COMBO; i++) {
      cola.push({ type1: combo.type1, type2: combo.type2 });
    }
  });

  return mezclar(cola, generador);
}

// Mezcla un array sin mutar el original (Fisher-Yates)
function mezclar(array, generador) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(generador() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
