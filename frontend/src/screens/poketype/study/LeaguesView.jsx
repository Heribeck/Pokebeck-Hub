import { useState, useEffect } from 'react';
import { datosLigas } from '../../../features/poketype/modes/study/data/leaguesData.js';
import { obtenerNivelesCompletados } from '../../../features/poketype/modes/study/storage/levelProgressStorage.js';
import { LeagueCard } from './LeagueCard.jsx';

export function LeaguesView({ onLeagueSelect }) {
  const [idsCompletados, setIdsCompletados] = useState([]);

  useEffect(() => {
    obtenerNivelesCompletados().then(setIdsCompletados).catch((error) => {
      console.error('No se pudieron cargar los niveles completados:', error);
    });
  }, []);

  return (
    <div className="LeagueSelectionView" style={{ display: 'flex' }}>
      <h3 className="LeagueListTitle">Ligas de Maestría</h3>
      <div className="LeagueList">
        {Object.keys(datosLigas).map(ligaKey => (
          <LeagueCard
            key={ligaKey}
            ligaKey={ligaKey}
            liga={datosLigas[ligaKey]}
            idsCompletados={idsCompletados}
            onClick={onLeagueSelect}
          />
        ))}
      </div>
    </div>
  );
}
