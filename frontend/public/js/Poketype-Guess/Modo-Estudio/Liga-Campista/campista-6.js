// Generador de la "cola de rondas" para el nivel campista-6 (El Primer Filtro).
// A diferencia de los niveles anteriores (cobertura fija garantizada), este
// es un REPASO MEZCLADO: elige 12 rondas al azar entre todos los tipos ya
// vistos en campista-1 a campista-5. La verdadera dificultad nueva aquí no
// es el contenido, es que "no repetir" se activa por primera vez (eso vive
// en estudio.js, no en este archivo).

const POOL_YA_VISTO = [
  // Monotipos (campista-1, campista-2, campista-3)
  { type1: 'fire', type2: 'fire' },
  { type1: 'water', type2: 'water' },
  { type1: 'grass', type2: 'grass' },
  { type1: 'normal', type2: 'normal' },
  { type1: 'electric', type2: 'electric' },
  { type1: 'fighting', type2: 'fighting' },
  { type1: 'poison', type2: 'poison' },
  { type1: 'ground', type2: 'ground' },
  { type1: 'bug', type2: 'bug' },
  // Duplas (campista-4, campista-5)
  { type1: 'normal', type2: 'flying' },
  { type1: 'bug', type2: 'flying' },
  { type1: 'water', type2: 'poison' },
  { type1: 'grass', type2: 'poison' },
  { type1: 'water', type2: 'ground' },
  { type1: 'rock', type2: 'ground' },
  { type1: 'ghost', type2: 'poison' },
  { type1: 'psychic', type2: 'water' },
  
];

const TOTAL_RONDAS = 18;

// Elige 12 combinaciones al azar del pool ya visto (con reemplazo — el
// objetivo aquí es repaso variado, no cobertura garantizada como antes).
export function generarColaRondasCampista6(generador = Math.random) {
  const cola = [];

  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * POOL_YA_VISTO.length);
    cola.push({ ...POOL_YA_VISTO[indice] });
  }

  return cola;
}