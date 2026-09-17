// campista-7 (Duplas de Kanto): combos variados exclusivos de Gen 1.
// El filtro de generación ya lo aplica estudio.js vía filtroGeneracion: "gen-1".

const COMBOS_NIVEL = [
  { type1: 'bug', type2: 'poison' },
  { type1: 'ghost', type2: 'poison' },
  { type1: 'ground', type2: 'rock' },
  { type1: 'poison', type2: 'grass' },
];
const VECES_POR_COMBO = 3;

export function generarColaRondasCampista7(generador = Math.random) {
  const cola = [];

  COMBOS_NIVEL.forEach(combo => {
    for (let i = 0; i < VECES_POR_COMBO; i++) {
      cola.push({ type1: combo.type1, type2: combo.type2 });
    }
  });

  return mezclar(cola, generador);
}

function mezclar(array, generador) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(generador() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}