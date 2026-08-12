// Generador de la "cola de rondas" para el Nivel 1 (Monotipos Básicos).
// A diferencia de elegir tipos al azar cada ronda, aquí se GARANTIZA que
// cada uno de los 6 monotipos aparezca exactamente el número de veces indicado,
// mezclados en orden aleatorio — no es cuestión de suerte, es cobertura asegurada.

const TIPOS_MONOTIPO_NIVEL_1 = ['fire', 'water','grass'];
const VECES_POR_TIPO_NIVEL_1 = 3;

// Devuelve un array de 12 elementos: cada uno es { type1, type2 } con type1 === type2
// (monotipo), con cada uno de los 6 tipos apareciendo exactamente 2 veces, mezclado.
export function generarColaRondasCampista1(generador = Math.random) {
  const cola = [];

  TIPOS_MONOTIPO_NIVEL_1.forEach(tipo => {
    for (let i = 0; i < VECES_POR_TIPO_NIVEL_1; i++) {
      cola.push({ type1: tipo, type2: tipo });
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