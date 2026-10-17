import { useState, useRef, useEffect } from 'react'

import { 
    gameState,
    getAvailableAttemptsToday, 
    consumeAttemptToday, 
    registerChallengePassed, 
    hasCompletedChallengeToday,
    challengeLogic,
    createChallengeSession,
    registerRoundResult,
    calculateFinalResult,
    createDailyGenerator,
} from '../../../features/poketype/index.js'
import { getStreakProgress, incrementStreak } from '../../../home/index.js'
import { showToast } from '../../../shared/toast/index.js'
import { capitalizeFirstLetter } from '../../../shared/strings/index.js'
import { typesIcons, typesColors } from '../../../features/poketype/index.js'
import { showInsterstitial } from '../../../shared/admob/index.js'
import { NativeAd } from '../../../shared/admob/native/index.js'
import { playLeagueMusic } from '../../../shared/audio/index.js'


export default function GameChallengeScreen({ onNavigation }) {

    const [gameStarted, setGameStarted] = useState(false)
    const [type1, setType1] = useState(null)
    const [type2, setType2] = useState(null)
    const [message, setMessage] = useState('')
    const [correctPokemon, setCorrectPokemon] = useState(null)
    const [timerValue, setTimerValue] = useState(100)
    const [options, setOptions] = useState([])
    const [answered, setAnswered] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const [showRetry, setShowRetry] = useState(false)
    const [session, setSession] = useState(null)
    const [attemptsLeft, setAttemptsLeft] = useState(0)

    const generatorRef = useRef(null)
    const streakRef = useRef(0)
    const sessionRef = useRef(null)
    const attemptsRef = useRef(0)

    useEffect(() => () => clearInterval(gameState.timerChallenge), [])

    useEffect(() => {
        if (gameStarted) playLeagueMusic('campeon')
    }, [gameStarted])

    const loadRound = () => {
        challengeLogic(setType1, setType2, setOptions, setCorrectPokemon, setTimerValue, handleTimeOut, generatorRef.current, streakRef.current)
    }

    const startSession = async () => {
        const left = await consumeAttemptToday()
        try {
            await incrementStreak()
        } catch (error) {
            console.error('No se pudo registrar la actividad del desafío:', error)
            showToast('No se pudo actualizar la racha.')
        }
        const { streak } = await getStreakProgress()

        streakRef.current = streak
        generatorRef.current = createDailyGenerator()
        const newSession = createChallengeSession(streak)
        attemptsRef.current = left
        sessionRef.current = newSession
        setAttemptsLeft(left)
        setSession(newSession)
        setGameStarted(true)
        setAnswered(false)
        setShowNext(false)
        setShowRetry(false)
        setMessage('')
        setOptions([])
        loadRound()
    }

    const handleStart = async () => {
        if (await hasCompletedChallengeToday()) {
            showToast('Ya completaste el Desafío de hoy. ¡Vuelve mañana!')
            return 
        }

        if (await getAvailableAttemptsToday() <= 0) {
            showToast('Ya usaste tus intentos de hoy. ¡Vuelve mañana!')
            return
        }
        
        await startSession()
    }

    const finishRound = async (isCorrect, roundMessage) => {
        setAnswered(true)
        const { session: updated, sessionFinished } = registerRoundResult(sessionRef.current, isCorrect)
        sessionRef.current = updated
        setSession(updated)

        if (!sessionFinished) {
            setMessage(roundMessage)
            setShowNext(true)
            return
        }

        const result = calculateFinalResult(updated)

        if (result.passed) {
            await registerChallengePassed()
            setMessage(`¡Desafío superado! ${result.percentage}% de aciertos (necesitabas ${updated.params.passPercent}%).`)
            showInsterstitial('challenge')
            return
        }

        showInsterstitial('challenge')
        setMessage(`No alcanzaste el ${updated.params.passPercent}% (sacaste ${result.percentage}%). ${attemptsRef.current > 0 ? `Te quedan ${attemptsRef.current} intento(s) hoy.` : 'Se acabaron tus intentos de hoy.'}`)
        setShowRetry(attemptsRef.current > 0)
    }

    const handleTimeOut = (pokemon) => {
        finishRound(false, `Se acabó el tiempo. La respuesta correcta era ${capitalizeFirstLetter(pokemon.name)}`)
    }

    const handleAnswer = (pokemon) => {
        if (answered) return
        clearInterval(gameState.timerChallenge)

        if (pokemon.name === correctPokemon.name) {
            finishRound(true, '¡Correcto!')
        } else {
            finishRound(false, `Fallaste. La respuesta correcta era ${capitalizeFirstLetter(correctPokemon.name)}`)
        }
    }

    const handleNext = () => {
        setAnswered(false)
        setShowNext(false)
        setMessage('')
        loadRound()
    }

    const handleRetry = async () => {
        await startSession()
    }

    return (

        <section className="PokemonGameScreen">

            {session && !showRetry && (
                <p>Ronda {Math.min(session.currentRound + (answered ? 0 : 1), session.params.totalRounds)} de {session.params.totalRounds} · Intentos Restantes de hoy: {attemptsLeft}</p>
            )}

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

            <p>{message}</p>

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
            {showNext && <button className="NextButton" onClick={handleNext}>Siguiente</button>}
            {showRetry && <button className="RetryButton" onClick={handleRetry}>Intentar de Nuevo</button>}
            {(showRetry || (gameStarted && answered && !showNext) || (!gameStarted)) && <button 
            className="BackButton" 
            onClick={() => onNavigation('poketype')}
            >Volver al Menu
            </button>}
            {gameStarted && <NativeAd placementId="challenge" size="large" />}

        </section>
    );
}
