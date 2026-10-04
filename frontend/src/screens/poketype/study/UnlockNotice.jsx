import { useEffect, useRef } from 'react';

export default function UnlockNotice({ unlocks, onClose }) {
  const closeButtonRef = useRef(null);
  const title = unlocks.length === 1
    ? '¡Nuevo contenido desbloqueado!'
    : '¡Nuevos contenidos desbloqueados!';

  useEffect(() => {
    closeButtonRef.current?.focus();
    navigator.vibrate?.([200, 100, 200, 100, 400]);
  }, []);

  return (
    <div className="UnlockNoticeOverlay">
      <section
        className="UnlockNoticeDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="UnlockNoticeTitle"
        aria-describedby="UnlockNoticeDescription"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
        }}
      >
        <div className="UnlockNoticeEmblem" aria-hidden="true">
          <span className="UnlockNoticeSpark UnlockNoticeSparkOne">✦</span>
          <span className="UnlockNoticeIcon">🔓</span>
          <span className="UnlockNoticeSpark UnlockNoticeSparkTwo">✦</span>
        </div>
        <p className="UnlockNoticeEyebrow">¡Lo lograste!</p>
        <h2 id="UnlockNoticeTitle">{title}</h2>
        <p id="UnlockNoticeDescription" className="UnlockNoticeDescription">
          Sigue avanzando y descubre todo lo que te espera.
        </p>
        <ul className="UnlockNoticeList">
          {unlocks.map(({ id, titulo, mensaje }) => (
            <li className="UnlockNoticeItem" key={id}>
              <h3>{titulo}</h3>
              <p>{mensaje}</p>
            </li>
          ))}
        </ul>
        <button
          ref={closeButtonRef}
          className="UnlockNoticeButton"
          type="button"
          onClick={onClose}
        >
          ¡Continuar!
        </button>
      </section>
    </div>
  );
}
