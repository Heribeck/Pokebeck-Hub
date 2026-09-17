const TIPOS_MONOTIPO_NIVEL_1 = ['normal', 'electric','fighting'];
const VECES_POR_TIPO_NIVEL_1 = 6;

// Devuelve un array de 12 elementos: cada uno es { type1, type2 } con type1 === type2
// (monotipo), con cada uno de los 6 tipos apareciendo exactamente 2 veces, mezclado.
export function generarColaRondasCampeon2(generador = Math.random) {
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