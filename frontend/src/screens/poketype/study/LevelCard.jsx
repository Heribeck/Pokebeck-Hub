export function LevelCard({ nivel, index, totalNiveles, estado, nivelRequerido, onClick }) {
  const esExamen = nivel.especial === 'jefe-liga';
  const esRiesgoCritico = nivel.especial === 'riesgo-critico';
  const esTiempoDinamico = nivel.tiempoDinamico === true || nivel.tiempoDinamico === 'true';
  const estadoClass = {
    completado: 'Completed',
    desbloqueado: 'Unlocked',
    bloqueado: 'Locked',
  }[estado];

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
    ? <div className="LevelUnlockHint"><span className="LockIcon">🔒</span><span className="MissingHxMessage">Completa {nivelRequerido?.titulo ?? 'el nivel anterior'} para desbloquear</span></div>
    : '';

  return (
    <div
      className={`LevelCard ${esExamen ? 'LevelCardExam' : ''} ${esRiesgoCritico ? 'LevelCardRisk' : ''} LevelCard${estadoClass}`}
      data-nivel-id={nivel.id}
      data-estado={estado}
      onClick={() => onClick(nivel)}
    >
      <div className="LevelCardHeader">
        <span className="LevelNumber">Nivel {index + 1} de {totalNiveles}</span>
        <span className="LevelStatusIcon">{iconoEstado}</span>
      </div>
      <h4 className="LevelTitle">{nivel.titulo}</h4>
      <div className="LevelDetails">
        <span className="LevelDetail">🎯 {nivel.rondas} rondas</span>
        <span className="LevelDetail">❤️ {nivel.corazonesError}</span>
        <span className="LevelDetail">{tiempoEtiqueta}</span>
        <span className="LevelDetail">{nivel.repeticion ? '🔄 Permitida' : '🚫 No repetir'}</span>
        <span className="LevelDetail">{filtroEtiqueta}</span>
      </div>
      <div className="LevelBadges">
        {esExamen && <span className="Badge SpecialBadge">🏆 Jefe de Liga</span>}
        {esRiesgoCritico && <span className="Badge CriticalRiskBadge">⚠️ Riesgo Crítico</span>}
        {esTiempoDinamico && <span className="Badge DynamicTimeBadge">⚡ Tiempo Dinámico</span>}
      </div>
      {infoBloqueo}
    </div>
  );
}
