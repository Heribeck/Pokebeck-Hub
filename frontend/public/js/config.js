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

// Elementos DOM agrupados por sección para mejor organización
export const domElements = {
  // Secciones Principales
  secciones: {
    splash: document.getElementById("custom-splash"),
    main: document.getElementById("main"),
    dificultad: document.getElementById("dificultad"),
    generador: document.getElementById("generador"),
    acerca: document.getElementById("acerca"),
    campista: document.getElementById("panel-campista"),
    as: document.getElementById("panel-As"),
    campeon: document.getElementById("panel-campeon"),
    notificacion: document.getElementById("notificacion"),
  },
  
  // SubSecciones de confirmación
  confirmaciones: {
    campista: document.getElementById("ventana-confirmacion-campista"),
    as: document.getElementById("ventana-confirmacion-As"),
    campeon: document.getElementById("ventana-confirmacion-campeon"),
  },
  
  // Cajas contenedoras
  cajas: {
    opcionesPokemon: document.getElementById("opciones-pokemon"),
    select: document.getElementById("caja-select"),
    input: document.getElementById("caja-input"),
  },
  
  // Elementos del menú principal
  main: {
    btnJuego: document.getElementById("btn-juego"),
    btnGenerador: document.getElementById("btn-generador"),
    btnAcerca: document.getElementById("btn-acerca"),
    telegram: document.getElementById("telegram"),
  },
  
  // Elementos del generador
  generador: {
    tipo1: document.getElementById("tipo1"),
    tipo2: document.getElementById("tipo2"),
    btnGenerar: document.getElementById("btn-generar"),
  },
  
  // Elementos del modo Campista
  campista: {
    btnCampista: document.getElementById("btn-campista"),
    btnIniciarJuego: document.getElementById("btn-iniciar-juego-campista"),
    pScore: document.getElementById("score-campista"),
    pMax: document.getElementById("max-campista"),
    reinicioScore: document.getElementById("reinicio-score-campista"),
    btnReinicioMax: document.getElementById("reinicio-max-campista"),
    confirmarReinicio: document.getElementById("btn-confirmar-reinicio-campista"),
    cancelarReinicio: document.getElementById("btn-cancelar-reinicio-campista"),
    tipo1: document.getElementById("type1-icon-campista"),
    tipo2: document.getElementById("type2-icon-campista"),
    barraTiempo: document.getElementById("tiempo-campista"),
    mensajeAcierto: document.getElementById("mensaje-acierto-campista"),
    btnNext: document.getElementById("btn-next-campista"),
    btnIntento: document.getElementById("btn-intento-campista"),
    btnRevivir: document.getElementById("revivir-campista"),
  },
  
  // Elementos del modo As de Batalla
  as: {
    btnAs: document.getElementById("btn-as"),
    btnIniciarJuego: document.getElementById("iniciar-juego-As"),
    pScore: document.getElementById("score-As"),
    pMax: document.getElementById("max-As"),
    reinicioScore: document.getElementById("reinicio-score-As"),
    btnReinicioMax: document.getElementById("reinicio-max-As"),
    confirmarReinicio: document.getElementById("btn-confirmar-reinicio-As"),
    cancelarReinicio: document.getElementById("btn-cancelar-reinicio-As"),
    tipo1: document.getElementById("type1-icon-As"),
    tipo2: document.getElementById("type2-icon-As"),
    barraTiempo: document.getElementById("tiempo-As"),
    mensajeAcierto: document.getElementById("mensaje-acierto-As"),
    select: document.getElementById("select"),
    btnNext: document.getElementById("btn-next-As"),
    btnIntento: document.getElementById("btn-intento-As"),
    btnRevivir: document.getElementById("revivir-As"),
    btnValidar: document.getElementById("btn-validar-select-As"),
    btnNoExiste: document.getElementById("no-existe-As"),
  },
  
  // Elementos del modo Campeon
  campeon: {
    btnCampeon: document.getElementById("btn-campeon"),
    btnIniciarJuego: document.getElementById("iniciar-juego-campeon"),
    pScore: document.getElementById("score-campeon"),
    pMax: document.getElementById("max-campeon"),
    reinicioScore: document.getElementById("reinicio-score-campeon"),
    btnReinicioMax: document.getElementById("reinicio-max-campeon"),
    confirmarReinicio: document.getElementById("btn-confirmar-reinicio-campeon"),
    cancelarReinicio: document.getElementById("btn-cancelar-reinicio-campeon"),
    tipo1: document.getElementById("type1-icon-campeon"),
    tipo2: document.getElementById("type2-icon-campeon"),
    barraTiempo: document.getElementById("tiempo-campeon"),
    mensajeAcierto: document.getElementById("mensaje-acierto-campeon"),
    respuestaInput: document.getElementById("respuesta-input-campeon"),
    btnNext: document.getElementById("btn-next-campeon"),
    btnIntento: document.getElementById("btn-intento-campeon"),
    btnRevivir: document.getElementById("revivir-campeon"),
    btnNoExiste: document.getElementById("no-existe-campeon"),
    btnRevelar: document.getElementById("btn-revelar-campeon"),
  },
  
  // Elementos de notificación
  notificacion: {
    toastMensaje: document.getElementById("mensaje-notificacion"),
  },
};

// Exportaciones individuales para compatibilidad con código existente
export const splash = domElements.secciones.splash;
export const main = domElements.secciones.main;
export const dificultad = domElements.secciones.dificultad;
export const generador = domElements.secciones.generador;
export const acerca = domElements.secciones.acerca;
export const campista = domElements.secciones.campista;
export const As = domElements.secciones.as;
export const campeon = domElements.secciones.campeon;
export const notificacion = domElements.secciones.notificacion;

export const confirmacionCampista = domElements.confirmaciones.campista;
export const confirmacionAs = domElements.confirmaciones.as;
export const confirmacionCampeon = domElements.confirmaciones.campeon;

export const cajaOpcionesPokemon = domElements.cajas.opcionesPokemon;
export const cajaSelect = domElements.cajas.select;
export const cajainput = domElements.cajas.input;

export const btnJuego = domElements.main.btnJuego;
export const btnGenerador = domElements.main.btnGenerador;
export const btnAcerca = domElements.main.btnAcerca;
export const telegram = domElements.main.telegram;

export const tipo1 = domElements.generador.tipo1;
export const tipo2 = domElements.generador.tipo2;
export const btnGenerar = domElements.generador.btnGenerar;

export const btnCampista = domElements.campista.btnCampista;
export const btnIniciarJuegoCampista = domElements.campista.btnIniciarJuego;
export const pScoreCampista = domElements.campista.pScore;
export const pMaxCampista = domElements.campista.pMax;
export const reinicioScoreCampista = domElements.campista.reinicioScore;
export const btnReinicioMaxCampista = domElements.campista.btnReinicioMax;
export const confirmarReinicioCampista = domElements.campista.confirmarReinicio;
export const cancelarReinicioCampista = domElements.campista.cancelarReinicio;
export const tipo1Campista = domElements.campista.tipo1;
export const tipo2Campista = domElements.campista.tipo2;
export const barraTiempoCampista = domElements.campista.barraTiempo;
export const mensajeAciertoCampista = domElements.campista.mensajeAcierto;
export const btnNextCampista = domElements.campista.btnNext;
export const btnIntentoCampista = domElements.campista.btnIntento;
export const btnRevivirCampista = domElements.campista.btnRevivir;

export const btnAs = domElements.as.btnAs;
export const btnIniciarJuegoAs = domElements.as.btnIniciarJuego;
export const pScoreAs = domElements.as.pScore;
export const pMaxAs = domElements.as.pMax;
export const reinicioScoreAs = domElements.as.reinicioScore;
export const btnReinicioMaxAs = domElements.as.btnReinicioMax;
export const confirmarReinicioAs = domElements.as.confirmarReinicio;
export const cancelarReinicioAs = domElements.as.cancelarReinicio;
export const tipo1As = domElements.as.tipo1;
export const tipo2As = domElements.as.tipo2;
export const barraTiempoAs = domElements.as.barraTiempo;
export const mensajeAciertoAs = domElements.as.mensajeAcierto;
export const selectAs = domElements.as.select;
export const btnNextAs = domElements.as.btnNext;
export const btnIntentoAs = domElements.as.btnIntento;
export const btnRevivirAs = domElements.as.btnRevivir;
export const btnValidarAs = domElements.as.btnValidar;
export const btnNoExisteAs = domElements.as.btnNoExiste;

export const btnCampeon = domElements.campeon.btnCampeon;
export const btnIniciarJuegoCampeon = domElements.campeon.btnIniciarJuego;
export const pScoreCampeon = domElements.campeon.pScore;
export const pMaxCampeon = domElements.campeon.pMax;
export const reinicioScoreCampeon = domElements.campeon.reinicioScore;
export const btnReinicioMaxCampeon = domElements.campeon.btnReinicioMax;
export const confirmarReinicioCampeon = domElements.campeon.confirmarReinicio;
export const cancelarReinicioCampeon = domElements.campeon.cancelarReinicio;
export const tipo1Campeon = domElements.campeon.tipo1;
export const tipo2Campeon = domElements.campeon.tipo2;
export const barraTiempoCampeon = domElements.campeon.barraTiempo;
export const mensajeAciertoCampeon = domElements.campeon.mensajeAcierto;
export const respuestaInputCampeon = domElements.campeon.respuestaInput;
export const btnNextCampeon = domElements.campeon.btnNext;
export const btnIntentoCampeon = domElements.campeon.btnIntento;
export const btnRevivirCampeon = domElements.campeon.btnRevivir;
export const btnNoExisteCampeon = domElements.campeon.btnNoExiste;
export const btnRevelarCampeon = domElements.campeon.btnRevelar;

export const toastMensaje = domElements.notificacion.toastMensaje;

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
