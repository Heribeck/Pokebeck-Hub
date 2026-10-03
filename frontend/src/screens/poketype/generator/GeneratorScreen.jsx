import { useState } from "react";

import { typesIcons, typesColors } from '../../../features/poketype/index.js';
import { startGeneration } from "../../../features/poketype/index.js";
import { gameState } from "../../../features/poketype/index.js";
import { validatePokemon, buildResultMessage } from "../../../features/poketype/index.js";
import { dataState, incrementStreak } from "../../../home/index.js";
import { showToast } from "../../../shared/toast/index.js";
import { NativeAd } from "../../../shared/admob/native/index.js";

export default function GeneratorScreen({ onNavigation }) {

    const [btnText, setBtnText] = useState('Generar');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [type1, setType1] = useState(null);
    const [type2, setType2] = useState(null);
    const [pokemonList, setPokemonList] = useState([]);
    const [selectDisabled, setSelectDisabled] = useState(true);
    const [selectedPokemon, setSelectedPokemon] = useState('');
    const [pokemonSearch, setPokemonSearch] = useState('');
    const [pokemonSearchFocused, setPokemonSearchFocused] = useState(false);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [resultColor, setResultColor] = useState('')
    const [pokemonSprite, setPokemonSprite] = useState(null)
    const [spriteUnavailable, setSpriteUnavailable] = useState(false)
    const isMonotype = type1 && type1 === type2;
    const normalizedSearch = pokemonSearch.trim().toLowerCase().replaceAll('-', ' ');
    const pokemonMatches = normalizedSearch
        ? dataState.pokedex.filter((pokemon) => {
            const matchesName = pokemon.name.replaceAll('-', ' ').toLowerCase().includes(normalizedSearch);
            const isValidMonotype = !isMonotype || (
                pokemon.types.length === 1 && pokemon.types[0] === type1
            );
            return matchesName && isValidMonotype;
        })
        : [];
    const suggestions = [...(isMonotype
        ? pokemonMatches.slice(0, 1)
        : normalizedSearch
            ? pokemonMatches
            : pokemonList
    )].sort((pokemonA, pokemonB) => (
        pokemonA.name.replaceAll('-', ' ').localeCompare(
            pokemonB.name.replaceAll('-', ' '),
            undefined,
            { sensitivity: 'base' }
        )
    ));

    const handleCheck = () => {
        const {isCorrect, pokemon} = validatePokemon(selectedPokemon, gameState.type1Value, gameState.type2Value);
        if (!pokemon) {
            setResultMessage('Escribe un nombre y selecciona una sugerencia.');
            setResultColor('orange');
            return;
        }

        const message = buildResultMessage(isCorrect, pokemon, gameState.type1Value, gameState.type2Value);


        setPokemonSprite(pokemon?.sprite);
        setResultMessage(message);
        setResultColor(isCorrect ? 'green' : 'red');
    };

    const handleGenerate = () => {
        setSelectedPokemon('');
        setPokemonSearch('');
        setSuggestionsOpen(false);
        setResultMessage('');
        setResultColor('');
        setPokemonSprite(null);
        setSpriteUnavailable(false);
        startGeneration(setBtnText, setBtnDisabled, setType1, setType2, setPokemonList, setSelectDisabled);
        incrementStreak().catch((error) => {
            console.error('No se pudo registrar la actividad del generador:', error);
            showToast('No se pudo actualizar la racha.');
        });
    };

    const handlePokemonSearch = (value) => {
        setPokemonSearch(value);
        setSelectedPokemon('');
        setResultMessage('');
        setPokemonSprite(null);
        setSpriteUnavailable(false);
        setSuggestionsOpen(true);
    };

    const handleSuggestionSelect = (pokemon) => {
        setSelectedPokemon(pokemon.name);
        setPokemonSearch(pokemon.name.replaceAll('-', ' '));
        setSuggestionsOpen(false);
    };
    
    return (
        
        <section className="GeneratorScreen">
        
            <div className="GeneratorPanel">

            <NativeAd
                placementId="generator"
                size="compact"
                suspended={pokemonSearchFocused}
            />

            <h2>Generador de Tipos</h2>

            <div className="GeneratorTypes">
                <img 
                className="TypeIcon" 
                src={type1 ? typesIcons[type1] : '/assets/icons/icon-512.webp'} 
                style={{ backgroundColor: typesColors[type1] }} 
                alt="tipo 1"/>

                <img className="TypeIcon" 
                src={type2 ? typesIcons[type2] : '/assets/icons/icon-512.webp'} 
                style={{ backgroundColor: typesColors[type2] }} 
                alt="tipo 2"/>
            </div>

            <div className="PokemonImageContainer">
                {pokemonSprite 
                    ? <img className="PokemonSprite" src={pokemonSprite} alt="Pokémon seleccionado"
                        onError={() => {
                            setPokemonSprite(null)
                            setSpriteUnavailable(true)
                        }}
                    />
                    : spriteUnavailable
                        ? <p className="SpriteUnavailableMessage">¡Este Pokémon aún no aparece en la Pokédex visual, pero puedes probar sus tipos!</p>
                        : <p className="GeneratorPrompt">
                            {type1 ? 'Elige un Pokémon y comprueba si tiene la combinación de tipos revelada.' : 'Pulsa Generar para revelar dos tipos.'}
                        </p>
                }
            </div>
            {resultMessage && (
                <p className="GeneratorResultMessage" role="status" style={{ color: resultColor }}>
                    {resultMessage}
                </p>
            )}
            

            
            <div style={{ position: 'relative', width: '100%' }}>
                <input
                    type="search"
                    className="PokemonSearchInput"
                    name="pokemon-search"
                    aria-label="Buscar Pokémon"
                    aria-autocomplete="list"
                    aria-expanded={suggestionsOpen && suggestions.length > 0}
                    aria-controls="pokemon-suggestions"
                    placeholder={selectDisabled ? 'Primero genera los tipos' : 'Busca un Pokémon'}
                    autoComplete="off"
                    enterKeyHint="search"
                    inputMode="search"
                    disabled={selectDisabled}
                    value={pokemonSearch}
                    onFocus={() => {
                        setSuggestionsOpen(true);
                        setPokemonSearchFocused(true);
                    }}
                    onBlur={() => {
                        setSuggestionsOpen(false);
                        setPokemonSearchFocused(false);
                    }}
                    onChange={(event) => handlePokemonSearch(event.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
                {suggestionsOpen && suggestions.length > 0 && (
                    <div
                        id="pokemon-suggestions"
                        role="listbox"
                        style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 0.5rem)',
                            left: 0,
                            right: 0,
                            maxHeight: 'min(30vh, 14rem)',
                            overflowY: 'auto',
                            zIndex: 1000,
                            padding: '0.25rem',
                            borderRadius: '0.75rem',
                            backgroundColor: 'var(--bg-primary, #1f2937)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                        }}
                    >
                        {suggestions.map((pokemon) => (
                            <button
                                key={pokemon.name}
                                type="button"
                                className="PokemonSuggestionButton"
                                role="option"
                                aria-selected={selectedPokemon === pokemon.name}
                                onPointerDown={(event) => event.preventDefault()}
                                onClick={() => handleSuggestionSelect(pokemon)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.625rem 0.75rem',
                                    border: 0,
                                    background: 'transparent',
                                    color: 'inherit',
                                    textAlign: 'left',
                                }}
                            >
                                {pokemon.name.replaceAll('-', ' ')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
             className="GenerateButton"
             disabled={btnDisabled}
             onClick={handleGenerate}
            >{btnText}</button>

            <button 
            className="CheckGeneratorButton" 
            disabled={selectDisabled}
            onClick={handleCheck}
            >Comprobar</button>

            <button className="BackButton" onClick={() => onNavigation('tools')}>Volver a Herramientas</button>

            </div>
        
        </section>
    );
}