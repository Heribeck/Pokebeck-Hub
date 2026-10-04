import { useEffect, useRef, useState } from 'react';

const COLORES = [
  'var(--accent-red)',
  'var(--accent-yellow)',
  'var(--accent-yellow-light)',
  'var(--text-primary)',
  'var(--color-success)',
];
const PARTICULAS = 170;

function crearParticulas() {
  return Array.from({ length: PARTICULAS }, (_, index) => {
    const explosion = index < 50;
    const angulo = Math.random() * 360;
    const distancia = 30 + Math.random() * 50;

    return {
      id: index,
      explosion,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
      size: `${explosion ? 8 + Math.random() * 12 : 5 + Math.random() * 15}px`,
      duration: `${explosion ? 0.8 + Math.random() * 0.4 : 2 + Math.random() * 3}s`,
      delay: `${explosion ? index * 0.02 : Math.random() * 0.5}s`,
      x: explosion ? '50vw' : `${Math.random() * 100}vw`,
      y: explosion ? '50vh' : '-20px',
      destinationX: `${Math.cos(angulo * Math.PI / 180) * distancia}vh`,
      destinationY: `${Math.sin(angulo * Math.PI / 180) * distancia}vh`,
      rotation: `${Math.random() * 360}deg`,
    };
  });
}

export default function StudyVictory({ onClose }) {
  const [mostrarConfeti, setMostrarConfeti] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [particulas] = useState(crearParticulas);
  const continuarButtonRef = useRef(null);

  useEffect(() => {
    navigator.vibrate?.([200, 100, 200, 100, 400]);
    const timeoutConfeti = window.setTimeout(() => setMostrarConfeti(false), 4000);
    const timeoutModal = window.setTimeout(() => setMostrarModal(true), 4500);

    return () => {
      window.clearTimeout(timeoutConfeti);
      window.clearTimeout(timeoutModal);
    };
  }, []);

  useEffect(() => {
    if (mostrarModal) continuarButtonRef.current?.focus();
  }, [mostrarModal]);

  if (!mostrarConfeti && !mostrarModal) return null;

  return (
    <>
      {mostrarConfeti && (
        <div id="contenedor-confeti" aria-hidden="true">
          {particulas.map((particula) => (
            <div
              key={particula.id}
              className={`ConfettiParticle${particula.explosion ? ' ConfettiExplosion' : ''}`}
              style={{
                '--color': particula.color,
                '--tamano': particula.size,
                '--duracion': particula.duration,
                '--retraso': particula.delay,
                '--rotacion': particula.rotation,
                '--x': particula.x,
                '--y': particula.y,
                '--destino-x': particula.destinationX,
                '--destino-y': particula.destinationY,
              }}
            />
          ))}
        </div>
      )}
      {mostrarModal && (
        <div className="VictoryDialog" role="dialog" aria-modal="true" aria-labelledby="study-victory-title">
          <section className="VictoryDialogContent" aria-describedby="study-victory-description">
            <button
              className="VictoryDialogCloseButton"
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="VictoryDialogEmblem" aria-hidden="true">🏆</div>
            <p className="VictoryDialogEyebrow">Las tres ligas conquistadas</p>
            <h2 id="study-victory-title">MAESTRÍA EN POKETYPE</h2>
            <p className="VictoryDialogMessage" id="study-victory-description">
              Completaste todos los niveles del modo Estudio. Tu logro ya está disponible en el perfil.
            </p>
            <div className="VictoryAchievementBadge">
              <span className="VictoryAchievementIcon" aria-hidden="true">🏅</span>
              <span>Logro desbloqueado en tu perfil</span>
            </div>
            <button
              ref={continuarButtonRef}
              className="VictoryDialogButton"
              type="button"
              onClick={onClose}
            >
              ¡Continuar!
            </button>
          </section>
        </div>
      )}
    </>
  );
}
