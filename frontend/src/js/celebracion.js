export function celebrarHito(scoreActual) {
  if (scoreActual % 5 === 0 && scoreActual > 0) {
    mostrarCelebracion(`¡Racha de ${scoreActual}!`);
  }
}

export function mostrarCelebracion(anuncio) {
  vibrarCelebracion();

  const celebracionContainer = document.createElement('div');
  celebracionContainer.className = 'celebracion-container';
  document.body.appendChild(celebracionContainer);

  const mensaje = document.createElement('div');
  mensaje.className = 'celebracion-mensaje';
  mensaje.textContent = anuncio;
  celebracionContainer.appendChild(mensaje);

  crearConfeti(celebracionContainer);

  setTimeout(() => {
    celebracionContainer.remove();
  }, 2000);
}

function vibrarCelebracion() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 300]);
  }
}

function crearConfeti(container) {
  const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const numParticulas = 50;

  for (let x = 0; x < numParticulas; x++) {
    const particula = document.createElement('div');
    particula.className = 'confeti-particula';
    
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
