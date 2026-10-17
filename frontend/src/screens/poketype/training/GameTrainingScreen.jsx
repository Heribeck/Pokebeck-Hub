import { useEffect, useRef, useState } from 'react'

import { showToast } from '../../../shared/toast/index.js'
import { typesIcons, typesColors } from '../../../features/poketype/index.js'
import { showRewarded } from '../../../shared/admob/index.js'
import { NativeAd } from '../../../shared/admob/native/index.js'
import { 
    trainingLogic, 
    scoreState, 
    saveMaxScore, 
    saveCurrentScore, 
    gameState,     } from '../../../features/poketype/index.js'
import { capitalizeFirstLetter } from '../../../shared/strings/index.js'
import { incrementStreak } from '../../../home/index.js'
import {
    playAppMusic,
    playDifficultyMusic,
    playLoseSound,
    playWinSound,
} from '../../../shared/audio/index.js'
import TrainingCelebration from './TrainingCelebration.jsx'

export default function GameTrainingScreen({ onNavigation, currentDifficulty }) {

    const [gameStarted, setGameStarted] = useState(false)
    const [score, setScore] = useState(0)
    const [maxScore, setMaxScore] = useState(() => {
        const key = { facil: 'maxEasy', normal: 'maxNormal', dificil: 'maxHard' }[currentDifficulty]
        return scoreState[key] || 0
    });
    const [type1, setType1] = useState(null)
    const [type2, setType2] = useState(null)
    const [message, setMessage] = useState('')
    const [correctPokemon, setCorrectPokemon] = useState(null)
    const [timerValue, setTimerValue] = useState(100)
    const [options, setOptions] = useState([])
    const [answered, setAnswered] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const [showRetry, setShowRetry] = useState(false)
    const [showRevive, setShowRevive] = useState(false)
    const [showBack, setShowBack] = useState(true)
    const [reviveLoading, setReviveLoading] = useState(false)

    const revivedThisRun = useRef(false)

    useEffect(() => {
        playDifficultyMusic(currentDifficulty)
        return () => {
            clearInterval(gameState.timerTraining)
            playAppMusic()
        }
    }, [currentDifficulty])

    const handleResetScoreMax = () => {
        showToast("Se ha reiniciado el puntaje máximo.");
        const key = { facil: 'maxEasy', normal: 'maxNormal', dificil: 'maxHard' }[currentDifficulty]
        scoreState[key] = 0
        setMaxScore(0)
        saveMaxScore(currentDifficulty, 0)
    }

    const registerActivity = async () => {
        try {
            await incrementStreak()
        } catch (error) {
            console.error('No se pudo registrar la actividad de entrenamiento:', error)
            showToast('No se pudo actualizar la racha.')
        }
    }

    const handleStart = async () => {
        await registerActivity()
        setGameStarted(true)
        revivedThisRun.current = false
        setShowRevive(false)
        setShowBack(false)
        trainingLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, handleTimeOut, currentDifficulty)
    }

    const handleTimeOut = (correctPokemon) => {
        playLoseSound()
        scoreState.scoreBeforeLose = score
        setAnswered(true)
        setMessage(`Se acabó el tiempo. La respuesta correcta era ${capitalizeFirstLetter(correctPokemon.name)}`)
        setShowRetry(true)
        setShowBack(true)
        setShowRevive(!revivedThisRun.current)
        setScore(0)
        setOptions([])
        saveCurrentScore(0)
    }

    const handleAnswer = (pokemon) => {
        if (answered) return
        clearInterval(gameState.timerTraining)
        setAnswered(true)

        if (pokemon.name === correctPokemon.name) {
            playWinSound()
            const newScore = score + 1
            setScore(newScore)
            saveCurrentScore(newScore)

            if (newScore > maxScore) {
                setMaxScore(newScore)
                const key = { facil: 'maxEasy', normal: 'maxNormal', dificil: 'maxHard' }[currentDifficulty]
                scoreState[key] = newScore
                saveMaxScore(currentDifficulty, newScore)
            }
            setMessage('¡Felicidades Sigue Sumando!')
            setShowNext(true)
            setOptions([])
        } else {
            playLoseSound()
            scoreState.scoreBeforeLose = score
            setMessage(`Has Perdido. La respuesta correcta era ${capitalizeFirstLetter(correctPokemon.name)}`)
            setScore(0)
            setShowRetry(true)
            setShowRevive(!revivedThisRun.current)
            setShowBack(true)
            setOptions([])
            saveCurrentScore(0)
        }
    }

    const handleNext = () => {
        setAnswered(false)
        setShowNext(false)
        setMessage('')
        setOptions([])
        trainingLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, handleTimeOut, currentDifficulty)
    }

    const handleRetry = async () => {
        await registerActivity()
        setAnswered(false)
        setShowRetry(false)
        setShowRevive(false)
        setShowBack(false)
        setMessage('')
        setScore(0)
        setOptions([])
        revivedThisRun.current = false
        trainingLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, handleTimeOut, currentDifficulty)
    }

    const handleBackToDifficulty = () => {
        clearInterval(gameState.timerTraining)
        gameState.timerTraining = null
        onNavigation('difficultyTraining')
    }

    const handleRevive = async () => {
        if (reviveLoading || revivedThisRun.current) return

        setReviveLoading(true)
        let rewardEarned = false

        try {
            const adShown = await showRewarded('training', () => {
                    rewardEarned = true
                }
            )

            if (!adShown || !rewardEarned) {
                showToast('No se recibió la recompensa. Puedes intentarlo de nuevo.')
                return
            }

            revivedThisRun.current = true
            const restoredScore = scoreState.scoreBeforeLose
            setScore(restoredScore)
            saveCurrentScore(restoredScore)
            setAnswered(false)
            setShowRetry(false)
            setShowRevive(false)
            setShowBack(false)
            setMessage('¡Has revivido! Sigue avanzando.')
            setTimerValue(100)
            trainingLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, handleTimeOut, currentDifficulty)
        } catch (error) {
            console.error('No se pudo completar el revivir del entrenamiento:', error)
            showToast('No se pudo completar el revivir. Inténtalo de nuevo.')
        } finally {
            setReviveLoading(false)
        }
    }

    return (

        <section className="PokemonGameScreen">

            <div className="TrainingStatsPanel">
                <button className="ResetButton" onClick={() => setScore(0)}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
                <p>Score: <span>{score}</span> || MAX: <span>{maxScore}</span></p>
                <button className="ResetButton" onClick={handleResetScoreMax}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            <div className="PokemonTypes">
                <img 
                className="TypeIcon" 
                src={type1 ? typesIcons[type1] : '/assets/icons/icon-512.webp'} 
                style={{ backgroundColor: typesColors[type1]}} 
                alt="Tipo 1"/>

                <img className="TypeIcon" 
                src={type2 ? typesIcons[type2] : '/assets/icons/icon-512.webp'} 
                style={{ backgroundColor: typesColors[type2]}} 
                alt="Tipo 2"/>
            </div>

            <p className="TrainingResultMessage" role="status">{message}</p>

            <div className="TimerPanel">
                <progress className="TimerProgress" value={timerValue} max="100"></progress>
            </div>

            <div className="AnswerOptions">
                {options.map(pokemon => (
                    <button key={pokemon.name} className="AnswerOptionButton" onClick={() => handleAnswer(pokemon)}>
                        {pokemon.name.replaceAll('-', ' ')}
                    </button>
                ))}
            </div>

            {!gameStarted && <button className="StartGameButton" onClick={handleStart}>Iniciar Juego</button>}
            <div className="TrainingActions">
                {showNext && <button className="NextButton" onClick={handleNext}>Siguiente</button>}
                {showRetry && <button className="RetryButton" onClick={handleRetry}>Intentar de Nuevo</button>}
                {showRevive && (
                    <button
                        className="ReviveButton"
                        onClick={handleRevive}
                        disabled={reviveLoading}
                    >
                        Revivir Viendo un Video
                        <i className="fa-solid fa-circle-play" aria-hidden="true"></i>
                    </button>
                )}
                {showBack && <button className="BackButton" onClick={handleBackToDifficulty}>Volver a Dificultad</button>}
            </div>
            {score > 0 && score % 5 === 0 && <TrainingCelebration score={score} />}
            {gameStarted && <NativeAd placementId="training" size="large" />}

        </section>
    );
}