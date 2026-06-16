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
const confirmacionCampista = document.getElementById("ventana-confirmacion-campista");
const confirmacionAs = document.getElementById("ventana-confirmacion-As");
const confirmacionCampeon = document.getElementById("ventana-confirmacion-campeon");

// Cajas Especificas del DOM
const cajaOpcionesPokemon = document.getElementById("opciones-pokemon");
const cajaSelect = document.getElementById("caja-select");
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
const btnRevivirCampista = document.getElementById("revivir-campista");

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
const btnRevivirAs = document.getElementById("revivir-As");
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
const btnRevivirCampeon = document.getElementById("revivir-campeon");
const btnNoExisteCampeon = document.getElementById("no-existe-campeon");
const btnRevelarCampeon = document.getElementById("btn-revelar-campeon");

//Objeto con la configuración de cada modo.
const configRevivir = {
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
const toastMensaje = document.getElementById("mensaje-notificacion");
const conteoBtnRevivir = 7;

//IDs de los anuncios / Eventos
const idBanner = "ca-app-pub-3940256099942544/6300978111" || "Prueba";
const idBonificado = "ca-app-pub-3940256099942544/5224354917" || "Prueba";
const eventosBonificado = {
  cargado: "onRewardedVideoAdLoaded",
  falloCarga: "onRewardedVideoAdFailedToLoad",
  recompensa: "onRewardedVideoAdReward",
  cerrado: "onRewardedVideoAdDismissed",
};

//Variables sin valor Definido
let type1Value;
let type2Value;
let tiempoCampista;
let tiempoAsDeBatalla;
let tiempoCampeon;
let selectedPokemon;

//Variables De la Barra de Tiempo de los Modos
let tiempoCampistaLeft = 100;
let tiempoAsDeBatallaLeft = 100;
let tiempoCampeonLeft = 100;

//Variables de Internet y Cargas de los anuncios
let hayInternet = navigator.onLine;
let bannerPendiente = false;
let bannerVisible = false;
let bonificadoCargado = false;
let scoreCampistaAntesDePerder = 0;
let scoreAsAntesDePerder = 0;
let scoreCampeonAntesDePerder = 0;
let modoRevivirActivo = null;
let recompensaGanada = false;
let intervaloContadorRevivir = null;

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
InicializarAdMob().then(() => {
  if (hayInternet) {
    prepararBonificado();
  }
});
//Evento para el back de ventana o para volver al main

if(window.Capacitor){

  const App = window.Capacitor.Plugins.App;

  App.addListener("backButton", () => {
    if (main.style.display !== "none" && main.style.display !== ""){
      if(confirm("¿Seguro que quieres salir del juego?")){
        App.exitApp();
      }
      return;
    }

    main.style.display = "flex";
    acerca.style.display = "none";
    dificultad.style.display = "none";
    generador.style.display = "none";
    campista.style.display = "none";
    As.style.display = "none";
    campeon.style.display = "none";
  })
}
cargarPokedex();

//Funcion para inicializar AdMob
async function InicializarAdMob() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob) {
    try {
      await window.Capacitor.Plugins.AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: true
      });
      console.log("AdMob listo")
      await mostrarBanner("TOP_CENTER");
    } catch (error) {
      console.error("Error al inicializar AdMob:", error);
    }

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.cargado, () => {
      bonificadoCargado = true;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.falloCarga, () => {
      bonificadoCargado = false;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.recompensa, () => {
      recompensaGanada = true;
    });

    window.Capacitor.Plugins.AdMob.addListener(eventosBonificado.cerrado, async () => {
      if (recompensaGanada && modoRevivirActivo) {
        const config = configRevivir[modoRevivirActivo];
        ocultarBotonRevivir(modoRevivirActivo);
        config.btnIntento.style.display = "none";
        await cuentaRegresivaRevivir(config.mensaje);
        ejecutarRevivir(modoRevivirActivo);
        recompensaGanada = false;
      }
      prepararBonificado();
    });
  }
}

//Funcion para mostrar el banner
async function mostrarBanner(posicionBanner){
  if (!window.Capacitor?.Plugins?.AdMob)return;
  if (!hayInternet) return;

  const settingsAdMob = {
      adId: idBanner,
      adSize: "ADAPTIVE_BANNER",
      position: posicionBanner,
      margin: 0,
      isTesting: true
    };

  try {
      await window.Capacitor.Plugins.AdMob.showBanner(settingsAdMob);
      bannerVisible = true;
      bannerPendiente = false;
      console.log("Banner mostrado");

    } catch (error) {
      console.error("Error al mostrar banner:", error);
    }
}

//Funcion para hacer que el banner se oculte
async function ocultarBanner(){
  if (!window.Capacitor?.Plugins?.AdMob) return;
  
  try {
    await window.Capacitor.Plugins.AdMob.removeBanner();
    bannerVisible = false;
      
  } catch (error) {
    console.error("Error al ocultar banner:", error);
  }
}

//Prepara el bonificado
async function prepararBonificado() {
  if (!window.Capacitor?.Plugins?.AdMob || !hayInternet) {
    bonificadoCargado = false;
    return false;
  }

  try {
    bonificadoCargado = false;
    await window.Capacitor.Plugins.AdMob.prepareRewardVideoAd({
      adId: idBonificado,
      isTesting: true,
    });
    bonificadoCargado = true;
    console.log("Video bonificado cargado y listo");
    return true;
  } catch (error) {
    bonificadoCargado = false;
    console.error("Error al cargar el video:", error);
    return false;
  }
}

//Funcion para mostrar el anuncio Bonificado
async function mostrarBonificado() {
  if (!window.Capacitor?.Plugins?.AdMob) {
    mostrarNotificacion("Anuncios no disponibles en este dispositivo");
    return false;
  }

  if (!hayInternet || !navigator.onLine) {
    mostrarNotificacion("Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir.");
    return false;
  }

  if (!bonificadoCargado) {
    mostrarNotificacion("Cargando anuncio...");
    const cargado = await prepararBonificado();
    if (!cargado) {
      mostrarNotificacion("No se pudo cargar el anuncio. Revisa tu conexión e inténtalo de nuevo.");
      return false;
    }
  }

  try {
    await window.Capacitor.Plugins.AdMob.showRewardVideoAd();
    return true;
  } catch (error) {
    bonificadoCargado = false;
    mostrarNotificacion("Error al mostrar el anuncio");
    prepararBonificado();
    return false;
  }
}

//Funcion que almacena el score por si el jugador revive
function guardarScoreAntesDePerder(modo) {
  if (modo === "campista") scoreCampistaAntesDePerder = estadoJuego.scoreCampista;
  if (modo === "as") scoreAsAntesDePerder = estadoJuego.scoreAsDeBatalla;
  if (modo === "campeon") scoreCampeonAntesDePerder = estadoJuego.scoreCampeon;
}

//Funcion que limpia o reinicia o cancela el contador de 7 segundos del boton Revivir
function cancelarContadorRevivir() {
  if (intervaloContadorRevivir) {
    clearInterval(intervaloContadorRevivir);
    intervaloContadorRevivir = null;
  }
}

//Funcion que oculta el boton Revivir
function ocultarBotonRevivir(modo) {
  cancelarContadorRevivir();
  const config = configRevivir[modo];
  if (!config) return;
  config.btn.style.display = "none";
  config.btn.disabled = false;
}

//Funcion que muestra el boton Revivir e inicia el conteo de 7 segundos
function mostrarBotonRevivir(modo) {
  const config = configRevivir[modo];
  if (!config) return;

  cancelarContadorRevivir();
  modoRevivirActivo = modo;
  config.btn.style.display = "flex";
  config.btn.disabled = false;

  let segundos = conteoBtnRevivir;
  config.btn.innerHTML = `Revivir Viendo un Video (${segundos})<i class="fa-solid fa-film" style="margin-left: 10px;"></i>`;

  intervaloContadorRevivir = setInterval(() => {
    segundos--;
    if (segundos <= 0) {
      ocultarBotonRevivir(modo);
      return;
    }
    config.btn.innerHTML = `Revivir Viendo un Video (${segundos})<i class="fa-solid fa-film" style="margin-left: 10px;"></i>`;
  }, 1000);
}

//Contador de segundos despues del bonificado
async function cuentaRegresivaRevivir(elementoMensaje) {
  for (const numero of [3, 2, 1]) {
    elementoMensaje.innerHTML = `<span class="cuenta-revivir">${numero}</span>`;
    await esperar(1000);
  }
  elementoMensaje.innerHTML = "";
}

//Funcion que se ejecuta cuando el jugador ha revivido dependiendo de cada modo
function ejecutarRevivir(modo) {
  if (modo === "campista") {
    estadoJuego.scoreCampista = scoreCampistaAntesDePerder;
    pScoreCampista.textContent = estadoJuego.scoreCampista;
    btnRevivirCampista.style.display = "none";
    btnIntentoCampista.style.display = "none";
    mensajeAciertoCampista.innerHTML = "";
    cajaOpcionesPokemon.innerHTML = "";
    generarTipos(tipo1Campista, tipo2Campista);
    campistaLogica();
    mostrarNotificacion("¡Revivido! Sigue jugando");
    return;
  }

  if (modo === "as") {
    estadoJuego.scoreAsDeBatalla = scoreAsAntesDePerder;
    pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
    btnRevivirAs.style.display = "none";
    btnIntentoAs.style.display = "none";
    mensajeAciertoAs.innerHTML = "";
    datalistAs.innerHTML = "";
    inputSelectAs.value = "";
    inputSelectAs.disabled = false;
    cajaSelect.style.display = "block";
    btnValidarAs.style.display = "flex";
    btnNoExisteAs.style.display = "flex";
    generarTipos(tipo1As, tipo2As);
    AsLogica();
    mostrarNotificacion("¡Revivido! Sigue jugando");
    return;
  }

  if (modo === "campeon") {
    estadoJuego.scoreCampeon = scoreCampeonAntesDePerder;
    pScoreCampeon.textContent = estadoJuego.scoreCampeon;
    btnRevivirCampeon.style.display = "none";
    btnIntentoCampeon.style.display = "none";
    mensajeAciertoCampeon.innerHTML = "";
    respuestaInputCampeon.value = "";
    respuestaInputCampeon.disabled = false;
    cajainput.style.display = "block";
    btnRevelarCampeon.style.display = "flex";
    btnNoExisteCampeon.style.display = "flex";
    generarTipos(tipo1Campeon, tipo2Campeon);
    tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft, "campeon");
    mostrarNotificacion("¡Revivido! Sigue jugando");
  }
}

//Funcion para las reacciones al click del boton Revivir
async function clickRevivir(modo) {
  if (!hayInternet || !navigator.onLine) {
    mostrarNotificacion("Sin conexión a internet. Activa WiFi o datos móviles para ver el video y revivir.");
    return;
  }

  cancelarContadorRevivir();
  modoRevivirActivo = modo;
  recompensaGanada = false;

  const config = configRevivir[modo];
  config.btn.disabled = true;
  await mostrarBonificado();
  config.btn.disabled = false;
}

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
      "./assets/data/pokedex.json"
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
    type1Value = types[Aleatoriedad(0, types.length - 1)];
    type2Value = types[Aleatoriedad(0, types.length - 1)];
    
    tipo1Generic.src = typesIcono[type1Value];
    tipo2Generic.src = typesIcono[type2Value];
    
    tipo1Generic.style.backgroundColor = coloresTipos[type1Value];
    tipo2Generic.style.backgroundColor = coloresTipos[type2Value];
}

//Función para iniciar la barra de tiempo
function iniciarBarraTiempo(estado, modo, parrafo, boton, barra, mensaje, time, noExiste, validar, input, tiempo, left, modoRevivir = null) {
  barra.style.width = "100%";
  left = 100;
  clearInterval(tiempo);

  tiempo = setInterval(()=>{

    left -= time;

    barra.style.width = left + "%";

    if(left <= 0){
      clearInterval(tiempo);
      mensaje.innerHTML = "😢 ¡Se te acabo el Tiempo! 😢";

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

        const randomId = Math.floor(Math.random() * pokedex.length) + 1;

        const randomPokemon = pokedex[randomId - 1];

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
    tiempoCampista = iniciarBarraTiempo(estadoJuego, "scoreCampista", pScoreCampista, btnIntentoCampista, barraTiempoCampista, mensajeAciertoCampista, 3, null, null, null, tiempoCampista, tiempoCampistaLeft, "campista");

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
              guardarScoreAntesDePerder("campista");
              mostrarBotonRevivir("campista");
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
    tiempoAsDeBatalla = iniciarBarraTiempo(estadoJuego, "scoreAsDeBatalla", pScoreAs, btnIntentoAs, barraTiempoAs, mensajeAciertoAs, 0.7, btnNoExisteAs, btnValidarAs, cajaSelect, tiempoAsDeBatalla, tiempoAsDeBatallaLeft, "as");
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
        guardarScoreAntesDePerder("as");
        estadoJuego.scoreAsDeBatalla = 0;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
        datalistAs.innerHTML = "";
        btnIntentoAs.style.display = "flex";
        mostrarBotonRevivir("as");
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
        guardarScoreAntesDePerder("as");
        mensajeAciertoAs.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
        estadoJuego.scoreAsDeBatalla = 0;
        pScoreAs.textContent = estadoJuego.scoreAsDeBatalla;
        btnIntentoAs.style.display = "flex";
        mostrarBotonRevivir("as");
        clearInterval(tiempoAsDeBatalla);
        btnValidarAs.style.display = "none";
        btnNoExisteAs.style.display = "none";
        cajaSelect.style.display = "none";
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
        guardarScoreAntesDePerder("campeon");
        estadoJuego.scoreCampeon = 0;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
        btnIntentoCampeon.style.display = "flex";
        mostrarBotonRevivir("campeon");
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
        if (estadoJuego.scoreCampeon > maxCampeon) {
          maxCampeon = estadoJuego.scoreCampeon;
          localStorage.setItem("maxCampeon", maxCampeon);
          pMaxCampeon.textContent = maxCampeon;
        }

    }else if(existeAlguno){
        guardarScoreAntesDePerder("campeon");
        mensajeAciertoCampeon.innerHTML = "¡Te equivocas! <br/> si existe pokemon con esa combinación!";
        estadoJuego.scoreCampeon = 0;
        pScoreCampeon.textContent = estadoJuego.scoreCampeon;
        btnIntentoCampeon.style.display = "flex";
        mostrarBotonRevivir("campeon");
        clearInterval(tiempoCampeon);
        btnRevelarCampeon.style.display = "none";
        btnNoExisteCampeon.style.display = "none";
        cajainput.style.display = "none";
    }
}

// --- |Evento de boton de "Juego(Dificultades)"
btnJuego.addEventListener("click", () => {
  main.style.display = "none";
  dificultad.style.display = "flex";
  ocultarBanner();
});

// --- |Eventos del apartado "Panel-Campista"| --- //
btnCampista.addEventListener("click", () => {
  dificultad.style.display = "none";
  campista.style.display = "flex";
  pMaxCampista.textContent = maxCampista;
  mostrarBanner("TOP_CENTER");
});

//Evento del boton "Iniciar Juego"
btnIniciarJuegoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  btnIniciarJuegoCampista.style.display = "none";
  campistaLogica();
});

//Evento del boton "Siguiente"
btnNextCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnNextCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento del boton "Intentar de Nuevo"
btnIntentoCampista.addEventListener("click", () => {
  ocultarBotonRevivir("campista");
  generarTipos(tipo1Campista, tipo2Campista);
  campistaLogica();
  btnIntentoCampista.style.display = "none";
  mensajeAciertoCampista.innerHTML=""
});

//Evento para mostrar el video bonificado
btnRevivirCampista.addEventListener("click", () => {
  clickRevivir("campista");
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
  mostrarBanner("BOTTOM_CENTER");
});

//Evento del boton "Iniciar Juego" del modo As
btnIniciarJuegoAs.addEventListener("click", () => {
  ocultarBotonRevivir("as");
  btnIniciarJuegoAs.style.display = "none";
  cajaSelect.style.display = "block";
  btnValidarAs.style.display = "flex";
  btnNoExisteAs.style.display = "flex";
  generarTipos(tipo1As, tipo2As);
  AsLogica();
});

//Evento del Boton "Validar" Del modo As
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
  ocultarBotonRevivir("as");
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
  ocultarBotonRevivir("as");
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

//Evento para mostrar el video bonificado del modo As
btnRevivirAs.addEventListener("click", () => {
  clickRevivir("as");
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
  mostrarBanner("TOP_CENTER");
});

//Evento Para iniciar el juego en el modo Campeon
btnIniciarJuegoCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnIniciarJuegoCampeon.style.display = "none";
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft, "campeon");
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
  ocultarBotonRevivir("campeon");
  btnNextCampeon.style.display = "none";
  cajainput.style.display = "block";
  btnNoExisteCampeon.style.display = "flex";
  btnRevelarCampeon.style.display = "flex";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft, "campeon");
});

//Evento del boton "No Existe" en el modo de Campeon
btnNoExisteCampeon.addEventListener("click", () => {
  logicaNoExisteCampeon();
});

//Evento del Boton "Volver a intentarlo" en el modo Campeon
btnIntentoCampeon.addEventListener("click", () => {
  ocultarBotonRevivir("campeon");
  btnIntentoCampeon.style.display = "none";
  mensajeAciertoCampeon.innerHTML = "";
  respuestaInputCampeon.value = "";
  respuestaInputCampeon.disabled = false;
  btnRevelarCampeon.style.display = "flex";
  btnNoExisteCampeon.style.display = "flex";  
  cajainput.style.display = "block";
  generarTipos(tipo1Campeon, tipo2Campeon);
  tiempoCampeon = iniciarBarraTiempo(estadoJuego, "scoreCampeon", pScoreCampeon, btnIntentoCampeon, barraTiempoCampeon, mensajeAciertoCampeon, 0.6, btnNoExisteCampeon, btnRevelarCampeon, cajainput, tiempoCampeon, tiempoCampeonLeft, "campeon");
});

//Evento para mostrar el video bonificado del modo Campeon
btnRevivirCampeon.addEventListener("click", () => {
  clickRevivir("campeon");
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
});

//Evento del Boton "Generar"
btnGenerar.addEventListener("click", () => {
  iniciarGeneracion();
});

// --- |Eventos del Apartado de "Acerca del Proyecto"| --- //
btnAcerca.addEventListener("click", () => {
  main.style.display = "none";
  acerca.style.display = "flex";
});

//Evento del boton de "Telegram"
telegram.addEventListener("click", () => {
    if (window.Capacitor && window.Capacitor.isNative) {
        window.open('tg://resolve?domain=heribeck', '_system');
    } else {
        window.open('https://t.me/heribeck', '_blank');
    }
});

// --- |Eventos de para comprobar conexion a internet
window.addEventListener("online", () => {
  hayInternet = true;
  prepararBonificado();
  if (!bannerVisible) {
    bannerPendiente = true;
  }
});

//Evento Offline
window.addEventListener("offline", () => {
  hayInternet = false;
});