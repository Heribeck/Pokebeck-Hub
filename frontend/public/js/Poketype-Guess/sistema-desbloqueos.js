// Sistema de Desbloqueos Progresivo
import { obtenerNivelesCompletados } from './Modo-Estudio/progresoNivelesStorage.js';
import { datosLigas } from './Modo-Estudio/ligas-datos.js';
import { mostrarNotificacion } from './utils.js';

const CLAVE_DESBLOQUEOS = 'pokeTypeDesbloqueos';

// IDs de desbloqueos
const DESBLOQUEOS = {
  ENTRENAMIENTO_FACIL: 'entrenamiento-facil',
  ENTRENAMIENTO_NORMAL: 'entrenamiento-normal',
  ENTRENAMIENTO_DIFICIL: 'entrenamiento-dificil',
  DESAFIO_DIA: 'desafio-dia',
  LIGA_AS: 'liga-as',
  LIGA_CAMPEON: 'liga-campeon',
};

// Requerimientos de desbloqueo
const REQUERIMIENTOS = {
  [DESBLOQUEOS.ENTRENAMIENTO_FACIL]: {
    tipo: 'nivel',
    nivel: 'campista-3',
    mensaje: 'Completa el Nivel 3 de la Liga Campista para desbloquear',
  },
  [DESBLOQUEOS.ENTRENAMIENTO_NORMAL]: {
    tipo: 'nivel',
    nivel: 'as-9',
    mensaje: 'Completa el Nivel 9 de la Liga As para desbloquear',
  },
  [DESBLOQUEOS.ENTRENAMIENTO_DIFICIL]: {
    tipo: 'nivel',
    nivel: 'campeon-7',
    mensaje: 'Completa el Nivel 7 de la Liga Campeón para desbloquear',
  },
  [DESBLOQUEOS.DESAFIO_DIA]: {
    tipo: 'nivel',
    nivel: 'campeon-1',
    mensaje: 'Completa el nivel 1 de la Liga Campeón para desbloquear',
  },
  [DESBLOQUEOS.LIGA_AS]: {
    tipo: 'liga',
    liga: 'campista',
    mensaje: 'Completa toda la Liga Campista para desbloquear',
  },
  [DESBLOQUEOS.LIGA_CAMPEON]: {
    tipo: 'liga',
    liga: 'as',
    mensaje: 'Completa toda la Liga As para desbloquear',
  },
};

// Obtener desbloqueos guardados
function obtenerDesbloqueos() {
  try {
    const guardado = localStorage.getItem(CLAVE_DESBLOQUEOS);
    return guardado ? JSON.parse(guardado) : {};
  } catch (error) {
    console.error('Error al obtener desbloqueos:', error);
    return {};
  }
}

// Guardar desbloqueo
function guardarDesbloqueo(id) {
  try {
    const desbloqueos = obtenerDesbloqueos();
    desbloqueos[id] = true;
    localStorage.setItem(CLAVE_DESBLOQUEOS, JSON.stringify(desbloqueos));
    return true;
  } catch (error) {
    console.error('Error al guardar desbloqueo:', error);
    return false;
  }
}

// Verificar si un elemento está desbloqueado
export function estaDesbloqueado(id) {
  const desbloqueos = obtenerDesbloqueos();
  return desbloqueos[id] === true;
}

// Mostrar mensaje de elemento bloqueado
export function mostrarMensajeBloqueo(id) {
  const requerimiento = REQUERIMIENTOS[id];
  if (requerimiento) {
    mostrarNotificacion(`🔒 ${requerimiento.mensaje}`);
  }
}

// Mostrar anuncio de desbloqueo
export function mostrarAnuncioDesbloqueo(titulo, mensaje) {
  const anuncio = document.getElementById('anuncio-desbloqueo');
  const tituloElement = document.getElementById('anuncio-titulo');
  const mensajeElement = document.getElementById('anuncio-mensaje');
  
  if (anuncio && tituloElement && mensajeElement) {
    tituloElement.textContent = titulo;
    mensajeElement.textContent = mensaje;
    
    anuncio.classList.add('mostrar');
    
    // Vibración distintiva
    navigator.vibrate([200, 100, 200, 100, 400]);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
      anuncio.classList.remove('mostrar');
    }, 4000);
  }
}

// Verificar si se cumplen condiciones de desbloqueo
async function verificarCondicionDesbloqueo(id) {
  const requerimiento = REQUERIMIENTOS[id];
  if (!requerimiento) return false;
  
  const idsCompletados = await obtenerNivelesCompletados();
  
  if (requerimiento.tipo === 'nivel') {
    return idsCompletados.includes(requerimiento.nivel);
  } else if (requerimiento.tipo === 'liga') {
    const liga = datosLigas[requerimiento.liga];
    if (!liga) return false;
    
    const nivelesLiga = liga.niveles.map(n => n.id);
    const completadosEnLiga = nivelesLiga.filter(n => idsCompletados.includes(n));
    return completadosEnLiga.length === nivelesLiga.length;
  }
  
  return false;
}

// Verificar y procesar desbloqueos
export async function verificarDesbloqueos(nivelId, ligaId) {
  const nuevosDesbloqueos = [];
  
  // Verificar desbloqueos por nivel
  for (const [id, requerimiento] of Object.entries(REQUERIMIENTOS)) {
    if (requerimiento.tipo === 'nivel' && requerimiento.nivel === nivelId) {
      if (!estaDesbloqueado(id) && await verificarCondicionDesbloqueo(id)) {
        guardarDesbloqueo(id);
        nuevosDesbloqueos.push(id);
      }
    }
  }
  
  // Verificar desbloqueos por liga
  if (ligaId) {
    const liga = datosLigas[ligaId];
    if (liga) {
      const idsCompletados = await obtenerNivelesCompletados();
      const nivelesLiga = liga.niveles.map(n => n.id);
      const completadosEnLiga = nivelesLiga.filter(n => idsCompletados.includes(n));
      
      if (completadosEnLiga.length === nivelesLiga.length) {
        for (const [id, requerimiento] of Object.entries(REQUERIMIENTOS)) {
          if (requerimiento.tipo === 'liga' && requerimiento.liga === ligaId) {
            if (!estaDesbloqueado(id) && await verificarCondicionDesbloqueo(id)) {
              guardarDesbloqueo(id);
              nuevosDesbloqueos.push(id);
            }
          }
        }
      }
    }
  }
  
  // Mostrar anuncios para nuevos desbloqueos
  for (const id of nuevosDesbloqueos) {
    const titulo = obtenerTituloDesbloqueo(id);
    const mensaje = obtenerMensajeDesbloqueo(id);
    mostrarAnuncioDesbloqueo(titulo, mensaje);
  }
  
  return nuevosDesbloqueos;
}

// Obtener título del desbloqueo
function obtenerTituloDesbloqueo(id) {
  const titulos = {
    [DESBLOQUEOS.ENTRENAMIENTO_FACIL]: '¡ENTRENAMIENTO FÁCIL DESBLOQUEADO!',
    [DESBLOQUEOS.ENTRENAMIENTO_NORMAL]: '¡ENTRENAMIENTO NORMAL DESBLOQUEADO!',
    [DESBLOQUEOS.ENTRENAMIENTO_DIFICIL]: '¡ENTRENAMIENTO DIFÍCIL DESBLOQUEADO!',
    [DESBLOQUEOS.DESAFIO_DIA]: '¡DESAFÍO DEL DÍA DESBLOQUEADO!',
    [DESBLOQUEOS.LIGA_AS]: '¡LIGA AS DESBLOQUEADA!',
    [DESBLOQUEOS.LIGA_CAMPEON]: '¡LIGA CAMPEÓN DESBLOQUEADA!',
  };
  return titulos[id] || '¡NUEVO DESBLOQUEO!';
}

// Obtener mensaje del desbloqueo
function obtenerMensajeDesbloqueo(id) {
  const mensajes = {
    [DESBLOQUEOS.ENTRENAMIENTO_FACIL]: 'Ahora puedes entrenar con dificultad Fácil',
    [DESBLOQUEOS.ENTRENAMIENTO_NORMAL]: 'Ahora puedes entrenar con dificultad Normal',
    [DESBLOQUEOS.ENTRENAMIENTO_DIFICIL]: 'Ahora puedes entrenar con dificultad Difícil',
    [DESBLOQUEOS.DESAFIO_DIA]: 'El Desafío del Día está disponible',
    [DESBLOQUEOS.LIGA_AS]: 'La Liga As está desbloqueada',
    [DESBLOQUEOS.LIGA_CAMPEON]: 'La Liga Campeón está desbloqueada',
  };
  return mensajes[id] || 'Has desbloqueado algo nuevo';
}

// Verificar desbloqueos pendientes al iniciar la app
export async function verificarDesbloqueosPendientes() {
  const idsCompletados = await obtenerNivelesCompletados();
  const nuevosDesbloqueos = [];
  
  for (const [id, requerimiento] of Object.entries(REQUERIMIENTOS)) {
    if (!estaDesbloqueado(id) && await verificarCondicionDesbloqueo(id)) {
      guardarDesbloqueo(id);
      nuevosDesbloqueos.push(id);
    }
  }
  
  // Mostrar anuncios para desbloqueos pendientes
  for (const id of nuevosDesbloqueos) {
    const titulo = obtenerTituloDesbloqueo(id);
    const mensaje = obtenerMensajeDesbloqueo(id);
    mostrarAnuncioDesbloqueo(titulo, mensaje);
  }
  
  return nuevosDesbloqueos;
}

export { DESBLOQUEOS };
