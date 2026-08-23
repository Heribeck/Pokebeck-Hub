// Sistema de celebración para hitos de score (múltiplos de 5)
// Función reutilizable para los modos Campista, As de Batalla y Campeón

/**
 * Verifica si el score actual es un hito (múltiplo de 5) y dispara la celebración
 * @param {number} scoreActual - Score actual del jugador en el modo
 */
export function celebrarHito(scoreActual) {
  if (scoreActual % 5 === 0 && scoreActual > 0) {
    mostrarCelebracion(`¡Racha de ${scoreActual}!`);
  }
}

/**
 * Muestra la celebración visual con mensaje, confeti y vibración
 * @param {number} score - Score actual para mostrar en el mensaje
 */
export function mostrarCelebracion(anuncio) {
  // Vibración especial más larga
  vibrarCelebracion();

  // Crear contenedor de celebración
  const celebracionContainer = document.createElement('div');
  celebracionContainer.className = 'celebracion-container';
  document.body.appendChild(celebracionContainer);

  // Crear mensaje
  const mensaje = document.createElement('div');
  mensaje.className = 'celebracion-mensaje';
  mensaje.textContent = anuncio;
  celebracionContainer.appendChild(mensaje);

  // Crear confeti
  crearConfeti(celebracionContainer);

  // Limpiar después de 2 segundos
  setTimeout(() => {
    celebracionContainer.remove();
  }, 2000);
}

/**
 * Vibración especial para celebración
 */
function vibrarCelebracion() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 300]);
  }
}

/**
 * Crea partículas de confeti
 * @param {HTMLElement} container - Contenedor donde agregar el confeti
 */
function crearConfeti(container) {
  const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const numParticulas = 50;

  for (let i = 0; i < numParticulas; i++) {
    const particula = document.createElement('div');
    particula.className = 'confeti-particula';
    
    // Propiedades aleatorias
    const color = colores[Math.floor(Math.random() * colores.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 1 + Math.random() * 0.5;
    const size = 5 + Math.random() * 10;
    
    particula.style.backgroundColor = color;
    particula.style.left = `${left}%`;
    particula.style.animationDelay = `${delay}s`;
    particula.style.animationDuration = `${duration}s`;
    particula.style.width = `${size}px`;
    particula.style.height = `${size}px`;
    
    container.appendChild(particula);
  }
}
