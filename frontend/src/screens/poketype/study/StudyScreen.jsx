import { useEffect, useState, useMemo } from 'react';

import { 
  obtenerVidasGenerales, 
  getLevelUnlockState, 
  obtenerSiguienteNivel, 
  obtenerNivelesCompletados, 
  datosLigas } from '../../../features/poketype/index.js';
import { incrementStreak } from '../../../home/index.js';
import { showToast } from '../../../shared/toast/index.js';
import { playAppMusic, playLeagueMusic } from '../../../shared/audio/index.js';
import { NativeAd } from '../../../shared/admob/native/index.js';

import { LeaguesView } from './LeaguesView.jsx';
import { LeagueLevelsView } from './LeagueLevelsView.jsx';
import { LevelModal } from './LevelModal.jsx';
import StudyGameplay from './StudyGameplay.jsx';

export default function StudyScreen({ onNavigation }) {
  const [vista, setVista] = useState('ligas');
  const [ligaSeleccionada, setLigaSeleccionada] = useState(null);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [estadoNivel, setEstadoNivel] = useState(null);
  const [nivelRequerido, setNivelRequerido] = useState(null);
  const [jugando, setJugando] = useState(false);
  const [nivelIdJugando, setNivelIdJugando] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [idsCompletados, setIdsCompletados] = useState([]);

  useEffect(() => {
    if (jugando && nivelIdJugando) {
      playLeagueMusic(nivelIdJugando.split('-')[0]);
      return;
    }
    playAppMusic();
  }, [jugando, nivelIdJugando]);

  useEffect(() => {
    obtenerNivelesCompletados().then(setIdsCompletados).catch((error) => {
      console.error('No se pudieron cargar los niveles completados:', error);
    });
  }, [vista, nivelIdJugando, jugando]);

  const handleLeagueSelect = (ligaKey) => {
    setLigaSeleccionada(ligaKey);
    setVista('niveles');
  };

  const handleBackToLeagues = () => {
    setLigaSeleccionada(null);
    setVista('ligas');
  };

  const handleLevelClick = (nivel, estado, requiredLevel) => {
    setNivelSeleccionado(nivel);
    setEstadoNivel(estado);
    setNivelRequerido(requiredLevel);
  };

  const handleCloseModal = () => {
    setNivelSeleccionado(null);
    setEstadoNivel(null);
    setNivelRequerido(null);
  };

  const handleStartLevel = async () => {
    if (!nivelSeleccionado) return;
    try {
      const vidas = await obtenerVidasGenerales();
      if (vidas === 0) {
        showToast('No tienes vidas. Espera a que se regenere una para iniciar un nivel.');
        return;
      }
    } catch (error) {
      console.error('No se pudieron verificar las vidas:', error);
      showToast('No se pudieron verificar las vidas.');
      return;
    }

    try {
      await incrementStreak();
    } catch (error) {
      console.error('No se pudo registrar la actividad de estudio:', error);
      showToast('No se pudo actualizar la racha.');
    }

    const nivelId = nivelSeleccionado.id;
    handleCloseModal();
    setNivelIdJugando(nivelId);
    setJugando(true);
  };

  const handleBackFromGameplay = () => {
    setJugando(false);
    setNivelIdJugando(null);
    setVista('niveles');
  };

  const handleRetryLevel = () => {
    setRetryKey(prev => prev + 1);
  };

  const handleNivelCompletado = () => {
    obtenerNivelesCompletados().then(setIdsCompletados).catch((error) => {
      console.error('No se pudieron cargar los niveles completados:', error);
    });
  };

  const handleNextLevel = () => {
    const siguienteNivelId = obtenerSiguienteNivel(nivelIdJugando);
    if (!siguienteNivelId) return;

    for (const ligaKey of Object.keys(datosLigas)) {
      const nivel = datosLigas[ligaKey].niveles.find(n => n.id === siguienteNivelId);
      if (nivel) {
        const { status, requiredLevel } = getLevelUnlockState(ligaKey, siguienteNivelId, idsCompletados);
        setNivelSeleccionado(nivel);
        setEstadoNivel(status);
        setNivelRequerido(requiredLevel);
        setJugando(false);
        setNivelIdJugando(null);
        setVista('niveles');
        setLigaSeleccionada(ligaKey);
        return;
      }
    }
  };

  const siguienteNivelId = useMemo(() => {
    if (!nivelIdJugando) return null;
    return obtenerSiguienteNivel(nivelIdJugando);
  }, [nivelIdJugando, idsCompletados]);

  const siguienteNivelDesbloqueado = useMemo(() => {
    if (!siguienteNivelId) return false;
    for (const ligaKey of Object.keys(datosLigas)) {
      const nivel = datosLigas[ligaKey].niveles.find(n => n.id === siguienteNivelId);
      if (nivel) {
        const { status } = getLevelUnlockState(ligaKey, siguienteNivelId, idsCompletados);
        return status === 'desbloqueado' || status === 'completado';
      }
    }
    return false;
  }, [siguienteNivelId, idsCompletados]);

  return (
    <section className="StudyScreen">
      {jugando && nivelIdJugando && (
        <StudyGameplay
          nivelId={nivelIdJugando}
          retryKey={retryKey}
          onBack={handleBackFromGameplay}
          onRetry={handleRetryLevel}
          onNextLevel={handleNextLevel}
          siguienteNivelDesbloqueado={siguienteNivelDesbloqueado}
          onNivelCompletado={handleNivelCompletado}
        />
      )}

      {jugando && <NativeAd placementId="study" size="large" />}

      {!jugando && vista === 'ligas' && (
        <LeaguesView onLeagueSelect={handleLeagueSelect} />
      )}

      {!jugando && vista === 'niveles' && ligaSeleccionada && (
        <LeagueLevelsView
          ligaKey={ligaSeleccionada}
          onBack={handleBackToLeagues}
          onLevelClick={handleLevelClick}
        />
      )}

      {!jugando && nivelSeleccionado && (
        <LevelModal
          nivel={nivelSeleccionado}
          estado={estadoNivel}
          nivelRequerido={nivelRequerido}
          onClose={handleCloseModal}
          onStart={handleStartLevel}
        />
      )}

      {!jugando && (
        <button onClick={() => onNavigation('poketype')} className="BackButton">
          Volver a Poketype
        </button>
      )}
    </section>
  );
}
