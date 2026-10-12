import { useEffect, useState } from 'react';
import { obtenerVidasGenerales } from '../../../features/poketype/index.js';
import { incrementStreak } from '../../../home/index.js';
import { showToast } from '../../../shared/toast/index.js';
import { playAppMusic, playLeagueMusic } from '../../../shared/audio/index.js';
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

  useEffect(() => {
    if (jugando && nivelIdJugando) {
      playLeagueMusic(nivelIdJugando.split('-')[0]);
      return;
    }
    playAppMusic();
  }, [jugando, nivelIdJugando]);

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

  return (
    <section className="StudyScreen">
      {jugando && nivelIdJugando && (
        <StudyGameplay
          nivelId={nivelIdJugando}
          retryKey={retryKey}
          onBack={handleBackFromGameplay}
          onRetry={handleRetryLevel}
        />
      )}

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
