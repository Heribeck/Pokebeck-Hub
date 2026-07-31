// UI del Sistema de Ligas - Generación de tarjetas y manejo de modal

import { datosLigas } from './ligas-datos.js';
import {
  scrollCampista,
  scrollAs,
  scrollCampeon,
  modalDetalles,
  modalTituloNivel,
  modalDescripcionNivel,
  modalEspecificacionesNivel,
  btnCerrarModal,
  btnIniciarNivel,
  ligas,
  poketype,
} from '../config.js';

let nivelSeleccionado = null;

// Generar tarjetas para todas las ligas
export function generarTarjetasLigas() {
  generarTarjetasLiga('campista', scrollCampista);
  generarTarjetasLiga('as', scrollAs);
  generarTarjetasLiga('campeon', scrollCampeon);
}

// Generar tarjetas para una liga específica
function generarTarjetasLiga(ligaKey, scrollContainer) {
  const liga = datosLigas[ligaKey];
  
  liga.niveles.forEach((nivel, index) => {
    const tarjeta = document.createElement('div');
    tarjeta.className = `tarjeta-nivel ${ligaKey}`;
    tarjeta.dataset.nivelId = nivel.id;
    tarjeta.dataset.liga = ligaKey;
    
    tarjeta.innerHTML = `
      <span class="tarjeta-numero">${index + 1}/7</span>
      <span class="tarjeta-titulo">${nivel.titulo}</span>
    `;
    
    tarjeta.addEventListener('click', () => abrirModalDetalles(nivel, ligaKey));
    scrollContainer.appendChild(tarjeta);
  });
}

// Abrir modal con detalles del nivel
function abrirModalDetalles(nivel, ligaKey) {
  nivelSeleccionado = { ...nivel, liga: ligaKey };
  
  modalTituloNivel.textContent = nivel.titulo;
  modalDescripcionNivel.textContent = nivel.descripcion;
  modalEspecificacionesNivel.textContent = nivel.especificaciones;
  
  modalDetalles.style.display = 'flex';
}

// Cerrar modal
function cerrarModal() {
  modalDetalles.style.display = 'none';
  nivelSeleccionado = null;
}

// Iniciar nivel (por ahora solo UI, sin lógica de juego)
function iniciarNivel() {
  if (!nivelSeleccionado) return;
  
  console.log('Iniciando nivel:', nivelSeleccionado.titulo);
  console.log('Liga:', nivelSeleccionado.liga);
  console.log('ID:', nivelSeleccionado.id);
  
  // Por ahora solo cerrar el modal y volver a poketype
  cerrarModal();
  ligas.style.display = 'none';
  poketype.style.display = 'flex';
  
  // TODO: Implementar lógica de inicio de nivel según la configuración
  // Aquí se iniciará el juego con los parámetros específicos del nivel
}

// Event listeners
btnCerrarModal.addEventListener('click', cerrarModal);
btnIniciarNivel.addEventListener('click', iniciarNivel);

// Cerrar modal al hacer clic fuera del contenido
modalDetalles.addEventListener('click', (e) => {
  if (e.target === modalDetalles) {
    cerrarModal();
  }
});

// Inicializar tarjetas cuando se cargue el módulo
generarTarjetasLigas();
