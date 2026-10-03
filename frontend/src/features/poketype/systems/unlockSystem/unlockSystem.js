import { obtenerNivelesCompletados } from '../../modes/study/storage/levelProgressStorage.js';
import { datosLigas } from '../../modes/study/data/leaguesData.js';
import { showToast } from '../../../../shared/toast/index.js';

const KEY_UNLOCK = 'pokeTypeDesbloqueos';

export const UNLOCKS = {
  ENTRENAMIENTO_NORMAL: 'entrenamiento-normal',
  ENTRENAMIENTO_DIFICIL: 'entrenamiento-dificil',
  LIGA_AS: 'liga-as',
  LIGA_CAMPEON: 'liga-campeon',
};

const REQUERIMIENTOS = {
  [UNLOCKS.ENTRENAMIENTO_FACIL]: {
    tipo: 'nivel',
    nivel: 'campista-3',
    mensaje: 'Completa el Nivel 3 de la Liga Campista para desbloquear',
  },
  [UNLOCKS.ENTRENAMIENTO_NORMAL]: {
    tipo: 'liga',
    liga: 'campista',
    mensaje: 'Completa toda la Liga Campista para desbloquear',
  },
  [UNLOCKS.ENTRENAMIENTO_DIFICIL]: {
    tipo: 'liga',
    liga: 'as',
    mensaje: 'Completa toda la Liga As para desbloquear',
  },
  [UNLOCKS.LIGA_AS]: {
    tipo: 'liga',
    liga: 'campista',
    mensaje: 'Completa toda la Liga Campista para desbloquear',
  },
  [UNLOCKS.LIGA_CAMPEON]: {
    tipo: 'liga',
    liga: 'as',
    mensaje: 'Completa toda la Liga As para desbloquear',
  },
};

function obtenerDesbloqueos() {
  const guardado = localStorage.getItem(KEY_UNLOCK);
  return guardado ? JSON.parse(guardado) : {};
}

function guardarDesbloqueo(id) {
  const desbloqueos = obtenerDesbloqueos();
  desbloqueos[id] = true;
  localStorage.setItem(KEY_UNLOCK, JSON.stringify(desbloqueos));
  return true;
}

export function getLeagueUnlockState(ligaKey, idsCompletados) {
  const ligaKeys = Object.keys(datosLigas);
  const leagueIndex = ligaKeys.indexOf(ligaKey);
  if (leagueIndex < 0) {
    return { unlocked: false, requiredLeague: null };
  }
  if (leagueIndex === 0) {
    return { unlocked: true, requiredLeague: null };
  }

  const requiredLeague = ligaKeys[leagueIndex - 1];
  const requiredLevelIds = datosLigas[requiredLeague].niveles.map((nivel) => nivel.id);
  const unlocked = requiredLevelIds.every((id) => idsCompletados.includes(id));

  return { unlocked, requiredLeague };
}

export function getLevelUnlockState(ligaKey, nivelId, idsCompletados) {
  const leagueState = getLeagueUnlockState(ligaKey, idsCompletados);
  if (!leagueState.unlocked) {
    if (!leagueState.requiredLeague) {
      return { status: 'bloqueado', requiredLevel: null };
    }
    const requiredLeague = datosLigas[leagueState.requiredLeague];
    return {
      status: 'bloqueado',
      requiredLevel: requiredLeague.niveles[requiredLeague.niveles.length - 1],
    };
  }

  if (idsCompletados.includes(nivelId)) {
    return { status: 'completado', requiredLevel: null };
  }

  const league = datosLigas[ligaKey];
  if (!league) {
    return { status: 'bloqueado', requiredLevel: null };
  }

  const levelIndex = league.niveles.findIndex((nivel) => nivel.id === nivelId);
  if (levelIndex < 0) {
    return { status: 'bloqueado', requiredLevel: null };
  }
  if (levelIndex === 0) {
    return { status: 'desbloqueado', requiredLevel: null };
  }

  const requiredLevel = league.niveles[levelIndex - 1];
  return {
    status: idsCompletados.includes(requiredLevel.id) ? 'desbloqueado' : 'bloqueado',
    requiredLevel,
  };
}

export function estaDesbloqueado(id) {
  const desbloqueos = obtenerDesbloqueos();
  return desbloqueos[id] === true;
}

export function mostrarMensajeBloqueo(id) {
  const requerimiento = REQUERIMIENTOS[id];
  if (requerimiento) {
    showToast(`🔒 ${requerimiento.mensaje}`);
  }
}

export function mostrarAnuncioDesbloqueo(titulo, mensaje) {
  const anuncio = document.getElementById('anuncio-desbloqueo');
  const tituloElement = document.getElementById('anuncio-titulo');
  const mensajeElement = document.getElementById('anuncio-mensaje');
  
  if (anuncio && tituloElement && mensajeElement) {
    tituloElement.textContent = titulo;
    mensajeElement.textContent = mensaje;
    
    anuncio.classList.add('IsVisible');
    
    navigator.vibrate?.([200, 100, 200, 100, 400]);
    
    setTimeout(() => {
      anuncio.classList.remove('IsVisible');
    }, 4000);
  }
}

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

export async function verificarDesbloqueos(nivelId, ligaId) {
  const nuevosDesbloqueos = [];
  
  for (const [id, requerimiento] of Object.entries(REQUERIMIENTOS)) {
    if (requerimiento.tipo === 'nivel' && requerimiento.nivel === nivelId) {
      if (!estaDesbloqueado(id) && await verificarCondicionDesbloqueo(id)) {
        guardarDesbloqueo(id);
        nuevosDesbloqueos.push(id);
      }
    }
  }
  
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
  
  for (const id of nuevosDesbloqueos) {
    const titulo = obtenerTituloDesbloqueo(id);
    const mensaje = obtenerMensajeDesbloqueo(id);
    mostrarAnuncioDesbloqueo(titulo, mensaje);
  }
  
  return nuevosDesbloqueos;
}

function obtenerTituloDesbloqueo(id) {
  const titulos = {
    [UNLOCKS.ENTRENAMIENTO_NORMAL]: '¡ENTRENAMIENTO NORMAL DESBLOQUEADO!',
    [UNLOCKS.ENTRENAMIENTO_DIFICIL]: '¡ENTRENAMIENTO DIFÍCIL DESBLOQUEADO!',
    [UNLOCKS.DESAFIO_DIA]: '¡DESAFÍO DEL DÍA DESBLOQUEADO!',
    [UNLOCKS.LIGA_AS]: '¡LIGA AS DESBLOQUEADA!',
    [UNLOCKS.LIGA_CAMPEON]: '¡LIGA CAMPEÓN DESBLOQUEADA!',
  };
  return titulos[id] || '¡NUEVO DESBLOQUEO!';
}

function obtenerMensajeDesbloqueo(id) {
  const mensajes = {
    [UNLOCKS.ENTRENAMIENTO_NORMAL]: 'Ahora puedes entrenar con dificultad Normal',
    [UNLOCKS.ENTRENAMIENTO_DIFICIL]: 'Ahora puedes entrenar con dificultad Difícil',
    [UNLOCKS.DESAFIO_DIA]: 'El Desafío del Día está disponible',
    [UNLOCKS.LIGA_AS]: 'La Liga As está desbloqueada',
    [UNLOCKS.LIGA_CAMPEON]: 'La Liga Campeón está desbloqueada',
  };
  return mensajes[id] || 'Has desbloqueado algo nuevo';
}

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