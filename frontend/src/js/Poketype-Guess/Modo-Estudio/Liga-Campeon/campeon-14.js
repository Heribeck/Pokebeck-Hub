const COMBOS_NIVEL = [
  { type1: 'electric', type2: 'rock' },       //Ferropuas
  { type1: 'fairy', type2: 'fighting' },      //Ferropaladin
  { type1: 'fairy', type2: 'poison' },        //Fezandipiti
  { type1: 'fighting', type2: 'ground' },     //Colmilargo
  { type1: 'fighting', type2: 'ice' },        //Crabominable
  { type1: 'fighting', type2: 'rock' },       //Terrakion
  { type1: 'fire', type2: 'grass' },          //Scovillain
  { type1: 'fire', type2: 'steel' },          //Heatran
  { type1: 'normal', type2: 'water' },        //Bibarel
  { type1: 'ghost', type2: 'ice' },           //Froslass
  { type1: 'fire', type2: 'water' },          //Volcanion
  { type1: 'poison', type2: 'psychic' },      //Munkidori
  { type1: 'steel', type2: 'water' },         //Empoleon
  { type1: 'bug', type2: 'ground' },          //Nincada
  { type1: 'dark', type2: 'electric' },       //Morpeko
  { type1: 'ghost', type2: 'electric' },      //Rotom
  { type1: 'ice', type2: 'electric' },        //Arctozolt
  { type1: 'bug', type2: 'dark' },            //Lokix
];

const VECES_POR_COMBO = 1;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon14(generador = Math.random) {
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