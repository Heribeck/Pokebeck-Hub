export function LevelModal({ nivel, estado, nivelRequerido, onClose, onStart }) {
  if (!nivel) return null;

  const estadoInfo = {
    completado: { icono: '✅', texto: 'Completado' },
    desbloqueado: { icono: '🔓', texto: 'Desbloqueado' },
    bloqueado: { icono: '🔒', texto: 'Bloqueado' },
  }[estado];

  const handleClickOutside = (e) => {
    if (e.target.className === 'modal-detalles') {
      onClose();
    }
  };

  return (
    <div className="LevelDialog" style={{ display: 'flex' }} onClick={handleClickOutside}>
      <div className="DialogContent">
        <div className="DialogHeader">
          <h3 className="LevelDialogTitle">{nivel.titulo}</h3>
          <button className="CloseModalButton" onClick={onClose}>✕</button>
        </div>
        <p className="LevelDescription">{nivel.descripcion}</p>
        <p className="LevelSpecifications">{nivel.especificaciones}</p>

        <div className="LevelStatus">
          <span className="LevelStatusIcon">{estadoInfo.icono}</span>
          <span className="LevelStatusText">{estadoInfo.texto}</span>
        </div>

        {estado === 'bloqueado' && (
          <div className="LevelRequirements" style={{ display: 'flex' }}>
            <span className="MissingHxMessage">
              Completa {nivelRequerido?.titulo ?? 'el nivel anterior'} para desbloquear este nivel
            </span>
          </div>
        )}

        {estado !== 'bloqueado' && (
          <button
            className="StartLevelButton"
            style={{ display: 'flex' }}
            onClick={onStart}
          >
            {estado === 'completado' ? 'Jugar de Nuevo' : 'Iniciar Nivel'}
          </button>
        )}
      </div>
    </div>
  );
}
