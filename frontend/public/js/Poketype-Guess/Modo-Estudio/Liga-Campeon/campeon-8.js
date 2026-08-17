const COMBOS_NIVEL = [
  { type1: 'electric', type2: 'normal' },   //Helioptile - Heliolisk 
  { type1: 'electric', type2: 'poison' },   //Toxel - Toxtricity
  { type1: 'electric', type2: 'water' },    //Chinchou - Lanturn
  { type1: 'fairy', type2: 'ghost' },       //Mimikyu - Melenaleteo
  { type1: 'fairy', type2: 'rock' },        //Carbink - Diancie
  { type1: 'fighting', type2: 'flying' },   //Hawlucha - Flamigo
  { type1: 'fighting', type2: 'ghost' },    //Marshadow - Annihilape
  { type1: 'fighting', type2: 'normal' },   //Stufful - Bewear
  { type1: 'fighting', type2: 'steel' },    //Lucario - Cobalion
];

const VECES_POR_COMBO = 2;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon8(generador = Math.random) {
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