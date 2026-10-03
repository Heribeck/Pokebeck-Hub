// Calcula la velocidad dinámica basada en la ronda actual.
// Aumenta en 3 incrementos iguales durante el nivel, máximo +1 sobre la velocidad base.
export function calcularVelocidadDinamica(velocidadBase, rondaActual, totalRondas) {
  const incrementoPorParte = 1 / 3;
  const rondasPorParte = totalRondas / 3;
  const parteActual = Math.floor(rondaActual / rondasPorParte);
  const incremento = Math.min(parteActual * incrementoPorParte, 1);

  return velocidadBase + incremento;
}
