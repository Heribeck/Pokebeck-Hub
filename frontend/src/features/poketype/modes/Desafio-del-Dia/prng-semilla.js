//no entiendo esta funcion todavia...
function crearMulberry32(semilla) {
  return function siguienteNumero() {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // número entre 0 y 1, como Math.random()
  };
}

// Convierte un string (la fecha de hoy) en un número entero, usado como semilla
function convertirTextoASemilla(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0; // fuerza a entero de 32 bits
  }
  return hash;
}

// Devuelve la fecha de hoy en formato "YYYY-MM-DD", en la zona horaria local del dispositivo
function obtenerFechaDeHoy() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Crea un generador de números aleatorios reproducible para el día de hoy.
// Llamar a esta función varias veces el mismo día siempre da la MISMA secuencia
// (necesario para que reintentar el Desafío del Día repita las mismas preguntas).
export function crearGeneradorDelDia() {
  const semilla = convertirTextoASemilla(obtenerFechaDeHoy());
  return crearMulberry32(semilla);
}

// Utilidad: elige un elemento al azar de un array, usando un generador dado (mismo patrón que Math.random(), pero recibe el generador como parámetro)
export function elegirAlAzar(array, generador) {
  const indice = Math.floor(generador() * array.length);
  return array[indice];
}

// Utilidad: mezcla (shuffle) un array usando un generador dado, sin mutar el original
export function mezclarConGenerador(array, generador) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(generador() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}