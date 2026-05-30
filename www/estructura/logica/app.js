// Lista de combinaciones de tipos que no existen en el juego
const blacklist = {
  "normal,ice": true,
  "ice,normal": true,
  "normal,bug": true,
  "bug,normal": true,
  "normal,rock": true,
  "rock,normal": true,
  "normal,steel": true,
  "steel,normal": true,
  "fire,fairy": true,
  "fairy,fire": true,
  "bug,dragon": true,
  "dragon,bug": true,
  "rock,ghost": true,
  "ghost,rock": true,
  "ice,poison": true,
  "poison,ice": true,
  "ground,fairy": true,
  "fairy,ground": true,
};

// Lista de tipos de Pokémon
const types = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
];

// Lista de iconos de tipos de Pokémon
const typesIcono = {
    "normal": "assets/normal.svg",
    "fire": "assets/fire.svg",
    "water": "assets/water.svg",
    "electric": "assets/electric.svg",
    "grass": "assets/grass.svg",
    "ice": "assets/ice.svg",
    "fighting": "assets/fighting.svg",
    "poison": "assets/poison.svg",
    "ground": "assets/ground.svg",
    "flying": "assets/flying.svg",
    "psychic": "assets/psychic.svg",
    "bug": "assets/bug.svg",
    "rock": "assets/rock.svg",
    "ghost": "assets/ghost.svg",
    "dragon": "assets/dragon.svg",
    "dark": "assets/dark.svg",
    "steel": "assets/steel.svg",
    "fairy": "assets/fairy.svg"
}

// Lista de los colores de tipos de Pokémon
const coloresTipos = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water": "#6390F0",
    "electric": "#F7D02C",
    "grass": "#7AC74C",
    "ice": "#96D9D6",
    "fighting": "#C22E28",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "flying": "#A98FF3",
    "psychic": "#F95587",
    "bug": "#A6B91A",
    "rock": "#B6A136",
    "ghost": "#735797",
    "dragon": "#6F35FC",
    "dark": "#383838",
    "steel": "#B7B7CE",
    "fairy": "#D685AD"
};

// Lista de los nombres de los Pokémon traducidos de español a inglés. para que la API pueda entender el nombre del pokemon.
const diccionarioPokemon = {
    // --- PARADOJAS DEL PASADO (ESCARLATA) ---
    "colmilargo": "great-tusk",
    "colacrito": "scream-tail",
    "furioseta": "brute-bonnet",
    "melena aleteo": "flutter-mane",
    "melenaleteo": "flutter-mane",
    "reptalada": "slither-wing",
    "pelarena": "sandy-shocks",
    "bramaluna": "roaring-moon",
    "ondulagua": "walking-wake",
    "flamariete": "gouging-fire",
    "electrofuria": "raging-bolt",

    // --- PARADOJAS DEL FUTURO (PÚRPURA) ---
    "ferrodada": "iron-treads",
    "ferrosaco": "iron-bundle",
    "ferropalmas": "iron-hands",
    "ferrocuello": "iron-jugulis",
    "ferropolilla": "iron-moth",
    "ferropuas": "iron-thorns",
    "ferropaladin": "iron-valiant",
    "ferroverdor": "iron-leaves",
    "ferromole": "iron-boulder",
    "ferrotesta": "iron-crown",

    // --- LEGENDARIOS Y POKÉMON CON FORMAS ESPECÍFICAS ---
    "giratina": "giratina-altered",
    "deoxys": "deoxys-normal",
    "aegislash": "aegislash-shield",
    "keldeo": "keldeo-ordinary",
    "meloetta": "meloetta-aria",
    "tornadus": "tornadus-incarnate",
    "thundurus": "thundurus-incarnate",
    "landorus": "landorus-incarnate",
    "enamorus": "enamorus-incarnate",
    "zacian": "zacian-hero",
    "zamazenta": "zamazenta-hero",
    "urshifu": "urshifu-single-strike",
    "morpeko": "morpeko-full-belly",
    "mimikyu": "mimikyu-disguised",
    "basculin": "basculin-red-striped",
    "darmanitan": "darmanitan-standard",
    
    // --- EXTRAS QUE A VECES DAN PROBLEMAS ---
    "mr mime": "mr-mime",
    "mr. mime": "mr-mime",
    "tapu koko": "tapu-koko",
    "tapu lele": "tapu-lele",
    "tapu bulu": "tapu-bulu",
    "tapu fini": "tapu-fini",
    "ting lu": "ting-lu",
    "chien pao": "chien-pao",
    "wo chien": "wo-chien",
    "chi yu": "chi-yu",
    "frillish": "frillish-male",
    "jellicent": "jellicent-male",

    // --- DIFERENCIAS DE GÉNERO (Redirigiendo al macho por defecto) ---
    "pyroar": "pyroar-male",
    "meowstic": "meowstic-male",
    "indeedee": "indeedee-male",
    "basculegion": "basculegion-male",
    "oinkologne": "oinkologne-male",
    
    // El clásico problema de Nidoran (la API usa -m y -f en vez de macho/hembra)
    "nidoran": "nidoran-m",
};

// Secciones Principales del DOM
const splash = document.getElementById("custom-splash");
const main = document.getElementById("main");
const dificultad = document.getElementById("dificultad");
const generador = document.getElementById("generador");
const acerca = document.getElementById("acerca");
const campista = document.getElementById("panel-campista");
const As = document.getElementById("panel-As");
const campeon = document.getElementById("panel-campeon");
const notificacion = document.getElementById("notificacion");

// SubSecciones del DOM
const configuracion = document.getElementById("Configuración");
const sectionMensajes = document.getElementById("section-mensajes");
const confirmacionCampista = document.getElementById("ventana-confirmacion-campista");
const confirmacionAs = document.getElementById("ventana-confirmacion-As");
const confirmacionCampeon = document.getElementById("ventana-confirmacion-campeon");

// Cajas Especificas del DOM
const menuDesplegable = document.getElementById("menu-desplegable");
const barraProgreso = document.getElementById("barra-progreso");
const cajaOpcionesPokemon = document.getElementById("opciones-pokemon");
const cajaSelect = document.getElementById("caja-select");
const datalist = document.getElementById("pokemones");
const cajainput = document.getElementById("caja-input");

// Elementos Especificos del Apartado de main
const btnJuego = document.getElementById("btn-juego");
const btnGenerador = document.getElementById("btn-generador");
const btnAcerca = document.getElementById("btn-acerca");
const telegram = document.getElementById("telegram");

//Elementos Especificos del Apartado del Generador
const tipo1 = document.getElementById("tipo1");
const tipo2 = document.getElementById("tipo2");
const btnGenerar = document.getElementById("btn-generar");

//Elementos Especificos del Apartado de Campista
const btnCampista = document.getElementById("btn-campista");
const btnIniciarJuegoCampista = document.getElementById("btn-iniciar-juego-campista");
const pScoreCampista = document.getElementById("score-campista");
const pMaxCampista = document.getElementById("max-campista");
const reinicioScoreCampista = document.getElementById("reinicio-score-campista");
const btnReinicioMaxCampista = document.getElementById("reinicio-max-campista");
const confirmarReinicioCampista = document.getElementById("btn-confirmar-reinicio-campista");
const cancelarReinicioCampista = document.getElementById("btn-cancelar-reinicio-campista");
const tipo1Campista = document.getElementById("type1-icon-campista");
const tipo2Campista = document.getElementById("type2-icon-campista");
const barraTiempoCampista = document.getElementById("tiempo-campista");
const mensajeAciertoCampista = document.getElementById("mensaje-acierto-campista");
const btnNextCampista = document.getElementById("btn-next-campista");
const btnIntentoCampista = document.getElementById("btn-intento-campista");

//Elementos Especificos del Apartado de As de Batalla
const btnAs = document.getElementById("btn-as");
const btnIniciarJuegoAs = document.getElementById("iniciar-juego-As");
const pScoreAs = document.getElementById("score-As");
const pMaxAs = document.getElementById("max-As");
const reinicioScoreAs = document.getElementById("reinicio-score-As");
const btnReinicioMaxAs = document.getElementById("reinicio-max-As");
const confirmarReinicioAs = document.getElementById("btn-confirmar-reinicio-As");
const cancelarReinicioAs = document.getElementById("btn-cancelar-reinicio-As");
const tipo1As = document.getElementById("type1-icon-As");
const tipo2As = document.getElementById("type2-icon-As");
const barraTiempoAs = document.getElementById("tiempo-As");
const mensajeAciertoAs = document.getElementById("mensaje-acierto-As");
const inputSelectAs = document.getElementById("select");
const datalistAs = document.getElementById("pokemones");
const btnNextAs = document.getElementById("btn-next-As");
const btnIntentoAs = document.getElementById("btn-intento-As");
const btnValidarAs = document.getElementById("btn-validar-select-As");
const btnNoExisteAs = document.getElementById("no-existe-As");

//Elementos Especificos del Apartado de Campeon
const btnCampeon = document.getElementById("btn-campeon");
const btnIniciarJuegoCampeon = document.getElementById("iniciar-juego-campeon");
const pScoreCampeon = document.getElementById("score-campeon");
const pMaxCampeon = document.getElementById("max-campeon");
const reinicioScoreCampeon = document.getElementById("reinicio-score-campeon");
const btnReinicioMaxCampeon = document.getElementById("reinicio-max-campeon");
const confirmarReinicioCampeon = document.getElementById("btn-confirmar-reinicio-campeon");
const cancelarReinicioCampeon = document.getElementById("btn-cancelar-reinicio-campeon");
const tipo1Campeon = document.getElementById("type1-icon-campeon");
const tipo2Campeon = document.getElementById("type2-icon-campeon");
const barraTiempoCampeon = document.getElementById("tiempo-campeon");
const mensajeAciertoCampeon = document.getElementById("mensaje-acierto-campeon");
const respuestaInputCampeon = document.getElementById("respuesta-input-campeon");
const btnNextCampeon = document.getElementById("btn-next-campeon");
const btnIntentoCampeon = document.getElementById("btn-intento-campeon");
const btnNoExisteCampeon = document.getElementById("no-existe-campeon");
const btnRevelarCampeon = document.getElementById("btn-revelar-campeon");

//Elementos Especificos Generales
const toastMensaje = document.getElementById("mensaje-notificacion");

//Variables sin valor Definido
let type1Value;
let type2Value;
let type1Value1;
let type2Value1;
let tiempoCampista;
let tiempoAsDeBatalla;
let tiempoCampeon;
let selectedPokemon;

//Variables De la Barra de Tiempo de los Modos
let tiempoCampistaLeft = 100;
let tiempoAsDeBatallaLeft = 100;
let tiempoCampeonLeft = 100;

//Objeto del score de los modos de juego
let estadoJuego = { 
  scoreCampista: 0,
  scoreAsDeBatalla: 0,
  scoreCampeon: 0
}

//Variables de Local Storage
let maxCampista = localStorage.getItem("maxCampista") || 0;
let maxAsDeBatalla = localStorage.getItem("maxAsDeBatalla") || 0;
let maxCampeon = localStorage.getItem("maxCampeon") || 0;

//Variables con arrowFunction
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//Arrays
let pokedex = [];
let pokemonesValidos = [];

// Función para generar números aleatorios
function Aleatoriedad(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

//Carga inicial
loadApp();
document.addEventListener("DOMContentLoaded", ()=>{
    if(window.Capacitor){

        const App = window.Capacitor.Plugins.App;

        App.addListener("backButton", ()=>{history.back();});

    }
});
cargarPokedex();

//Funcion de barra de carga del SplashScreen
function loadApp() {
    const progressBar = document.querySelector(".barra-carga");
    let progress = 0;

    const fakeLoader = setInterval(()=>{

    progress += 10;

    progressBar.style.width = progress + "%";

    if(progress >= 100){

    clearInterval(fakeLoader);

    startGame();

    }

},300);
}

//Funcion de inicio del juego (Se acaba el SplashScreen)
async function startGame(){

  splash.style.opacity = "0";

  setTimeout(()=>{

    splash.remove();

  },500);

}

//Funcion para cargar la pokedex
async function cargarPokedex(){

    const response = await fetch(
      "./estructura/data/pokedex.json"
    );

    pokedex = await response.json();
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {

    toastMensaje.textContent = mensaje;
    
    notificacion.classList.add("mostrar");

    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 2000);
}

//Función para Iniciar el conteo en el Generador
async function iniciarGeneracion() {
  
    btnGenerar.disabled = true;
   
    btnGenerar.textContent = "3...";
    await esperar(1000); 
    
    btnGenerar.textContent = "2...";
    await esperar(1000);
    
    btnGenerar.textContent = "1...";
    await esperar(1000);    
    
    btnGenerar.textContent = "¡Generando!";
    
    generarTipos(tipo1, tipo2);
    
    await esperar(500); 
    btnGenerar.textContent = "Generar";
    btnGenerar.disabled = false;
    
}

//Función para generar tipos aleatorios
async function generarTipos(tipo1Generic, tipo2Generic) {
    type1Value = "normal";//types[Aleatoriedad(0, types.length - 1)];
    type2Value = "ice";//types[Aleatoriedad(0, types.length - 1)];
    
    tipo1Generic.src = typesIcono[type1Value];
    tipo2Generic.src = typesIcono[type2Value];
    
    tipo1Generic.style.backgroundColor = coloresTipos[type1Value];
    tipo2Generic.style.backgroundColor = coloresTipos[type2Value];
}

//Función para iniciar la barra de tiempo
function iniciarBarraTiempo(estado, modo, parrafo, boton, barra, mensaje, time, noExiste, validar, input, tiempo, left) {
  barra.style.width = "100%";
  clearInterval(tiempo);

  tiempo = setInterval(()=>{

    left -= time;

    barra.style.width = left + "%";

    if(left <= 0){
      clearInterval(tiempo);
      mensaje.innerHTML = "😢 ¡Se te acabo el Tiempo! 😢";
      estado[modo] = 0;
      parrafo.innerHTML = estado[modo];
      boton.style.display = "flex";
      if(noExiste) noExiste.style.display = "none";
      if(validar) validar.style.display = "none";
      if(input) input.style.display = "none";
            

      const buttons = document.querySelectorAll(".btn-opcion");

      buttons.forEach(btn => {
        btn.style.display = "none";
      });

      console.log("Tiempo acabado");
    }

  },100);
  return tiempo;
}

//Funcion de toda la logica de juego del modo Campista
async function campistaLogica(){

    let pokemonesValidos;
    if (type1Value === type2Value){
      pokemonesValidos = pokedex.filter(pokemon => pokemon.types.includes(type1Value) && pokemon.types.length === 1);
    }else {
      pokemonesValidos = pokedex.filter(pokemon => pokemon.types.includes(type1Value) && pokemon.types.includes(type2Value));
    }
    console.log(pokemonesValidos);

    if(pokemonesValidos.length === 0){
      generarTipos(tipo1Campista, tipo2Campista)
      campistaLogica();
      console.log("No hay pokemones con esa combinación");
      return;
    }
        
    console.log(pokemonesValidos.map(p => p.name));

    const correctPokemon = pokemonesValidos[Math.floor(Math.random() * pokemonesValidos.length)];

    console.log(correctPokemon.name);
    
    const wrongOptions = [];
    while(wrongOptions.length < 3){

        const randomId = Math.floor(Math.random() * 1025) + 1;

        const randomPokemon = pokedex.find(pokemon => pokemon.id === randomId);

        const isCorrect = randomPokemon.name === correctPokemon.name;

        const alreadyExists = wrongOptions.some( p => p.name === randomPokemon.name);

        const hasBothTypes = randomPokemon.types.includes(type1Value) && randomPokemon.types.includes(type2Value);
            
        if(!isCorrect && !alreadyExists && !hasBothTypes){
            wrongOptions.push(randomPokemon);
        }

    }
    console.log(wrongOptions.map(p => p.name));

    const allOptions = [correctPokemon,...wrongOptions];

    allOptions.sort(() => Math.random() - 0.5);

    let answered = false;
    tiempoCampista = iniciarBarraTiempo(estadoJuego, "scoreCampista", pScoreCampista, btnIntentoCampista, barraTiempoCampista, mensajeAciertoCampista, 3, null, null, null, tiempoCampista, tiempoCampistaLeft);

    allOptions.forEach(pokemon => {

        const button = document.createElement("button");

        button.textContent = pokemon.name.replaceAll("-"," ");
        button.className = "btn-opcion";
        button.dataset.name = pokemon.name;

        cajaOpcionesPokemon.appendChild(button);
        
        button.addEventListener('click', () => {
            if(answered) return;
            answered = true;
            clearInterval(tiempoCampista);
            
            if (pokemon.name === correctPokemon.name) {
                console.log("Correcto");

                mensajeAciertoCampista.textContent = "¡Felicidades Sigue Sumando!";
                estadoJuego.scoreCampista++;
                pScoreCampista.textContent = estadoJuego.scoreCampista;

            if (estadoJuego.scoreCampista > maxCampista) {
                maxCampista = estadoJuego.scoreCampista;
                localStorage.setItem("maxCampista", maxCampista);
            }
                pMaxCampista.textContent = maxCampista;

                const buttons = document.querySelectorAll(".btn-opcion");

                buttons.forEach(btn => {
                    btn.style.display = "none";
                });
                btnNextCampista.style.display = "flex";

            } else {
              mensajeAciertoCampista.innerHTML = "Has Perdido.<br>La respuesa correcta era <strong>" + correctPokemon.name.charAt(0).toUpperCase() + correctPokemon.name.slice(1) + "</strong>";
              estadoJuego.scoreCampista = 0;
              pScoreCampista.textContent = estadoJuego.scoreCampista;
              btnIntentoCampista.style.display = "flex";
              const buttons = document.querySelectorAll(".btn-opcion");

              buttons.forEach(btn => {
                  btn.style.display = "none";
              });
            }
        });
        });
}   

//Funcion que crea el listado de los pokemones para el Modo AsDeBatalla
function AsLogica() {
    pokemonesValidos = pokedex.filter(pokemon => pokemon.types.includes(type1Value));
    const pokemonesName = pokemonesValidos.map(p => p.name).sort();
    console.log(pokemonesName);
    pokemonesName.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name.replaceAll("-", " ");
      datalistAs.appendChild(option);
    });
    tiempoAsDeBatalla = iniciarBarraTiempo(estadoJuego, "scoreAsDeBatalla", pScoreAs, btnIntentoAs, barraTiempoAs, mensajeAciertoAs, 1.5, btnNoExisteAs, btnValidarAs, inputSelectAs, tiempoAsDeBatalla, tiempoAsDeBatallaLeft);
    console.log(pokedex.find(p => p.types.includes(type1Value) && p.types.includes(type2Value)));
}

//Funcion que valida la seleccion del usuario en el modo As
function validarSelect() {
    selectedPokemon = inputSelectAs.value;
    console.log(selectedPokemon)

    if (selectedPokemon === "") {
      console.log("No se seleccionó ningún pokemon");
      mostrarNotificacion("Por favor, selecciona un pokemon");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      inputSelectAs.disabled = false;
      return;
    }

    const pokemonSeleccionado = pokedex.find(p => p.name === selectedPokemon);
    console.log(pokemonSeleccionado);

    let ambosTypes = false;

    if(!pokemonSeleccionado) {
      mostrarNotificacion("El pokemon colocado no Existe o esta Mal escrito");
      btnValidarAs.style.display = "flex";
      btnNoExisteAs.style.display = "flex";
      inputSelectAs.disabled = false;
      return;
    }
    
    if (type1Value === type2Value) {
        ambosTypes = pokemonSeleccionado.types.length === 1 && pokemonSeleccionado.types.includes(type1Value);
    } else {
        ambosTypes = pokemonSeleccionado.types.includes(type1Value) && pokemonSeleccionado.types.includes(type2Value);
    }
    
    if (ambosTypes) {
        estadoJuego.scoreAsDeBatalla++;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
        btnNextAs.style.display = "flex";
        mensajeAciertoAs.textContent = "¡Correcto! Sumas a tu racha.";
        clearInterval(tiempoAsDeBatalla);
        if (estadoJuego.scoreAsDeBatalla > maxAsDeBatalla) {
          maxAsDeBatalla = estadoJuego.scoreAsDeBatalla;
          localStorage.setItem("maxAsDeBatalla", maxAsDeBatalla);
          pMaxAs.textContent = maxAsDeBatalla;
        }
    }else {
        estadoJuego.scoreAsDeBatalla = 0;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
        datalistAs.innerHTML = "";
        btnIntentoAs.style.display = "flex";
        mensajeAciertoAs.innerHTML = "¡Incorrecto! <br/><strong>" + selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1) + "</strong> no tiene esa combinación de tipos.";
        clearInterval(tiempoAsDeBatalla);
    }
}

//Funcion que valida si no existe el pokemon con la combinacion de tipos en el modo As
function logicaNoExisteAs() {

    const existeAlguno = pokedex.some(pokemon => {
        const tiposDelPokemon = pokemon.types
        const tieneTipo1 = tiposDelPokemon.includes(type1Value);
        const tieneTipo2 = tiposDelPokemon.includes(type2Value);

        return tieneTipo1 && tieneTipo2;
        
    });

    if(!existeAlguno){
        mensajeAciertoAs.textContent = "Bien Visto no hay pokemon con esa combinación!";
        estadoJuego.scoreAsDeBatalla++;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
        clearInterval(tiempoAsDeBatalla);
        btnNextAs.style.display = "flex";
        btnValidarAs.style.display = "none";
        btnNoExisteAs.style.display = "none";
        cajaSelect.style.display = "none";
        if (estadoJuego.scoreAsDeBatalla > maxAsDeBatalla) {
          maxAsDeBatalla = estadoJuego.scoreAsDeBatalla;
          localStorage.setItem("maxAsDeBatalla", maxAsDeBatalla);
          pMaxAs.textContent = maxAsDeBatalla;
        }

    }else if(existeAlguno){
        mensajeAciertoAs.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
        estadoJuego.scoreAsDeBatalla = 0;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
    }
}

//Función para validar la respuesta del usuario en el modo Campeon
function CampeonLogica() {


    const pokemonSeleccionado = respuestaInputCampeon.value.trim().toLowerCase();
    console.log(pokemonSeleccionado)

    if (pokemonSeleccionado === "") {
        console.log("No se seleccionó ningún pokemon");
        mostrarNotificacion("Por favor, selecciona un pokemon");
        btnNextCampeon.style.display = "none";
        btnRevelarCampeon.style.display = "flex";
        btnNoExisteCampeon.style.display = "flex";
        respuestaInputCampeon.disabled = false;
        return;
    }
    
    const pokemonSeleccionadoTypes = pokedex.find(pokemon => pokemon.name === pokemonSeleccionado);

    if(!pokemonSeleccionadoTypes) {
      console.log("El pokemon seleccionado no existe");
      mostrarNotificacion("El pokemon colocado no Existe");
      btnNextCampeon.style.display = "none";
      btnRevelarCampeon.style.display = "flex";
      btnNoExisteCampeon.style.display = "flex";
      respuestaInputCampeon.disabled = false;
      return;
    }

    let esCorrecto = false;
    if (type1Value === type2Value) {
        esCorrecto = pokemonSeleccionadoTypes.types.length === 1 && pokemonSeleccionadoTypes.types.includes(type1Value);
    } else {
        esCorrecto = pokemonSeleccionadoTypes.types.includes(type1Value) && pokemonSeleccionadoTypes.types.includes(type2Value);
    }

    if (esCorrecto) {
        estadoJuego.scoreCampeon++;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
        mensajeAciertoCampeon.innerHTML = "¡Correcto! Sumas a tu racha";
        respuestaInputCampeon.disabled = true;
        clearInterval(tiempoCampeon);        
        if (estadoJuego.scoreCampeon > maxCampeon) {
          maxCampeon = estadoJuego.scoreCampeon;
          localStorage.setItem("maxCampeon", maxCampeon);
          pMaxCampeon.textContent = maxCampeon;
        }

    }else{
        estadoJuego.scoreCampeon = 0;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
        btnIntentoCampeon.style.display = "flex";
        btnNextCampeon.style.display = "none";
        respuestaInputCampeon.disabled = true;
        mensajeAciertoCampeon.innerHTML = "¡Te equivocas! <br/>" + pokemonSeleccionado.charAt(0).toUpperCase() + pokemonSeleccionado.slice(1) + " no tiene esa combinación!";
        clearInterval(tiempoCampeon);
    }
}

//Funcion de la logica del boton "No Existe" en el modo Campeon
function logicaNoExisteCampeon() {
    const existeAlguno = pokedex.some(pokemon => {
        const tiposDelPokemon = pokemon.types
        const tieneTipo1 = tiposDelPokemon.includes(type1Value);
        const tieneTipo2 = tiposDelPokemon.includes(type2Value);

        return tieneTipo1 && tieneTipo2;
        
    });

    if(!existeAlguno){
        mensajeAciertoCampeon.innerHTML = "Bien Visto no hay pokemon con esa combinación!";
        estadoJuego.scoreCampeon++;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
        clearInterval(tiempoCampeon);
        btnNextCampeon.style.display = "flex";
        btnRevelarCampeon.style.display = "none";
        btnNoExisteCampeon.style.display = "none";
        cajainput.style.display = "none";
        clearInterval(tiempoCampeon);
        if (estadoJuego.scoreCampeon > maxCampeon) {
          maxCampeon = estadoJuego.scoreCampeon;
          localStorage.setItem("maxCampeon", maxCampeon);
          pMaxCampeon.textContent = maxCampeon;
        }

    }else if(existeAlguno){
        mensajeAciertoCampeon.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
        estadoJuego.scoreCampeon = 0;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
    }
}


// --- |Evento de boton de "Juego(Dificultades)"
btnJuego.addEventListener("click", () => {
  main.style.display = "none";
  dificultad.style.display = "flex";
  history.pushState({ screen: "juego" }, "Juego", "#juego");
});

// --- |Eventos del apartado "Panel-Campista"| --- //
btnCampista.addEventListener("click", () => {
  dificultad.style.display = "none";
  campista.style.display = "flex";
  pMaxCampista.textContent = maxCampista;
  history.pushState({ screen: "campista" }, "Panel-Campista", "#Panel");
});

//Evento del boton "Iniciar Juego"
btnIniciarJuegoCampista.addEventListener("click", () => {
  generarTipos(tipo1Campista, tipo2Campista);
  btnIniciarJuegoCampista.style.display = "none";
  campistaLogica();
});

//Evento del boton "Siguiente"
btnNextCampista.addEventListener("click", () => {
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnNextCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnIntentoCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento para reiniciar el score del campista
reinicioScoreCampista.addEventListener("click", () => {
  estadoJuego.scoreCampista = 0;
  pScoreCampista.textContent = 0;
  mostrarNotificacion("Score Reiniciado");
});

//Evento para aparecer la ventana de "Reiniciar Max"
btnReinicioMaxCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "flex";
});

//Evento de la confirmación sobre la eliminación del score Max
confirmarReinicioCampista.addEventListener("click", () => {
  localStorage.removeItem("maxCampista");
  maxCampista = 0;
  pMaxCampista.textContent = 0;
  confirmacionCampista.style.display = "none";
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento para cancelar la eliminación del score Max
cancelarReinicioCampista.addEventListener("click", () => {
  confirmacionCampista.style.display = "none";
});

// --- |Eventos del Apartado "Panel-As"| --- //
btnAs.addEventListener("click", () => {
  As.style.display = "flex";
  dificultad.style.display = "none";
  pMaxAs.textContent = maxAsDeBatalla;
  history.pushState({ page: "as" }, "Panel As", "#as");
});

//Evento del boton "Iniciar Juego" del modo As
btnIniciarJuegoAs.addEventListener("click", () => {
  btnIniciarJuegoAs.style.display = "none";
  cajaSelect.style.display = "block";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del Boton "Revelar" Del modo As
btnValidarAs.addEventListener("click", () => {
  btnValidarAs.style.display = "none";
  btnNoExisteAs.style.display = "none";
  inputSelectAs.disabled = true;
  validarSelect();
});

//Evento del Boton "No Existe" Del modo As
btnNoExisteAs.addEventListener("click", () => {
  logicaNoExisteAs();
});

//Evento del Boton "Siguiente" Del modo As
btnNextAs.addEventListener("click", () => {
  btnNextAs.style.display = "none";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  inputSelectAs.disabled = false;
  inputSelectAs.value = "";
  cajaSelect.style.display = "block";
  mensajeAciertoAs.textContent = "";
  datalistAs.innerHTML = "";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del Boton "Volver a intentar" del modo As
btnIntentoAs.addEventListener("click", () => {
  btnIntentoAs.style.display = "none";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  inputSelectAs.disabled = false;
  inputSelectAs.value = "";
  mensajeAciertoAs.innerHTML = "";
  datalistAs.innerHTML = "";
  cajaSelect.style.display = "block";
  inputSelectAs.style.display = "block";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del boton "Reiniciar Max" del modo As
btnReinicioMaxAs.addEventListener("click", () => {
  confirmacionAs.style.display = "flex";
});

//Evento de la confirmación de reinicio Max As
confirmarReinicioAs.addEventListener("click", () => {
  confirmacionAs.style.display = "none";
  localStorage.removeItem("maxAsDeBatalla");
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento de la cancelación de reinicio Max As
cancelarReinicioAs.addEventListener("click", () => {
  confirmacionAs.style.display = "none";
});

//Evento de reinico del Score en As
reinicioScoreAs.addEventListener("click", () => {
  estadoJuego.scoreAsDeBatalla = 0;
  pScoreAs.textContent = 0;
  mostrarNotificacion("Score Reiniciado");
});

// --- |Eventos del Apartado "Panel-Campeon"| --- //
btnCampeon.addEventListener("click", () => {
  dificultad.style.display = "none";
  campeon.style.display = "flex";
  pMaxCampeon.textContent = maxCampeon;
  history.pushState({ screen: "campeon" }, "Panel Campeón", "#panel-campeon");
});

//Evento Para iniciar el juego en el modo Campeon
btnIniciarJuegoCampeon.addEventListener("click", () => {
  btnIniciarJuegoCampeon.style.display = "none";
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 1, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft);
});

//Evento para verificar la respuesta del jugador en el modo Campeon
btnRevelarCampeon.addEventListener("click", () => {
  btnRevelarCampeon.style.display = "none";
  btnNoExisteCampeon.style.display = "none";
  btnNextCampeon.style.display = "flex";
  CampeonLogica();
});

//Evento del boton "siguiente" en el modo de Campeon
btnNextCampeon.addEventListener("click", () => {
  btnNextCampeon.style.display = "none";
  cajainput.style.display = "block";
  btnNoExisteCampeon.style.display = "flex";
  btnRevelarCampeon.style.display = "flex";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 1, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft);
});

//Evento del boton "No Existe" en el modo de Campeon
btnNoExisteCampeon.addEventListener("click", () => {
  logicaNoExisteCampeon();
});

//Evento del Boton "Volver a intentarlo" en el modo Campeon
btnIntentoCampeon.addEventListener("click", () => {
  btnIntentoCampeon.style.display = "none";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";  
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 1, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft);
});

//Evento del Boton "Reiniciar Max" en el modo Campeon
btnReinicioMaxCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "flex";
});

//Evento del Boton "Confirmar Reinicio" en el modo Campeon
confirmarReinicioCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "none";
  localStorage.removeItem("maxCampeon");
  pMaxCampeon.textContent = "0";
  mostrarNotificacion("Score Máximo Reiniciado");
  location.reload();
});

//Evento del Boton "Cancelar Reinicio" en el modo Campeon
cancelarReinicioCampeon.addEventListener("click", () => {
  confirmacionCampeon.style.display = "none";
});

//Evento del Boton "Reiniciar Score" en el modo Campeon
reinicioScoreCampeon.addEventListener("click", () => {
  estadoJuego.scoreCampeon = 0;
  pScoreCampeon.textContent = estadoJuego.scoreCampeon;
  mostrarNotificacion("Score Reiniciado");
});


// --- |Eventos del Apartado "Generador"| --- //
btnGenerador.addEventListener("click", () => {
  generador.style.display = "flex";
  main.style.display = "none";
  history.pushState({ screen: "generador" }, "Generador de Tipos", "#generador");
});

//Evento del Boton "Generar"
btnGenerar.addEventListener("click", () => {
  iniciarGeneracion();
});

// --- |Eventos del Apartado de "Acerca del Proyecto"| --- //
btnAcerca.addEventListener("click", () => {
  main.style.display = "none";
  acerca.style.display = "flex";
  history.pushState({ page: "acerca" }, "Acerca del Proyecto", "#acerca");
});

//Evento del boton de "Telegram"
telegram.addEventListener("click", ()=>{
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
        window.Capacitor.Plugins.Browser.open({ url: 'https://t.me/heribeck' });
    } else {
        window.open('https://t.me/heribeck', '_blank');
    }
});

// --- |Evento de Retroceder ventana
window.addEventListener("popstate", () => {
    main.style.display = "flex";
    acerca.style.display = "none";
    dificultad.style.display = "none";
    generador.style.display = "none";
    campista.style.display = "none";
    As.style.display = "none";
    campeon.style.display = "none";
});