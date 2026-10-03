import { datosLigas } from '../../../features/poketype/modes/study/data/leaguesData.js';
import { getLeagueUnlockState } from '../../../features/poketype/index.js';
import { showToast } from '../../../shared/toast/index.js';

export function LeagueCard({ ligaKey, liga, idsCompletados, onClick }) {
  const { unlocked, requiredLeague } = getLeagueUnlockState(ligaKey, idsCompletados);
  const ligaBloqueada = !unlocked;

  const completadosEnLiga = liga.niveles.filter(n => idsCompletados.includes(n.id)).length;
  const porcentaje = Math.round((completadosEnLiga / liga.niveles.length) * 100);
  const ligaCompletada = completadosEnLiga === liga.niveles.length;

  const estadoFooter = ligaBloqueada
    ? <span className="LeagueStatus LeagueStatusLocked">🔒 Bloqueado</span>
    : ligaCompletada
      ? <span className="LeagueStatus LeagueStatusCompleted">✅ Completado</span>
      : <span className="LeagueStatus LeagueStatusUnlocked">🔓 Desbloqueado</span>;

  const handleClick = () => {
    if (ligaBloqueada) {
      showToast(`Completa la Liga ${datosLigas[requiredLeague].nombre} para desbloquear esta liga.`);
    } else {
      onClick(ligaKey);
    }
  };

  return (
    <div
      className={`LeagueCard ${ligaBloqueada ? 'LeagueCardLocked' : ''}`}
      data-liga={ligaKey}
      onClick={handleClick}
    >
      <div className="LeagueCardHeader">
        <span className="LeagueIcon">{liga.emoji}</span>
        <div>
          <h3 className="LeagueName">{liga.nombre}</h3>
        </div>
      </div>
      <div className="LeagueProgress">
        <div className="LeagueProgressTrack">
          <div className="LeagueProgressFill" style={{ width: `${porcentaje}%` }}></div>
        </div>
        <span className="ProgressText">{completadosEnLiga}/{liga.niveles.length} niveles</span>
      </div>
      <div className="LeagueCardFooter">
        {estadoFooter}
      </div>
      {ligaBloqueada && <div className="LeagueLockedOverlay Locked"><span className="LockIcon">🔒</span></div>}
    </div>
  );
}
