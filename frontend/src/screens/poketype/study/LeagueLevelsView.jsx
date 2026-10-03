import { useState, useEffect } from 'react';
import { datosLigas } from '../../../features/poketype/modes/study/data/leaguesData.js';
import { obtenerNivelesCompletados } from '../../../features/poketype/modes/study/storage/levelProgressStorage.js';
import { getLevelUnlockState } from '../../../features/poketype/index.js';
import { LevelCard } from './LevelCard.jsx';

export function LeagueLevelsView({ ligaKey, onBack, onLevelClick }) {
  const [idsCompletados, setIdsCompletados] = useState([]);
  const liga = datosLigas[ligaKey];

  useEffect(() => {
    obtenerNivelesCompletados().then(setIdsCompletados).catch((error) => {
      console.error('No se pudieron cargar los niveles completados:', error);
    });
  }, [ligaKey]);

  return (
    <div className="LeagueLevelsView">
      <div className="LevelListHeader">
        <button className="BackButton LevelListBackButton" onClick={onBack} aria-label="Volver a las ligas">←</button>
        <div className="LevelListHeading">
          <span className="LeagueIcon">{liga.emoji}</span>
          <h2 className="LeagueTitle">{liga.nombre}</h2>
        </div>
        <p className="LeagueDescription">{liga.descripcion}</p>
      </div>

      <div className="LevelGrid">
        {liga.niveles.map((nivel, index) => {
          const { status, requiredLevel } = getLevelUnlockState(ligaKey, nivel.id, idsCompletados);
          return (
            <LevelCard
              key={nivel.id}
              nivel={nivel}
              index={index}
              totalNiveles={liga.niveles.length}
              estado={status}
              nivelRequerido={requiredLevel}
              onClick={(selectedLevel) => onLevelClick(selectedLevel, status, requiredLevel)}
            />
          );
        })}
      </div>
    </div>
  );
}
