// Generador de la "cola de rondas" para el nivel campista-4 (Duplas Comunes I).
// Cubre 4 combinaciones dobles muy reconocibles de Gen 1-3. Mismo patrón que
// los niveles de monotipo: garantiza cobertura real, cada combo aparece
// exactamente 4 veces, mezclado en orden aleatorio.

const COMBOS_NIVEL = [
  { type1: 'water', type2: 'ground' },
  { type1: 'rock', type2: 'ground' },
  { type1: 'ghost', type2: 'poison' },
  { type1: 'psychic', type2: 'water' },
];
const VECES_POR_COMBO = 4;

// Devuelve un array de 16 elementos: { type1, type2 }, cada una de las 4
// combinaciones apareciendo exactamente 4 veces, mezclado.
export function generarColaRondasCampista5(generador = Math.random) {
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