// Generador de la "cola de rondas" para el nivel campista-2 (Monotipo Básico II).
// Cubre Normal, Eléctrico y Lucha. Mismo patrón que campista-1: garantiza
// cobertura real (cada tipo exactamente 3 veces), mezclado en orden aleatorio.

const TIPOS_NIVEL = ['normal', 'electric', 'fighting'];
const VECES_POR_TIPO = 3;

// Devuelve un array de 9 elementos: { type1, type2 } con type1 === type2
// (monotipo), cada uno de los 3 tipos apareciendo exactamente 3 veces, mezclado.
export function generarColaRondasCampista2(generador = Math.random) {
  const cola = [];

  TIPOS_NIVEL.forEach(tipo => {
    for (let i = 0; i < VECES_POR_TIPO; i++) {
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