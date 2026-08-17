const COMBOS_NIVEL = [
  { type1: 'bug', type2: 'fairy' },       //Ribombee - Cutiefly
  { type1: 'bug', type2: 'ice' },         //Snom - Frosmoth
  { type1: 'dark', type2: 'ghost' },      //Sableye - Spiritomb
  { type1: 'dark', type2: 'psychic' },    //Malamar - Inkay   
  { type1: 'dragon', type2: 'normal' },   //Cyclizar - Drampa
  { type1: 'dragon', type2: 'psychic' },  //Latios - Latias
  { type1: 'dragon', type2: 'rock' },     //Tyrunt - Tyrantrum
  { type1: 'electric', type2: 'fairy' },  //Tapu Koko - Dendenne
  { type1: 'electric', type2: 'ground' }, //Stunfisk - Pelarena
];

const VECES_POR_COMBO = 2;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon7(generador = Math.random) {
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