import { useState, useEffect, useMemo, useRef } from 'react';
import { crearIntentoNivel, procesarRondaNivel, calcularResultadoNivel } from '../../../features/poketype/modes/study/gameplay/levelMotor.js';
import { nivelesPorLiga, obtenerConfiguracionNivel } from '../../../features/poketype/modes/study/gameplay/levelRegistry.js';
import { crearEstadoRondas, generarSiguienteRonda } from '../../../features/poketype/modes/study/gameplay/roundGenerator.js';
import { haCompletadoTodos, marcarNivelCompletado, yaCompletoNivel } from '../../../features/poketype/modes/study/storage/levelProgressStorage.js';
import { obtenerVelocidadTiempo } from '../../../features/poketype/modes/study/config/timeConfig.js';
import { calcularVelocidadDinamica } from '../../../features/poketype/modes/study/algorithms/dynamicTimeSpeed.js';
import { restarVidaGeneral, verificarDesbloqueos } from '../../../features/poketype/index.js';
import { typesIcons, typesColors } from '../../../config/index.js';
import { dataState } from '../../../home/index.js';
import { sumarHX } from '../../../home/index.js';
import { showToast } from '../../../shared/toast/index.js';
import { capitalizeFirstLetter } from '../../../shared/strings/index.js';
import { playLoseSound, playWinSound } from '../../../shared/audio/index.js';
import StudyVictory from './StudyVictory.jsx';

const TIEMPO_INICIAL = 100;
const INTERVALO_TICK_MS = 100;
const NIVEL_FINAL_ESTUDIO = 'campeon-18';
const TODOS_LOS_NIVELES = Object.values(nivelesPorLiga).flat();

export default function StudyGameplay({ nivelId, onBack }) {
  const [intento, setIntento] = useState(null);
  const [estadoRondas, setEstadoRondas] = useState(null);
  const [rondaActual, setRondaActual] = useState(0);
  const [corazonesRestantes, setCorazonesRestantes] = useState(3);
  const [type1, setType1] = useState(null);
  const [type2, setType2] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [correctPokemon, setCorrectPokemon] = useState(null);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [resultadoRonda, setResultadoRonda] = useState(null);
  const [nivelTerminado, setNivelTerminado] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [estadoRecompensaHX, setEstadoRecompensaHX] = useState(null);
  const [mostrarVictoria, setMostrarVictoria] = useState(false);
  const [tiempoLeft, setTiempoLeft] = useState(TIEMPO_INICIAL);
  const [sinRondaDisponible, setSinRondaDisponible] = useState(false);
  const timerRef = useRef(null);
  const respondidaRef = useRef(false);
  const finalizadoRef = useRef(false);

  const config = useMemo(() => obtenerConfiguracionNivel(nivelId), [nivelId]);
  const velocidadBase = config ? obtenerVelocidadTiempo(config.tiempo) : null;

  useEffect(() => {
    if (!config) return;

    const nuevoIntento = crearIntentoNivel(config);
    const nuevoEstadoRondas = crearEstadoRondas(config);

    setIntento(nuevoIntento);
    setCorazonesRestantes(nuevoIntento.corazonesRestantes);
    setRondaActual(0);
    setResultadoFinal(null);
    setEstadoRecompensaHX(null);
    setMostrarVictoria(false);
    setNivelTerminado(false);
    setRespondida(false);
    setResultadoRonda(null);
    setCorrectPokemon(null);
    setPokemonSeleccionado(null);
    setSinRondaDisponible(false);
    finalizadoRef.current = false;

    avanzarRonda(nuevoEstadoRondas, config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivelId, config]);

  useEffect(() => {
    if (!intento || respondida || nivelTerminado || sinRondaDisponible || !config || velocidadBase === null) {
      return;
    }

    timerRef.current = setInterval(() => {
      const velocidadActual = config.tiempoDinamico
        ? calcularVelocidadDinamica(velocidadBase, rondaActual, config.totalRondas)
        : velocidadBase;

      setTiempoLeft((prev) => {
        const siguiente = prev - velocidadActual;
        if (siguiente <= 0) {
          clearInterval(timerRef.current);
          if (!respondidaRef.current) {
            window.setTimeout(() => procesarRespuesta(false), 0);
          }
          return 0;
        }
        return siguiente;
      });
    }, INTERVALO_TICK_MS);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intento, respondida, nivelTerminado, sinRondaDisponible, rondaActual, config, velocidadBase]);

  function avanzarRonda(estadoActual, configActual) {
    const { ronda, estado } = generarSiguienteRonda(configActual, dataState.pokedex, estadoActual);

    setEstadoRondas(estado);

    if (!ronda) {
      setSinRondaDisponible(true);
      return;
    }

    setType1(ronda.type1);
    setType2(ronda.type2);
    setCorrectPokemon(ronda.correctPokemon);
    setOpciones(ronda.opciones);
    setRespondida(false);
    respondidaRef.current = false;
    setResultadoRonda(null);
    setPokemonSeleccionado(null);
    setTiempoLeft(TIEMPO_INICIAL);
  }

  function procesarRespuesta(esCorrecta) {
    if (respondidaRef.current || !intento) return;
    clearInterval(timerRef.current);
    respondidaRef.current = true;
    setRespondida(true);
    if (esCorrecta) {
      playWinSound();
    } else {
      playLoseSound();
    }

    const paso = procesarRondaNivel(intento, esCorrecta);
    setResultadoRonda({
      resultado: esCorrecta ? 'correcto' : 'incorrecto',
      ...paso,
    });
    setCorazonesRestantes(paso.corazonesRestantes);

    if (paso.nivelTerminado) {
      finalizarNivel();
      return;
    }

  }

  async function finalizarNivel() {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    clearInterval(timerRef.current);
    setNivelTerminado(true);

    const resultado = calcularResultadoNivel(intento);
    setResultadoFinal(resultado);
    setEstadoRecompensaHX(resultado.aprobado ? 'pendiente' : 'no-aplica');

    try {
      if (resultado.aprobado) {
        const progresoCompletoAntes = nivelId === NIVEL_FINAL_ESTUDIO
          ? await haCompletadoTodos(TODOS_LOS_NIVELES)
          : false;
        const yaCompletado = await yaCompletoNivel(nivelId);
        if (!yaCompletado) {
          await marcarNivelCompletado(nivelId);
          await sumarHX(config.hxRecompensa);
          setEstadoRecompensaHX('ganado');
        } else {
          setEstadoRecompensaHX('ya-obtenido');
        }
        if (nivelId === NIVEL_FINAL_ESTUDIO && !progresoCompletoAntes) {
          const progresoCompleto = await haCompletadoTodos(TODOS_LOS_NIVELES);
          if (progresoCompleto) setMostrarVictoria(true);
        }
        await verificarDesbloqueos(nivelId, config.liga);
      } else {
        await restarVidaGeneral();
      }
    } catch (error) {
      console.error('No se pudo actualizar el progreso del estudio:', error);
      showToast('No se pudo actualizar el progreso del estudio.');
      if (resultado.aprobado) {
        setEstadoRecompensaHX((estadoActual) =>
          estadoActual === 'pendiente' ? 'error' : estadoActual
        );
      }
    }
  }

  function handleAnswer(pokemon) {
    if (!correctPokemon || respondida || !pokemon) return;
    setPokemonSeleccionado(pokemon.name);
    procesarRespuesta(pokemon.name === correctPokemon.name);
  }

  function siguienteRonda() {
    setRondaActual((prev) => prev + 1);
    avanzarRonda(estadoRondas, config);
  }

  if (!config) {
    return <div>Nivel no encontrado</div>;
  }

  if (sinRondaDisponible) {
    return (
      <div className="StudyGameplay Result">
        <h2>No hay más combinaciones disponibles</h2>
        <p>Este nivel se quedó sin Pokémon disponibles para seguir generando rondas.</p>
        <div className="GameplayActions">
          <button className="BackButton" onClick={onBack}>Volver a Ligas</button>
        </div>
      </div>
    );
  }

  if (nivelTerminado && resultadoFinal) {
    return (
      <div className="StudyGameplay Result">
        <h2>{resultadoFinal.aprobado ? '¡Nivel Superado!' : 'Nivel No Superado'}</h2>
        <p>Aciertos: {resultadoFinal.aciertos}/{resultadoFinal.totalRondas}</p>
        {resultadoFinal.aprobado ? (
          <p className="HxRewardMessage" role="status">
            {estadoRecompensaHX === 'pendiente' && 'Verificando recompensa de HX...'}
            {estadoRecompensaHX === 'ganado' && `¡Ganaste ${config.hxRecompensa} HX!`}
            {estadoRecompensaHX === 'ya-obtenido' && 'Este nivel ya fue completado. La recompensa de HX solo se entrega una vez.'}
            {estadoRecompensaHX === 'error' && 'No se pudo confirmar la recompensa de HX.'}
          </p>
        ) : (
          <p className="HxRewardMessage">No se otorga HX porque no superaste el nivel.</p>
        )}
        <div className="GameplayActions">
          <button className="BackButton" onClick={onBack}>Volver a Ligas</button>
          <button className="NextButton" onClick={() => window.location.reload()}>Jugar de Nuevo</button>
        </div>
        {mostrarVictoria && <StudyVictory onClose={() => setMostrarVictoria(false)} />}
      </div>
    );
  }

  return (
    <div className="StudyGameplay">
      <div className="GameplayHeader">
        <div className="GameplayStat">
          <span>Ronda</span>
          <h3>{rondaActual + 1}/{config.totalRondas}</h3>
        </div>
        <div className="GameplayStat">
          <span>Vidas</span>
          <div className="HeartDisplay">
            {'❤️'.repeat(corazonesRestantes)}{'🖤'.repeat(3 - corazonesRestantes)}
          </div>
        </div>
      </div>

      <div className="StudyTypes">
        <div className="PokemonType">
          <img
            src={type1 ? typesIcons[type1] : undefined}
            alt={type1 || ''}
            style={{ backgroundColor: type1 ? typesColors[type1] : 'transparent' }}
          />
        </div>
        {type2 && (
          <div className="PokemonType">
            <img
              src={typesIcons[type2]}
              alt={type2}
              style={{ backgroundColor: typesColors[type2] }}
            />
          </div>
        )}
      </div>

      {respondida && resultadoRonda && (
        <div className={`RoundResultMessage ${resultadoRonda.resultado === 'correcto' ? 'Correct' : 'Incorrect'}`} role="status">
          <p>
            {resultadoRonda.resultado === 'correcto'
              ? `¡Lectura perfecta! Has reconocido a ${capitalizeFirstLetter(correctPokemon.name.replaceAll('-', ' '))}.`
              : `¡Nuevo descubrimiento! La respuesta era ${capitalizeFirstLetter(correctPokemon.name.replaceAll('-', ' '))}. Sigue aprendiendo en cada ronda.`}
          </p>
        </div>
      )}

      {velocidadBase !== null && (
        <progress
          className="TimerProgress"
          value={Math.max(0, tiempoLeft)}
          max={TIEMPO_INICIAL}
          aria-label="Tiempo restante"
        />
      )}

      <div className="AnswerOptions">
        {opciones.map((pokemon) => (
          <button
            key={pokemon.name}
            className={`AnswerOptionButton ${
              respondida && pokemon.name === correctPokemon?.name ? 'IsCorrect' : ''
            } ${
              respondida && resultadoRonda?.resultado === 'incorrecto' && pokemonSeleccionado === pokemon.name
                ? 'IsIncorrect'
                : ''
            }`}
            onClick={() => handleAnswer(pokemon)}
            disabled={respondida}
          >
            {pokemon.name.replaceAll('-', ' ')}
          </button>
        ))}
      </div>

      {respondida && resultadoRonda && !resultadoRonda.nivelTerminado && (
        <div className="GameplayActions">
          {!resultadoRonda.nivelTerminado && (
            <button className="NextButton" onClick={siguienteRonda}>Siguiente Ronda</button>
          )}
        </div>
      )}
    </div>
  );
}
