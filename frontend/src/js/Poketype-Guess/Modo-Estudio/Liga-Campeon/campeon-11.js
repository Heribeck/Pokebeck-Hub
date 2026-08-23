//lista de combinaciones de tipos de las megas evolucinones
const COMBOS_NIVEL = [
  { type1: 'fire', type2: 'dragon' },          //Mega Charizard X 
  { type1: 'electric', type2: 'dragon' },      //Mega Ampharos
  { type1: 'grass', type2: 'dragon' },         //Mega Sceptile
  { type1: 'dragon', type2: 'fairy' },         //Mega Altaria
  { type1: 'normal', type2: 'fighting' },      //Mega Lopunny 
  { type1: 'normal', type2: 'fairy' },         //Mega Audino
  { type1: 'fairy', type2: 'flying' },         //Mega Clefable
  { type1: 'psychic', type2: 'water' },        //Mega Slowbro
  { type1: 'psychic', type2: 'steel' },        //Mega Metagross
  { type1: 'ground', type2: 'water' },         //Mega Swampert
];

const VECES_POR_COMBO = 1;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon11(generador = Math.random) {
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
