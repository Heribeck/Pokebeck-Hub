import { useEffect, useState } from 'react';
import { getLeagueUnlockState } from '../../../features/poketype/index.js';
import { obtenerNivelesCompletados } from '../../../features/poketype/modes/study/storage/levelProgressStorage.js';
import { showToast } from '../../../shared/toast/index.js';

const LEAGUE_NAMES = {
    campista: 'Liga Campista',
    as: 'Liga As',
};

const DIFFICULTIES = [
    {
        id: 'facil',
        title: 'Fácil',
        league: 'campista',
        cardClass: 'EasyDifficultyCard',
        details: [
            'El reloj avanza a un ritmo tranquilo y constante.',
            'Los Pokémon pueden volver a aparecer.',
            'Encuentros con especies comunes.',
        ],
    },
    {
        id: 'normal',
        title: 'Normal',
        league: 'as',
        requiredLeague: 'campista',
        cardClass: 'NormalDifficultyCard',
        details: [
            'Un ritmo equilibrado para poner a prueba tu memoria.',
            'Cada ronda trae una especie distinta.',
            'Encuentros aleatorios.',
        ],
    },
    {
        id: 'dificil',
        title: 'Difícil',
        league: 'campeon',
        requiredLeague: 'as',
        cardClass: 'HardDifficultyCard',
        details: [
            'El reloj acelera: decide rápido.',
            'Cada ronda trae una especie distinta.',
            'Encuentros con Pokémon raros.',
        ],
    },
];

export default function DifficultyTrainingScreen({ onNavigation }) {
    const [unlockedDifficulties, setUnlockedDifficulties] = useState(null);
    const [unlockError, setUnlockError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        obtenerNivelesCompletados()
            .then((completedLevels) => {
                if (cancelled) return;

                setUnlockedDifficulties(Object.fromEntries(
                    DIFFICULTIES.map(({ id, league }) => [
                        id,
                        getLeagueUnlockState(league, completedLevels).unlocked,
                    ])
                ));
            })
            .catch((error) => {
                console.error('No se pudieron cargar los desbloqueos de dificultad:', error);
                showToast('No se pudieron verificar las dificultades.');
                if (!cancelled) setUnlockError(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleDifficultySelect = (difficulty) => {
        if (unlockError) {
            showToast('No se pudieron verificar las dificultades.');
            return;
        }

        if (unlockedDifficulties?.[difficulty.id]) {
            onNavigation('gameTraining', difficulty.id);
            return;
        }

        if (!unlockedDifficulties) return;

        const requiredLeague = difficulty.requiredLeague
            ? LEAGUE_NAMES[difficulty.requiredLeague]
            : null;
        showToast(
            requiredLeague
                ? `Completa toda la ${requiredLeague} para desbloquear ${difficulty.title}.`
                : 'Esta dificultad no está disponible.'
        );
    };

    return (
        <section className="TrainingDifficultyScreen">
            <div className="DifficultyOptions">
                {DIFFICULTIES.map((difficulty) => {
                    const unlocked = unlockedDifficulties?.[difficulty.id] === true;
                    const loading = unlockedDifficulties === null;
                    const requirement = difficulty.requiredLeague
                        ? `Completa la ${LEAGUE_NAMES[difficulty.requiredLeague]} para desbloquear.`
                        : null;

                    return (
                        <button
                            key={difficulty.id}
                            type="button"
                            className={`DifficultyCard ${difficulty.cardClass} ${unlocked ? '' : 'DifficultyCardLocked'}`}
                            aria-disabled={!unlocked}
                            onClick={() => handleDifficultySelect(difficulty)}
                        >
                            <h3 className="DifficultyTitle">{difficulty.title}</h3>
                            {difficulty.details.map((detail) => (
                                <p className="DifficultyDetail" key={detail}>{detail}</p>
                            ))}
                            <span className="StartButton">
                                {unlockError
                                    ? 'No se pudo verificar'
                                    : loading
                                        ? 'Verificando…'
                                        : unlocked
                                            ? 'Iniciar'
                                            : `🔒 ${requirement}`}
                            </span>
                        </button>
                    );
                })}
            </div>
            <button onClick={() => onNavigation('poketype')} className="BackButton">Volver a Poketype</button>
        </section>
    );
}