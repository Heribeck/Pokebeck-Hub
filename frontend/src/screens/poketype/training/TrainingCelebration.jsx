import { useEffect, useState } from 'react';

const COLORES = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

function crearParticulas() {
  return Array.from({ length: 50 }, (_, index) => ({
    id: index,
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${1 + Math.random() * 0.5}s`,
    size: `${5 + Math.random() * 10}px`,
  }));
}

export default function TrainingCelebration({ score }) {
  const [visible, setVisible] = useState(true);
  const [particulas] = useState(crearParticulas);

  useEffect(() => {
    navigator.vibrate?.([200, 100, 200, 100, 300]);
    const timeout = window.setTimeout(() => setVisible(false), 2000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="CelebrationOverlay" role="status">
      <div className="CelebrationMessage">¡Racha de {score}!</div>
      {particulas.map((particula) => (
        <div
          key={particula.id}
          className="CelebrationParticle"
          style={{
            backgroundColor: particula.color,
            left: particula.left,
            animationDelay: particula.delay,
            animationDuration: particula.duration,
            width: particula.size,
            height: particula.size,
          }}
        />
      ))}
    </div>
  );
}
