// Lista de combinaciones de tipos que no existen en el juego
export const blacklist = {
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
export const types = [
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
export const typesIcono = {
    "normal": "assets/img/poketype/normal.svg",
    "fire": "assets/img/poketype/fire.svg",
    "water": "assets/img/poketype/water.svg",
    "electric": "assets/img/poketype/electric.svg",
    "grass": "assets/img/poketype/grass.svg",
    "ice": "assets/img/poketype/ice.svg",
    "fighting": "assets/img/poketype/fighting.svg",
    "poison": "assets/img/poketype/poison.svg",
    "ground": "assets/img/poketype/ground.svg",
    "flying": "assets/img/poketype/flying.svg",
    "psychic": "assets/img/poketype/psychic.svg",
    "bug": "assets/img/poketype/bug.svg",
    "rock": "assets/img/poketype/rock.svg",
    "ghost": "assets/img/poketype/ghost.svg",
    "dragon": "assets/img/poketype/dragon.svg",
    "dark": "assets/img/poketype/dark.svg",
    "steel": "assets/img/poketype/steel.svg",
    "fairy": "assets/img/poketype/fairy.svg"
}

// Lista de los colores de tipos de Pokémon
export const coloresTipos = {
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

// Secciones Principales del DOM
export const splash = document.getElementById("custom-splash");
export const main = document.getElementById("main");
export const dificultad = document.getElementById("dificultad");
export const generador = document.getElementById("generador");
export const acerca = document.getElementById("acerca");
export const campista = document.getElementById("panel-campista");
export const As = document.getElementById("panel-As");
export const campeon = document.getElementById("panel-campeon");
export const notificacion = document.getElementById("notificacion");

// SubSecciones del DOM
export const confirmacionCampista = document.getElementById("ventana-confirmacion-campista");
export const confirmacionAs = document.getElementById("ventana-confirmacion-As");
export const confirmacionCampeon = document.getElementById("ventana-confirmacion-campeon");

// Cajas Especificas del DOM
export const cajaOpcionesPokemon = document.getElementById("opciones-pokemon");
export const cajaSelect = document.getElementById("caja-select");
export const cajainput = document.getElementById("caja-input");

// Elementos Especificos del Apartado de main
export const btnJuego = document.getElementById("btn-juego");
export const btnGenerador = document.getElementById("btn-generador");
export const btnAcerca = document.getElementById("btn-acerca");
export const telegram = document.getElementById("telegram");

//Elementos Especificos del Apartado del Generador
export const tipo1 = document.getElementById("tipo1");
export const tipo2 = document.getElementById("tipo2");
export const btnGenerar = document.getElementById("btn-generar");

//Elementos Especificos del Apartado de Campista
export const btnCampista = document.getElementById("btn-campista");
export const btnIniciarJuegoCampista = document.getElementById("btn-iniciar-juego-campista");
export const pScoreCampista = document.getElementById("score-campista");
export const pMaxCampista = document.getElementById("max-campista");
export const reinicioScoreCampista = document.getElementById("reinicio-score-campista");
export const btnReinicioMaxCampista = document.getElementById("reinicio-max-campista");
export const confirmarReinicioCampista = document.getElementById("btn-confirmar-reinicio-campista");
export const cancelarReinicioCampista = document.getElementById("btn-cancelar-reinicio-campista");
export const tipo1Campista = document.getElementById("type1-icon-campista");
export const tipo2Campista = document.getElementById("type2-icon-campista");
export const barraTiempoCampista = document.getElementById("tiempo-campista");
export const mensajeAciertoCampista = document.getElementById("mensaje-acierto-campista");
export const btnNextCampista = document.getElementById("btn-next-campista");
export const btnIntentoCampista = document.getElementById("btn-intento-campista");
export const btnRevivirCampista = document.getElementById("revivir-campista");

//Elementos Especificos del Apartado de As de Batalla
export const btnAs = document.getElementById("btn-as");
export const btnIniciarJuegoAs = document.getElementById("iniciar-juego-As");
export const pScoreAs = document.getElementById("score-As");
export const pMaxAs = document.getElementById("max-As");
export const reinicioScoreAs = document.getElementById("reinicio-score-As");
export const btnReinicioMaxAs = document.getElementById("reinicio-max-As");
export const confirmarReinicioAs = document.getElementById("btn-confirmar-reinicio-As");
export const cancelarReinicioAs = document.getElementById("btn-cancelar-reinicio-As");
export const tipo1As = document.getElementById("type1-icon-As");
export const tipo2As = document.getElementById("type2-icon-As");
export const barraTiempoAs = document.getElementById("tiempo-As");
export const mensajeAciertoAs = document.getElementById("mensaje-acierto-As");
export const inputSelectAs = document.getElementById("select");
export const datalistAs = document.getElementById("pokemones");
export const btnNextAs = document.getElementById("btn-next-As");
export const btnIntentoAs = document.getElementById("btn-intento-As");
export const btnRevivirAs = document.getElementById("revivir-As");
export const btnValidarAs = document.getElementById("btn-validar-select-As");
export const btnNoExisteAs = document.getElementById("no-existe-As");

//Elementos Especificos del Apartado de Campeon
export const btnCampeon = document.getElementById("btn-campeon");
export const btnIniciarJuegoCampeon = document.getElementById("iniciar-juego-campeon");
export const pScoreCampeon = document.getElementById("score-campeon");
export const pMaxCampeon = document.getElementById("max-campeon");
export const reinicioScoreCampeon = document.getElementById("reinicio-score-campeon");
export const btnReinicioMaxCampeon = document.getElementById("reinicio-max-campeon");
export const confirmarReinicioCampeon = document.getElementById("btn-confirmar-reinicio-campeon");
export const cancelarReinicioCampeon = document.getElementById("btn-cancelar-reinicio-campeon");
export const tipo1Campeon = document.getElementById("type1-icon-campeon");
export const tipo2Campeon = document.getElementById("type2-icon-campeon");
export const barraTiempoCampeon = document.getElementById("tiempo-campeon");
export const mensajeAciertoCampeon = document.getElementById("mensaje-acierto-campeon");
export const respuestaInputCampeon = document.getElementById("respuesta-input-campeon");
export const btnNextCampeon = document.getElementById("btn-next-campeon");
export const btnIntentoCampeon = document.getElementById("btn-intento-campeon");
export const btnRevivirCampeon = document.getElementById("revivir-campeon");
export const btnNoExisteCampeon = document.getElementById("no-existe-campeon");
export const btnRevelarCampeon = document.getElementById("btn-revelar-campeon");

//Objeto con la configuración de cada modo.
export const configRevivir = {
  campista: {
    btn: btnRevivirCampista,
    btnIntento: btnIntentoCampista,
    mensaje: mensajeAciertoCampista,
    scoreKey: "scoreCampista",
    pScore: pScoreCampista,
  },
  as: {
    btn: btnRevivirAs,
    btnIntento: btnIntentoAs,
    mensaje: mensajeAciertoAs,
    scoreKey: "scoreAsDeBatalla",
    pScore: pScoreAs,
  },
  campeon: {
    btn: btnRevivirCampeon,
    btnIntento: btnIntentoCampeon,
    mensaje: mensajeAciertoCampeon,
    scoreKey: "scoreCampeon",
    pScore: pScoreCampeon,
  },
};

//Elementos Especificos Generales
export const toastMensaje = document.getElementById("mensaje-notificacion");
export const conteoBtnRevivir = 3;

//IDs de los anuncios / Eventos
export const idBanner = "ca-app-pub-1898586331132450/5546962412" || "Real";
export const idBonificado = "ca-app-pub-1898586331132450/8031266354" || "Real";
export const eventosBonificado = {
  cargado: "onRewardedVideoAdLoaded",
  falloCarga: "onRewardedVideoAdFailedToLoad",
  recompensa: "onRewardedVideoAdReward",
  cerrado: "onRewardedVideoAdDismissed",
};

//Variables sin valor Definido - Agrupadas en gameState
export const gameState = {
  type1Value: "",
  type2Value: "",
  tiempoCampista: null,
  tiempoAsDeBatalla: null,
  tiempoCampeon: null,
  selectedPokemon: "",
  pokemonesValidos: []
};

//Variables Del Tiempo de los Modos y los contadores - Agrupadas en timeState
export const timeState = {
  tiempoCampistaLeft: 100,
  tiempoAsDeBatallaLeft: 100,
  tiempoCampeonLeft: 100,
  intervaloContadorRevivir: null
};

//Variables de Internet y Cargas de los anuncios - Agrupadas en adState
export const adState = {
  hayInternet: navigator.onLine,
  bannerPendiente: false,
  bannerVisible: false,
  bonificadoCargado: false,
  modoRevivirActivo: null,
  recompensaGanada: false
};

//Objeto del score de los modos de juego - Agrupado en scoreState
export const scoreState = {
  maxCampista: localStorage.getItem("maxCampista") || 0,
  maxAsDeBatalla: localStorage.getItem("maxAsDeBatalla") || 0,
  maxCampeon: localStorage.getItem("maxCampeon") || 0,
  scoreCampistaAntesDePerder: 0,
  scoreAsAntesDePerder: 0,
  scoreCampeonAntesDePerder: 0,
  estadoJuego: {
    scoreCampista: 0,
    scoreAsDeBatalla: 0,
    scoreCampeon: 0
  }
};

//Variables con arrowFunction
export const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//Arrays - Agrupados en dataState
export const dataState = {
  pokedex: []
};

//Varibales y valores por Defecto del sonido
export const musicaCampista = new Audio("assets/sonidos/music/musicCampista.mp3");
export const musicaAsBatalla = new Audio("assets/sonidos/music/musicAs.mp3");
export const musicaCampeon = new Audio("assets/sonidos/music/musicCampeon.mp3");

export const sonidoGanar = new Audio("assets/sonidos/efectoSound/win.mp3");
export const sonidoPerder = new Audio("assets/sonidos/efectoSound/lose.mp3");

export const sonidoTouch = new Audio("assets/sonidos/efectoSound/touchButtom.mp3");

musicaCampista.volume = 0.3;
musicaAsBatalla.volume = 0.3;
musicaCampeon.volume = 0.3;

sonidoGanar.volume = 0.7;
sonidoPerder.volume = 0.7;

musicaCampista.loop = true;
musicaAsBatalla.loop = true;
musicaCampeon.loop = true;

export const musicActual = {
  musicActualPlay: null
}
