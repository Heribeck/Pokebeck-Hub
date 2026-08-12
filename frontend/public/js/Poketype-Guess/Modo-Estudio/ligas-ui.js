// UI del Sistema de Ligas - Generación de tarjetas con estado REAL
// (completado / desbloqueado / bloqueado), usando HX y progreso guardado.

import { datosLigas } from './ligas-datos.js';
import {
  contenedorLigas,
  contenedorNiveles,
  vistaLigas,
  vistaNivelesLiga,
  cabeceraLiga,
  ligaEmoji,
  ligaTitulo,
  ligaDescripcion,
  btnVolverLigas,
  btnVolverPoketypeLigas,
  modalDetalles,
  modalTituloNivel,
  modalDescripcionNivel,
  modalEspecificacionesNivel,
  modalEstadoNivel,
  modalEstadoIcono,
  modalEstadoTexto,
  modalRequisitos,
  modalHxFaltante,
  btnCerrarModal,
  btnIniciarNivel,
  ligas,
  poketype,
} from '../config.js';
import { iniciarNivelEstudio } from './estudio.js';
import { obtenerNivelesCompletados } from './progresoNivelesStorage.js';
import { obtenerHX } from '../hx-storage.js';

let nivelSeleccionado = null;

// Determina el estado real de un nivel: 'completado' | 'desbloqueado' | 'bloqueado'
function calcularEstadoNivel(nivel, hxActual, idsCompletados) {
  if (idsCompletados.includes(nivel.id)) return 'completado';
  if (hxActual >= nivel.hxRequerido) return 'desbloqueado';
  return 'bloqueado';
}

// Genera las 3 tarjetas de liga con su progreso real y estado de bloqueo
export async function generarTarjetasLigas() {
  const [hxActual, idsCompletados] = await Promise.all([
    obtenerHX(),
    obtenerNivelesCompletados(),
  ]);

  contenedorLigas.innerHTML = '';

  Object.keys(datosLigas).forEach(ligaKey => {
    const liga = datosLigas[ligaKey];
    const primerNivel = liga.niveles[0];
    const ligaBloqueada = hxActual < primerNivel.hxRequerido;

    const completadosEnLiga = liga.niveles.filter(n => idsCompletados.includes(n.id)).length;
    const porcentaje = Math.round((completadosEnLiga / liga.niveles.length) * 100);

    const tarjeta = document.createElement('div');
    tarjeta.className = `tarjeta-liga ${ligaBloqueada ? 'tarjeta-liga-bloqueada' : ''}`;
    tarjeta.dataset.liga = ligaKey;

    const estadoFooter = ligaBloqueada
      ? `<span class="estado-liga estado-bloqueado">🔒 Necesitas ${primerNivel.hxRequerido - hxActual} HX más</span>`
      : `<span class="estado-liga estado-desbloqueado">🔓 Desbloqueado</span>`;

    tarjeta.innerHTML = `
      <div class="tarjeta-liga-header">
        <span class="liga-emoji">${liga.emoji}</span>
        <div>
          <h3 class="liga-nombre">${liga.nombre}</h3>
        </div>
      </div>
      <div class="tarjeta-liga-progreso">
        <div class="barra-progreso-liga">
          <div class="barra-progreso-fill" style="width: ${porcentaje}%;"></div>
        </div>
        <span class="texto-progreso">${completadosEnLiga}/${liga.niveles.length} niveles</span>
      </div>
      <div class="tarjeta-liga-footer">
        ${estadoFooter}
      </div>
      ${ligaBloqueada ? '<div class="tarjeta-liga-overlay bloqueado"><span class="candado">🔒</span></div>' : ''}
    `;

    tarjeta.addEventListener('click', () => mostrarVistaNiveles(ligaKey));
    contenedorLigas.appendChild(tarjeta);
  });
}

// Mostrar vista de niveles de una liga específica, con estado real por nivel
async function mostrarVistaNiveles(ligaKey) {
  const liga = datosLigas[ligaKey];

  const [hxActual, idsCompletados] = await Promise.all([
    obtenerHX(),
    obtenerNivelesCompletados(),
  ]);

  ligaEmoji.textContent = liga.emoji;
  ligaTitulo.textContent = liga.nombre;
  ligaDescripcion.textContent = liga.descripcion;

  contenedorNiveles.innerHTML = '';

  liga.niveles.forEach((nivel, index) => {
    const estado = calcularEstadoNivel(nivel, hxActual, idsCompletados);
    const esExamen = nivel.especial === 'jefe-liga';
    const esRiesgoCritico = nivel.especial === 'riesgo-critico';
    const esTiempoDinamico = nivel.tiempoDinamico === true || nivel.tiempoDinamico === 'true';

    const tarjeta = document.createElement('div');
    tarjeta.className = `tarjeta-nivel ${esExamen ? 'tarjeta-nivel-examen' : ''} ${esRiesgoCritico ? 'tarjeta-nivel-riesgo' : ''} tarjeta-nivel-${estado}`;
    tarjeta.dataset.nivelId = nivel.id;
    tarjeta.dataset.estado = estado;

    const iconoEstado = { completado: '✅', desbloqueado: '🔓', bloqueado: '🔒' }[estado];

    const tiempoEtiqueta = {
      'sin-presion': '⏱️ Sin presión',
      'moderado': '⏱️ Moderado',
      'dinamico': '⏱️ Dinámico',
      'dinamico-moderado': '⏱️ Dinámico',
      'rapido': '⏱️ Rápido',
      'extremo': '⏱️ Extremo'
    }[nivel.tiempo] || '⏱️ ' + nivel.tiempo;

    const filtroEtiqueta = {
      'gen-1': '📍 Gen 1',
      'gen-1-3': '📍 Gen 1-3',
      'gen-4-5': '📍 Gen 4-5',
      'gen-6-9': '📍 Gen 6-9',
      'todas': '🌍 Todas'
    }[nivel.filtroGeneracion] || '🌍 ' + nivel.filtroGeneracion;

    const infoBloqueo = estado === 'bloqueado'
      ? `<div class="nivel-bloqueo-info"><span class="candado">🔒</span><span class="hx-faltante">Necesitas ${nivel.hxRequerido - hxActual} HX más</span></div>`
      : '';

    tarjeta.innerHTML = `
      <div class="tarjeta-nivel-header">
        <span class="nivel-numero">Nivel ${index + 1} de ${liga.niveles.length}</span>
        <span class="nivel-estado-icono">${iconoEstado}</span>
      </div>
      <h4 class="nivel-titulo">${nivel.titulo}</h4>
      <div class="nivel-info">
        <span class="info-item">🎯 ${nivel.rondas} rondas</span>
        <span class="info-item">❤️ ${nivel.corazonesError}</span>
        <span class="info-item">${tiempoEtiqueta}</span>
        <span class="info-item">${nivel.repeticion ? '🔄 Permitida' : '🚫 No repetir'}</span>
        <span class="info-item">${filtroEtiqueta}</span>
      </div>
      <div class="nivel-etiquetas">
        ${esExamen ? '<span class="etiqueta especial">🏆 Jefe de Liga</span>' : ''}
        ${esRiesgoCritico ? '<span class="etiqueta riesgo-critico">⚠️ Riesgo Crítico</span>' : ''}
        ${esTiempoDinamico ? '<span class="etiqueta tiempo-dinamico">⚡ Tiempo Dinámico</span>' : ''}
      </div>
      ${infoBloqueo}
    `;

    tarjeta.addEventListener('click', () => abrirModalDetalles(nivel, ligaKey, estado, hxActual));
    contenedorNiveles.appendChild(tarjeta);
  });

  vistaLigas.style.display = 'none';
  vistaNivelesLiga.style.display = 'flex';
}

// Volver a vista de ligas (recalcula por si cambió el progreso mientras tanto)
async function volverALigas() {
  vistaNivelesLiga.style.display = 'none';
  vistaLigas.style.display = 'flex';
  await generarTarjetasLigas();
}

// Abrir modal con detalles del nivel, mostrando estado real
function abrirModalDetalles(nivel, ligaKey, estado, hxActual) {
  nivelSeleccionado = { ...nivel, liga: ligaKey };

  modalTituloNivel.textContent = nivel.titulo;
  modalDescripcionNivel.textContent = nivel.descripcion;
  modalEspecificacionesNivel.textContent = nivel.especificaciones;

  const estadoInfo = {
    completado: { icono: '✅', texto: 'Completado' },
    desbloqueado: { icono: '🔓', texto: 'Desbloqueado' },
    bloqueado: { icono: '🔒', texto: 'Bloqueado' },
  }[estado];

  modalEstadoIcono.textContent = estadoInfo.icono;
  modalEstadoTexto.textContent = estadoInfo.texto;

  if (estado === 'bloqueado') {
    modalRequisitos.style.display = 'flex';
    modalHxFaltante.textContent = `Necesitas ${nivel.hxRequerido - hxActual} HX más para desbloquear este nivel`;
    btnIniciarNivel.style.display = 'none';
  } else {
    modalRequisitos.style.display = 'none';
    btnIniciarNivel.style.display = 'flex';
    btnIniciarNivel.textContent = estado === 'completado' ? 'Jugar de Nuevo' : 'Iniciar Nivel';
  }

  modalDetalles.style.display = 'flex';
}

// Cerrar modal
function cerrarModal() {
  modalDetalles.style.display = 'none';
  nivelSeleccionado = null;
}

// Iniciar nivel
function iniciarNivel() {
  if (!nivelSeleccionado) return;
  const nivelId = nivelSeleccionado.id;
  cerrarModal();
  iniciarNivelEstudio(nivelId);
}

// Event listeners
btnCerrarModal.addEventListener('click', cerrarModal);
btnIniciarNivel.addEventListener('click', iniciarNivel);
btnVolverLigas.addEventListener('click', volverALigas);
btnVolverPoketypeLigas.addEventListener('click', () => {
  ligas.style.display = 'none';
  poketype.style.display = 'flex';
});

// Cerrar modal al hacer clic fuera del contenido
modalDetalles.addEventListener('click', (e) => {
  if (e.target === modalDetalles) {
    cerrarModal();
  }
});

// Inicializar tarjetas cuando se cargue el módulo
generarTarjetasLigas();