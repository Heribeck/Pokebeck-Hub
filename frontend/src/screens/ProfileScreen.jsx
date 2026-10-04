import { useEffect, useState } from 'react';
import { getStreakProgress, obtenerHX } from '../home/index.js';
import { haCompletadoTodos } from '../features/poketype/modes/study/storage/levelProgressStorage.js';
import { TODOS_LOS_NIVELES } from '../features/poketype/modes/study/gameplay/levelRegistry.js';
import { showToast } from '../shared/toast/index.js';

export default function ProfileScreen() {
  const [hxActual, setHxActual] = useState(null);
  const [rachaActual, setRachaActual] = useState(null);
  const [estadoMaestria, setEstadoMaestria] = useState('loading');
  const showComingSoon = () => showToast('Disponible en próximas actualizaciones.');

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
    haCompletadoTodos(TODOS_LOS_NIVELES)
      .then((completo) => setEstadoMaestria(completo ? 'unlocked' : 'locked'))
      .catch((error) => {
        console.error('No se pudo verificar el logro de maestría:', error);
        setEstadoMaestria('error');
        showToast('No se pudo cargar el logro de Estudio.');
      });
  }, []);

  return (
    <section className="ProfileScreen">
      <header className="ProfileHeader">
        <h1 className="ProfileTitle">Mi perfil</h1>
        <p className="ScreenSubtitle">Tu aventura, tus logros y todo lo que has descubierto.</p>
      </header>

      <button type="button" className="ProfileIdentityCard" onClick={showComingSoon}>
        <span className="ProfileAvatar" role="img" aria-label="Foto de perfil pendiente">👤</span>
        <span className="ProfileIdentity">
          <span className="ProfileEyebrow">Entrenador</span>
          <span className="ProfileName">Tu nombre</span>
          <span className="ProfileActionHint">Nombre y foto de perfil · Próximamente</span>
        </span>
        <span className="ProfileEditIcon" aria-hidden="true">✎</span>
      </button>

      <section className="ProfileSection" aria-labelledby="FavoritesTitle">
        <div className="ProfileSectionHeader">
          <h2 className="ProfileSectionTitle" id="FavoritesTitle">Pokémon favoritos</h2>
          <span className="ProfileSectionHint">0 guardados</span>
        </div>
        <button type="button" className="ProfileEmptyCard" onClick={showComingSoon}>
          <span className="ProfileEmptyIcon" aria-hidden="true">♡</span>
          <span>Aquí podrás guardar a tus Pokémon favoritos.</span>
          <span className="ProfileActionHint">Disponible próximamente</span>
        </button>
      </section>

      <section className="ProfileSection" aria-labelledby="StatisticsTitle">
        <div className="ProfileSectionHeader">
          <h2 className="ProfileSectionTitle" id="StatisticsTitle">Estadísticas</h2>
          <span className="ProfileSectionHint">Tu progreso actual</span>
        </div>
        <div className="ProfileStatsGrid">
          <button type="button" className="ProfileStatCard" onClick={showComingSoon}>
            <span className="ProfileStatIcon" aria-hidden="true">⚡</span>
            <span className="ProfileStatLabel">HX</span>
            <span className="ProfileStatValue">{hxActual ?? '...'}</span>
            <span className="ProfileActionHint">Ver historial</span>
          </button>
          <button type="button" className="ProfileStatCard" onClick={showComingSoon}>
            <span className="ProfileStatIcon" aria-hidden="true">🔥</span>
            <span className="ProfileStatLabel">Racha diaria</span>
            <span className="ProfileStatValue">{rachaActual ?? '...'} {rachaActual === 1 ? 'día' : 'días'}</span>
            <span className="ProfileActionHint">Ver calendario</span>
          </button>
        </div>
      </section>

      <section className="ProfileSection" aria-labelledby="AchievementsTitle">
        <div className="ProfileSectionHeader">
          <h2 className="ProfileSectionTitle" id="AchievementsTitle">Logros</h2>
          <span className="ProfileSectionHint">Tu progreso en Estudio</span>
        </div>
        <article className={`ProfileAchievementCard ${estadoMaestria === 'unlocked' ? 'IsUnlocked' : ''}`}>
          <span className="ProfileAchievementEmblem" aria-hidden="true">
            {estadoMaestria === 'unlocked' ? '🏅' : estadoMaestria === 'error' ? '⚠️' : '🔒'}
          </span>
          <div className="ProfileAchievementContent">
            <p className="ProfileAchievementEyebrow">
              {estadoMaestria === 'unlocked'
                ? 'Logro desbloqueado'
                : estadoMaestria === 'loading'
                  ? 'Comprobando progreso'
                  : estadoMaestria === 'error'
                    ? 'No se pudo comprobar'
                    : 'Completa Estudio para desbloquear'}
            </p>
            <h3 className="ProfileAchievementTitle">MAESTRÍA EN POKETYPE</h3>
            <p className="ProfileAchievementDescription">
              {estadoMaestria === 'unlocked'
                ? 'Completaste todos los niveles de las tres ligas. ¡Tu logro ya está aquí!'
                : estadoMaestria === 'loading'
                  ? 'Estamos verificando tu progreso en las ligas.'
                  : estadoMaestria === 'error'
                    ? 'Vuelve a abrir el perfil para intentarlo de nuevo.'
                    : 'Completa todos los niveles de las ligas Campista, As y Campeón.'}
            </p>
          </div>
          <span className={`ProfileAchievementStatus ${estadoMaestria === 'unlocked' ? 'IsUnlocked' : ''}`}>
            {estadoMaestria === 'unlocked'
              ? 'Desbloqueado'
              : estadoMaestria === 'loading'
                ? 'Verificando'
                : estadoMaestria === 'error'
                  ? 'Error'
                  : 'Bloqueado'}
          </span>
        </article>
      </section>

      <section className="ProfileSection" aria-labelledby="RankingTitle">
        <h2 className="ProfileSectionTitle" id="RankingTitle">Ranking</h2>
        <div className="ProfileActionGrid">
          <button type="button" className="ProfileActionCard" onClick={showComingSoon}>
            <span className="ProfileActionIcon" aria-hidden="true">🏆</span>
            <span className="ProfileActionTitle">Ranking</span>
            <span className="ProfileActionHint">Próximamente</span>
          </button>
        </div>
      </section>

      <section className="ProfileSection" aria-labelledby="DataTitle">
        <h2 className="ProfileSectionTitle" id="DataTitle">Copia de seguridad</h2>
        <p className="ProfileSectionDescription">En el futuro podrás llevar tu progreso contigo al cambiar de dispositivo.</p>
        <div className="ProfileActionGrid">
          <button type="button" className="ProfileDataButton" onClick={showComingSoon}>Exportar todos los datos</button>
          <button type="button" className="ProfileDataButton" onClick={showComingSoon}>Importar todos los datos</button>
        </div>
      </section>

      <div className="ProfileSectionFooter">
        <span className="ProfileSectionHint">Versión de la aplicación: 2.3.7</span>
      </div>
    </section>
  );
}
