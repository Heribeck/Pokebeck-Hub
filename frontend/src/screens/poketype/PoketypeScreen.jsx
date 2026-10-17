import { useCallback, useEffect, useState } from 'react';
import { showRewarded } from "../../shared/admob/index.js";
import { getStreakProgress, obtenerHX } from "../../home/index.js";
import { obtenerTiempoParaProximaRegeneracion, obtenerVidasGenerales, restaurarVidaPorAnuncio } from "../../features/poketype/index.js";
import { showToast } from "../../shared/toast/index.js";

function formatRegenerationTime(milliseconds) {
  if (milliseconds <= 0) return '';

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function PoketypeScreen({ onNavigation }) {
  const [hxActual, setHxActual] = useState(null);
  const [rachaActual, setRachaActual] = useState(null);
  const [vidas, setVidas] = useState(null);
  const [tiempoRegeneracion, setTiempoRegeneracion] = useState(null);

  const cargarVidas = useCallback(async () => {
    const [vidasActuales, tiempoRestante] = await Promise.all([
      obtenerVidasGenerales(),
      obtenerTiempoParaProximaRegeneracion(),
    ]);
    setVidas(vidasActuales);
    setTiempoRegeneracion(tiempoRestante);
  }, []);

  useEffect(() => {
    getStreakProgress()
      .then(({ streak }) => setRachaActual(streak))
      .catch((error) => {
        console.error('No se pudo cargar la racha:', error);
        showToast('No se pudo cargar la racha.');
      });
    obtenerHX()
      .then(setHxActual)
      .catch((error) => {
        console.error('No se pudo cargar el HX:', error);
        showToast('No se pudo cargar el HX.');
      });
    cargarVidas().catch((error) => {
      console.error('No se pudieron cargar las vidas:', error);
      showToast('No se pudieron cargar las vidas.');
    });
  }, [cargarVidas]);

  useEffect(() => {
    if (tiempoRegeneracion === null) return undefined;
    if (tiempoRegeneracion <= 0) {
      cargarVidas().catch((error) => {
        console.error('No se pudieron actualizar las vidas:', error);
        showToast('No se pudieron actualizar las vidas.');
      });
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setTiempoRegeneracion((remaining) => Math.max(0, remaining - 1000));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [tiempoRegeneracion, cargarVidas]);

  const handleRecoverLife = async () => {
    await showRewarded('lives', async () => {
      try {
        const vidasActualizadas = await restaurarVidaPorAnuncio();
        setVidas(vidasActualizadas);
        setTiempoRegeneracion(await obtenerTiempoParaProximaRegeneracion());
      } catch (error) {
        console.error('No se pudo restaurar la vida:', error);
        showToast('No se pudo restaurar la vida.');
      }
    });
  };

  return (
    <section className="PoketypeScreen">
      <h2 className="PoketypeTitle">PokeType Guess</h2>
      <p className="ScreenSubtitle">Domina los tipos, supera desafíos y sigue ampliando tu leyenda.</p>
 
      <div className="PoketypeStatsPanel">
 
        <div className="PrimaryStats">
          <div className="StatItem">
            <span className="StatIcon"></span>
            <span className="StatValue">🔥{rachaActual ?? '...'} días</span>
          </div>
          <div className="StatItem">
            <span className="StatIcon"></span>
            <span className="StatValue">⚡{hxActual ?? '...'} HX</span>
          </div>
        </div>
 
        <div className="StatItem LivesPanel">
          <div className="CompactHearts">
            {[0, 1, 2, 3, 4].map((index) => (
              <span className="CompactHeart" key={index}>
                {vidas === null ? '🤍' : index < vidas ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <button className="RecoverLifeButton" onClick={handleRecoverLife} disabled={vidas === null || vidas >= 5}>+</button>
          <span className="LifeRegenerationTime">{formatRegenerationTime(tiempoRegeneracion ?? 0)}</span>
        </div>
 
      </div>

      <nav aria-label="PokeType modes" className="PoketypeModes">
        <button onClick={() => onNavigation('leagues')} className="StudyButton">
          <span className="ModeCardTitle">Estudio</span>
          <span className="ModeCardDescription">Domina cada liga nivel a nivel.</span>
        </button>
        <button onClick={() => onNavigation('difficultyTraining')} className="TrainingButton">
          <span className="ModeCardTitle">Entrenamiento</span>
          <span className="ModeCardDescription">Pon a prueba tus reflejos y conocimientos.</span>
        </button>
        <button onClick={() => onNavigation('gameChallenge')} className="DailyChallengeButton">
          <span className="ModeCardTitle">Desafío del Día</span>
          <span className="ModeCardDescription">Enfréntate a un reto nuevo cada día.</span>
        </button>
        <button onClick={() => onNavigation('generator')} className="GeneratorButton">
          <span className="ModeCardTitle">Generador</span>
          <span className="ModeCardDescription">Descubre combinaciones de tipos.</span>
        </button>
      </nav>
 
      <button onClick={() => onNavigation('home')} className="BackButton">Volver al Menú</button>
 
    </section>
  )
}