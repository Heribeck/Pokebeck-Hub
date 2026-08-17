const COMBOS_NIVEL = [
  { type1: 'grass', type2: 'fairy' },       // Mega Meganium
  { type1: 'water', type2: 'dragon' },      // Mega Feraligatr
  { type1: 'rock', type2: 'fighting' },     // Mega Barbaracle
  { type1: 'dark', type2: 'rock' },         // Mega Tyranitar
  { type1: 'dark', type2: 'ghost' },        // Mega Absol Z
  { type1: 'fighting', type2: 'flying' },   // Mega Staraptor
  { type1: 'bug', type2: 'steel' },         // Mega Golisopod
  { type1: 'steel', type2: 'steel' },       // Mega Aggron
  { type1: 'dragon', type2: 'dragon' },     // Mega Garchomp Z
  { type1: 'bug', type2: 'flying' },        // Mega Pinsir  
];
const VECES_POR_COMBO = 1;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon12(generador = Math.random) {
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
