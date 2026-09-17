// Variables importadas desde config.js
import { types, typesIcono, coloresTipos, gameState, esperar, btnGenerar, tipo1, tipo2, main, btnVolverDificultadCampista } from '../../../../config/config.js';
import { Aleatoriedad, detenerTodoElAudio, soundLose, capitalizarPrimeraLetra } from '../../utils.js';
import { guardarScoreAntesDePerder, mostrarBotonRevivir } from '../Modo-Entrenamiento/entrenamiento.js';
import { incrementarContadorGenerador } from '../../../../shared/admob/admob.js';
import { registrarActividadGeneral } from '../Desafio-del-Dia/progreso-storage.js';

// Traducción de tipos al español
const tiposEspanol = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

function traducirTipo(tipo) {
  return tiposEspanol[tipo] || capitalizarPrimeraLetra(tipo);
}

// Variables para el selector de Pokémon
let pokedexData = [];
let tomSelectInstance = null;
let selectPokemonGenerador = null;
let btnComprobarGenerador = null;
let imgPokemonGenerador = null;
let textoImgNoDisponible = null;
let mensajeResultadoGenerador = null;

// Inicializar referencias al DOM
function inicializarReferenciasDOM() {
  selectPokemonGenerador = document.getElementById('select-pokemon-generador');
  btnComprobarGenerador = document.getElementById('btn-comprobar-generador');
  imgPokemonGenerador = document.getElementById('img-pokemon-generador');
  textoImgNoDisponible = document.getElementById('texto-img-no-disponible');
  mensajeResultadoGenerador = document.getElementById('mensaje-resultado-generador');
  
  if (btnComprobarGenerador) {
    btnComprobarGenerador.onclick = () => comprobarPokemon();
  }
}

// Inicializar referencias al cargar
inicializarReferenciasDOM();

btnGenerar.onclick = () => iniciarGeneracion();

//Función para Iniciar el conteo en el Generador
export async function iniciarGeneracion() {
  
  btnGenerar.disabled = true;
  
  btnGenerar.textContent = "3...";
  await esperar(1000); 
  
  btnGenerar.textContent = "2...";
  await esperar(1000);
  
  btnGenerar.textContent = "1...";
  await esperar(1000);    
  
  btnGenerar.textContent = "¡Generando!";

  // Limpiar comprobación anterior
  limpiarComprobacion();

  // Incrementar contador de generaciones (para interstitial cada 7)
  incrementarContadorGenerador();

  generarTipos(tipo1, tipo2);
  
  await esperar(500); 
  btnGenerar.textContent = "Generar";
  btnGenerar.disabled = false;
    
}

//Función para generar tipos aleatorios
export async function generarTipos(tipo1Generic, tipo2Generic) {
  gameState.type1Value = types[Aleatoriedad(0, types.length - 1)];
  gameState.type2Value = types[Aleatoriedad(0, types.length - 1)];

  tipo1Generic.src = typesIcono[gameState.type1Value];
  tipo2Generic.src = typesIcono[gameState.type2Value];

  tipo1Generic.style.backgroundColor = coloresTipos[gameState.type1Value];
  tipo2Generic.style.backgroundColor = coloresTipos[gameState.type2Value];

  // Actualizar selector con Pokémon del primer tipo
  actualizarSelector(gameState.type1Value);

  // Registrar actividad para racha general
  await registrarActividadGeneral();
}

//Función para iniciar la barra de tiempo
export function iniciarBarraTiempo(estado, modo, parrafo, boton, barra, mensaje, time, noExiste, validar, input, tiempo, left, modoRevivir = null, pokemonCorrect) {
  barra.style.width = "100%";
  left = 100;
  clearInterval(tiempo);

  tiempo = setInterval(()=>{

    left -= time;

    barra.style.width = left + "%";

    if(left <= 0){
      clearInterval(tiempo);

      if (pokemonCorrect){
        mensaje.innerHTML = "😢 ¡Se te acabo el Tiempo! 😢 </br> Una opción correcta era: " + "<strong>" + capitalizarPrimeraLetra(pokemonCorrect) + "</strong>"
      }else if (!pokemonCorrect){
        mensaje.innerHTML = "😢 ¡Se te acabo el Tiempo! <br> No hay Pokemon Con esa Combinación"
      }

      detenerTodoElAudio();

      if (main.style.display == "none") {
        soundLose();
      }

      if (modoRevivir) {
        guardarScoreAntesDePerder(modoRevivir);
      }

      estado[modo] = 0;
      parrafo.textContent = estado[modo];
      boton.style.display = "flex";

      if (modoRevivir) {
        mostrarBotonRevivir(modoRevivir);
      }

      if(noExiste) noExiste.style.display = "none";
      if(validar) validar.style.display = "none";
      if(input) input.style.display = "none";
      btnVolverDificultadCampista.style.display = "flex"

      const buttons = document.querySelectorAll(".btn-opcion");

      buttons.forEach(btn => {
        btn.style.display = "none";
      });

      console.log("Tiempo acabado");
    }

  },100);
  return tiempo;
}

// ============================================================
// FUNCIONES PARA EL SELECTOR DE POKÉMON
// ============================================================

// Cargar la Pokédex desde el JSON
async function cargarPokedex() {
  try {
    const response = await fetch('/assets/data/pokedex.json');
    pokedexData = await response.json();
    console.log('Pokédex cargada:', pokedexData.length, 'Pokémon');
  } catch (error) {
    console.error('Error al cargar la Pokédex:', error);
  }
}

// Filtrar Pokémon por tipo (primer tipo de la combinación)
function filtrarPokemonPorTipo(tipo) {
  return pokedexData.filter(pokemon =>
    pokemon.types && pokemon.types.includes(tipo)
  );
}

// Inicializar Tom Select
function inicializarTomSelect() {
  if (tomSelectInstance) {
    tomSelectInstance.destroy();
  }

  tomSelectInstance = new TomSelect(selectPokemonGenerador, {
    create: false,
    sortField: {
      field: 'text',
      direction: 'asc'
    },
    render: {
      option: function(data, escape) {
        return '<div class="ts-option">' + escape(data.text) + '</div>';
      }
    }
  });

  // Habilitar botón de comprobar cuando se selecciona un Pokémon
  tomSelectInstance.on('change', function(value) {
    if (value) {
      btnComprobarGenerador.disabled = false;
    } else {
      btnComprobarGenerador.disabled = true;
    }
  });
}

// Actualizar el selector con Pokémon filtrados por tipo
function actualizarSelector(tipo) {
  if (!tomSelectInstance || !selectPokemonGenerador) {
    console.warn('Tom Select o selector no inicializados');
    return;
  }

  const pokemonFiltrados = filtrarPokemonPorTipo(tipo);

  // Limpiar opciones actuales
  tomSelectInstance.clearOptions();

  // Agregar nuevas opciones
  const opciones = pokemonFiltrados.map(pokemon => ({
    value: pokemon.name,
    text: capitalizarPrimeraLetra(pokemon.name)
  }));

  tomSelectInstance.addOptions(opciones);

  // Habilitar selector y Tom Select
  selectPokemonGenerador.disabled = false;
  tomSelectInstance.enable();
  
}

// Comprobar si el Pokémon seleccionado tiene los tipos correctos
function comprobarPokemon() {
  const pokemonSeleccionado = tomSelectInstance.getValue();
  
  if (!pokemonSeleccionado) {
    return;
  }

  const pokemon = pokedexData.find(p => p.name === pokemonSeleccionado);
  
  if (!pokemon) {
    return;
  }

  const tipo1 = gameState.type1Value;
  const tipo2 = gameState.type2Value;
  const pokemonTypes = pokemon.types || [];

  let esCorrecto = false;

  // Lógica de validación
  if (tipo1 === tipo2) {
    // Combinación monotipo: el Pokémon debe ser monotipo con ese tipo
    esCorrecto = pokemonTypes.length === 1 && pokemonTypes[0] === tipo1;
  } else {
    // Combinación dual: verificar si tiene ambos tipos
    esCorrecto = pokemonTypes.includes(tipo1) && pokemonTypes.includes(tipo2);
  }

  mostrarResultado(esCorrecto, pokemon, tipo1, tipo2);
}

// Mostrar resultado (imagen y mensaje)
function mostrarResultado(esCorrecto, pokemon, tipo1, tipo2) {
  // Limpiar estado anterior
  imgPokemonGenerador.style.display = 'none';
  textoImgNoDisponible.style.display = 'none';

  // Generar mensaje amigable con tipos en español
  let mensaje = '';
  if (tipo1 === tipo2) {
    if (esCorrecto) {
      mensaje = `¡Excelente! ${capitalizarPrimeraLetra(pokemon.name)} sí es de tipo ${traducirTipo(tipo1)}`;
    } else {
      mensaje = `Hmm, ${capitalizarPrimeraLetra(pokemon.name)} no es monotipo de ${traducirTipo(tipo1)}. Inténtalo de nuevo`;
    }
  } else {
    if (esCorrecto) {
      mensaje = `¡Perfecto! ${capitalizarPrimeraLetra(pokemon.name)} tiene los tipos ${traducirTipo(tipo1)} y ${traducirTipo(tipo2)}`;
    } else {
      mensaje = `Casi... ${capitalizarPrimeraLetra(pokemon.name)} no tiene ambos tipos ${traducirTipo(tipo1)} y ${traducirTipo(tipo2)}`;
    }
  }

  mensajeResultadoGenerador.textContent = mensaje;
  mensajeResultadoGenerador.style.color = esCorrecto ? '#4CAF50' : '#F44336';

  // Intentar cargar la imagen
  const img = new Image();
  img.onload = function() {
    imgPokemonGenerador.src = pokemon.sprite;
    imgPokemonGenerador.style.display = 'block';
  };
  img.onerror = function() {
    textoImgNoDisponible.style.display = 'block';
  };
  img.src = pokemon.sprite;
}

// Limpiar comprobación al generar nueva combinación
function limpiarComprobacion() {
  imgPokemonGenerador.style.display = 'none';
  textoImgNoDisponible.style.display = 'none';
  mensajeResultadoGenerador.textContent = '';
  
  // Deshabilitar selector y botón
  selectPokemonGenerador.disabled = true;
  btnComprobarGenerador.disabled = true;
  
  // Limpiar selección de Tom Select
  if (tomSelectInstance) {
    tomSelectInstance.clear();
  }
}

// Inicializar al cargar el módulo
inicializarReferenciasDOM();
cargarPokedex().then(() => {
  inicializarTomSelect();
});
