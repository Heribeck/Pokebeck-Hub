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
    poketype: document.getElementById("panel-poketype"),
    dificultad: document.getElementById("dificultad"),
    generador: document.getElementById("generador"),
    acerca: document.getElementById("acerca"),
    desafio: document.getElementById("panel-desafio"),
    reto: document.getElementById("panel-reto"),
    campista: document.getElementById("panel-campista"),
    notificacion: document.getElementById("notificacion"),
  },
  
  // SubSecciones de confirmación
  confirmaciones: {
    campista: document.getElementById("ventana-confirmacion-campista"),
  },
  
  // Cajas contenedoras
  cajas: {
    opcionesPokemon: document.getElementById("opciones-pokemon"),
  },
  
  // Elementos del menú principal
  main: {
    btnPoketype: document.getElementById("btn-poketype"),
    btnAcerca: document.getElementById("btn-acerca"),
    telegram: document.getElementById("telegram"),
  },

  // Elementos globales (cabecera)
  global: {
    hxGlobal: document.getElementById("hx-global"),
  },

  // Elementos del panel PokeType
  poketype: {
    btnReto: document.getElementById("btn-reto-poketype"),
    btnEntrenamiento: document.getElementById("btn-entrenamiento-poketype"),
    btnDesafio: document.getElementById("btn-desafio-poketype"),
    btnGenerador: document.getElementById("btn-generador-poketype"),
    btnVolverAlMenu: document.getElementById("btn-volver-menu-poketype"),
    rachaTexto: document.getElementById("racha-poketype"),
    hxGlobal: document.getElementById("hx-global-poketype"),
  },
  
  // Elementos del generador
  generador: {
    tipo1: document.getElementById("tipo1"),
    tipo2: document.getElementById("tipo2"),
    btnGenerar: document.getElementById("btn-generar"),
  },

  desafio: {
    rondaActualTexto: document.getElementById("ronda-actual-desafio"),
    intentosRestantesTexto: document.getElementById("intentos-restantes-desafio"),
    tipo1: document.getElementById("type1-icon-desafio"),
    tipo2: document.getElementById("type2-icon-desafio"),
    barraTiempo: document.getElementById("tiempo-desafio"),
    mensajeAcierto: document.getElementById("mensaje-acierto-desafio"),
    btnNext: document.getElementById("btn-next-desafio"),
    btnJugarDeNuevo: document.getElementById("btn-jugar-de-nuevo-desafio"),
    btnVolverAlMenu: document.getElementById("btn-menu-desafio"),
    btnIntento: document.getElementById("btn-intento-desafio"),
    btnRevivir: document.getElementById("revivir-desafio"),

    // Sub-UI Campista
    uiCampista: document.getElementById("desafio-ui-campista"),
    cajaOpcionesPokemon: document.getElementById("opciones-pokemon-desafio"),
  },

  // Elementos del modo Reto
  reto: {
    rondaActualTexto: document.getElementById("ronda-actual-reto"),
    hxGanadoTexto: document.getElementById("hx-ganado-reto"),
    tipo1: document.getElementById("tipo1-reto"),
    tipo2: document.getElementById("tipo2-reto"),
    barraTiempo: document.getElementById("tiempo-reto"),
    mensajeAcierto: document.getElementById("mensaje-acierto-reto"),
    btnNext: document.getElementById("btn-next-reto"),
    btnIntento: document.getElementById("btn-intento-reto"),
    btnIniciarJuego: document.getElementById("btn-iniciar-juego-reto"),
     btnJugarDeNuevo: document.getElementById("btn-jugar-de-nuevo-reto"),
    btnVolverAlMenu: document.getElementById("btn-volver-menu-reto"),

    // Sub-UI Campista
    uiCampista: document.getElementById("reto-ui-campista"),
    cajaOpcionesPokemon: document.getElementById("opciones-pokemon-reto"),
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
export const desafio = domElements.secciones.desafio;
export const panelReto = domElements.secciones.reto;
export const poketype = domElements.secciones.poketype;
export const campista = domElements.secciones.campista;
export const notificacion = domElements.secciones.notificacion;

export const confirmacionCampista = domElements.confirmaciones.campista;

export const cajaOpcionesPokemon = domElements.cajas.opcionesPokemon;

export const btnPoketype = domElements.main.btnPoketype;
export const btnAcerca = domElements.main.btnAcerca;
export const telegram = domElements.main.telegram;

export const hxGlobal = domElements.global.hxGlobal;

export const btnReto = domElements.poketype.btnReto;
export const btnEntrenamiento = domElements.poketype.btnEntrenamiento;
export const btnDesafio = domElements.poketype.btnDesafio;
export const btnGenerador = domElements.poketype.btnGenerador;
export const btnVolverMenuPoketype = domElements.poketype.btnVolverAlMenu;
export const rachaTextoPoketype = domElements.poketype.rachaTexto;
export const hxGlobalPoketype = domElements.poketype.hxGlobal;

export const tipo1 = domElements.generador.tipo1;
export const tipo2 = domElements.generador.tipo2;
export const btnGenerar = domElements.generador.btnGenerar;

//Elementos del Dom del Desafio
export const rondaActualTextoDesafio = domElements.desafio.rondaActualTexto;
export const intentosRestantesTextoDesafio = domElements.desafio.intentosRestantesTexto;
export const tipo1Desafio = domElements.desafio.tipo1;
export const tipo2Desafio = domElements.desafio.tipo2;
export const barraTiempoDesafio = domElements.desafio.barraTiempo;
export const mensajeAciertoDesafio = domElements.desafio.mensajeAcierto;
//export const btnDesafio = domElements.desafio.btnDesafio;
export const btnNextDesafio = domElements.desafio.btnNext;
export const btnIntentoDesafio = domElements.desafio.btnIntento;
export const btnRevivirDesafio = domElements.desafio.btnRevivir;
export const btnVolverAlMenu = domElements.desafio.btnVolverAlMenu;
export const btnJugarDeNuevoDesafio = domElements.desafio.btnJugarDeNuevo;

//Elementos del Dom del Reto
export const rondaActualTextoReto = domElements.reto.rondaActualTexto;
export const hxGanadoTextoReto = domElements.reto.hxGanadoTexto;
export const tipo1Reto = domElements.reto.tipo1;
export const tipo2Reto = domElements.reto.tipo2;
export const barraTiempoReto = domElements.reto.barraTiempo;
export const mensajeAciertoReto = domElements.reto.mensajeAcierto;
export const btnIniciarJuegoReto = domElements.reto.btnIniciarJuego;
export const btnNextReto = domElements.reto.btnNext;
export const btnIntentoReto = domElements.reto.btnIntento;
export const btnJugarDeNuevoReto = domElements.reto.btnJugarDeNuevo;
export const btnVolverAlMenuReto = domElements.reto.btnVolverAlMenu;
export const uiCampistaReto = domElements.reto.uiCampista;
export const cajaOpcionesPokemonReto = domElements.reto.cajaOpcionesPokemon;

export const uiCampistaDesafio = domElements.desafio.uiCampista;
export const cajaOpcionesPokemonDesafio = domElements.desafio.cajaOpcionesPokemon;

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

export const toastMensaje = domElements.notificacion.toastMensaje;

//Objeto con la configuración de cada modo.
export const configRevivir = {
  desafio: {
  btn: btnRevivirDesafio,
  btnIntento: btnIntentoDesafio,
  mensaje: mensajeAciertoDesafio,
  scoreKey: null,
  pScore: null,
  },
  campista: {
    btn: btnRevivirCampista,
    btnIntento: btnIntentoCampista,
    mensaje: mensajeAciertoCampista,
    scoreKey: "scoreCampista",
    pScore: pScoreCampista,
  },
};

//Elementos Especificos Generales
export const conteoBtnRevivir = 3;

//IDs de los anuncios / Eventos
export const idBanner = "ca-app-pub-1898586331132450/5546962412" || "Real";
export const idBonificado = "ca-app-pub-1898586331132450/8031266354" || "Real";
export const idIntersticial = "ca-app-pub-1898586331132450/4178291414" || "Real"
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
  type1ValueDesafio: "",
  type2ValueDesafio: "",
  tiempoDesafio: null,
  tiempoCampista: null,
  pokemonesValidos: []
};

//Variables Del Tiempo de los Modos y los contadores - Agrupadas en timeState
export const timeState = {
  tiempoDesafioLeft: 100,
  tiempoCampistaLeft: 100,
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
  scoreCampistaAntesDePerder: 0,
  estadoJuego: {
    scoreCampista: 0,
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
const musicaAsBatalla = new Audio("assets/sonidos/music/musicAs.mp3");
const musicaCampeon = new Audio("assets/sonidos/music/musicCampeon.mp3");

export const sonidoGanar = new Audio("assets/sonidos/efectoSound/win.mp3");
export const sonidoPerder = new Audio("assets/sonidos/efectoSound/lose.mp3");

export const sonidoTouch = new Audio("assets/sonidos/efectoSound/touchButtom.mp3");

musicaCampista.volume = 0.3;

sonidoGanar.volume = 0.7;
sonidoPerder.volume = 0.7;

musicaCampista.loop = true;

export const musicActual = {
  musicActualPlay: null
}
