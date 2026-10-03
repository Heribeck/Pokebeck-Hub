import { getToday } from "../../../../../shared/time/index.js";

function convertTextToSeed(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0; 
  }
  return hash;
}

function createMulberry32(semilla) {
  return function nextNumber() {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDailyGenerator() {
  const semilla = convertTextToSeed(getToday());
  return createMulberry32(semilla);
}

export function pickRandom(array, generador) {
  const indice = Math.floor(generador() * array.length);
  return array[indice];
}

export function shuffleWithGenerator(array, generador) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(generador() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}