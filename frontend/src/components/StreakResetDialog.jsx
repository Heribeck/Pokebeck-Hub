import { useEffect, useRef } from 'react';

function formatStartDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function StreakResetDialog({ streak, onClose }) {
  const closeButtonRef = useRef(null);
  const startDate = formatStartDate(streak.startedAt);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div className="StreakResetOverlay">
      <section
        className="StreakResetDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="StreakResetTitle"
        aria-describedby="StreakResetDescription"
      >
        <div className="StreakResetEmblem" aria-hidden="true">
          <span className="StreakResetSpark StreakResetSparkOne" />
          <span className="StreakResetSpark StreakResetSparkTwo" />
          <span className="StreakResetFire">🔥</span>
        </div>
        <p className="StreakResetEyebrow">Una nueva oportunidad</p>
        <h2 id="StreakResetTitle">Tu racha terminó</h2>
        <p id="StreakResetDescription" className="StreakResetMessage">
          Llevabas <strong>{streak.days} {streak.days === 1 ? 'día' : 'días'}</strong>
          {startDate && <> desde el <strong>{startDate}</strong></>}.
        </p>
        <p className="StreakResetMotivation">
          Aprender Pokémon puede ser divertido y productivo. ¡Hoy empieza una nueva!
        </p>
        <button
          ref={closeButtonRef}
          className="StreakResetButton"
          type="button"
          onClick={onClose}
        >
          ¡Vamos de nuevo!
        </button>
      </section>
    </div>
  );
}
