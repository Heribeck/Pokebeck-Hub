// Configuración centralizada de velocidades de tiempo para el Modo Estudio.
// Cada nivel solo declara una ETIQUETA ("sin-presion", "moderado", etc.)
// en ligas-datos.js — este archivo es el único lugar donde se traduce esa
// etiqueta a un número real. Cambiar el ritmo de todo el juego es ajustar
// esta tabla, no ir nivel por nivel.

// null = sin temporizador (el nivel no tiene límite de tiempo por ronda)
// número = cuánto baja la barra por tick (más alto = más rápido = menos tiempo)
export const VELOCIDADES_TIEMPO = {
  'sin-presion': 0.2,
  'moderado': 1.5,
  'rapido': 2.5,
  'extremo': 3.5,
};

export function obtenerVelocidadTiempo(etiqueta) {
  return VELOCIDADES_TIEMPO[etiqueta] ?? null;
};  