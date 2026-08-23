const COMBOS_NIVEL = [
  //Grimer Alola - Muk Alola - Qwilfish Hisui
  { type1: 'dark', type2: 'poison' },     

  //Rotom Mow - Voltorb Hisui - Electrode Hisui
  { type1: 'electric', type2: 'grass' },  

  //Geodude Alola - Graveler Alola - Golem Alola
  { type1: 'electric', type2: 'rock' },    

  //Marowak Alola - Marowak Totem - Typhlosion Hisui
  { type1: 'fire', type2: 'ghost' },      

  //Oricorio Pau - Articuno Galar - Braviary Hisui
  { type1: 'psychic', type2: 'flying' },

   //Diglett Alola - Dugtrio Alola - Stunfisk Galar
  { type1: 'ground', type2: 'steel' },  
];

const VECES_POR_COMBO = 3;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampeon9(generador = Math.random) {
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