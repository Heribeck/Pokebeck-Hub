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

const typesIcono = {
    "normal": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/normal.svg",
    "fire": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fire.svg",
    "water": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/water.svg",
    "electric": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/electric.svg",
    "grass": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/grass.svg",
    "ice": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ice.svg",
    "fighting": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fighting.svg",
    "poison": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/poison.svg",
    "ground": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ground.svg",
    "flying": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/flying.svg",
    "psychic": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/psychic.svg",
    "bug": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/bug.svg",
    "rock": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/rock.svg",
    "ghost": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ghost.svg",
    "dragon": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/dragon.svg",
    "dark": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/dark.svg",
    "steel": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/steel.svg",
    "fairy": "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fairy.svg"
}

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
    "dark": "#705746",
    "steel": "#B7B7CE",
    "fairy": "#D685AD"
};

const diccionarioPokemon = {
    // --- PARADOJAS DEL PASADO (ESCARLATA) ---
    "colmilargo": "great-tusk",
    "colacrito": "scream-tail",
    "furioseta": "brute-bonnet",
    "melena aleteo": "flutter-mane",
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

    // --- DIFERENCIAS DE GÉNERO (Redirigiendo al macho por defecto) ---
    "pyroar": "pyroar-male",
    "meowstic": "meowstic-male",
    "indeedee": "indeedee-male",
    "basculegion": "basculegion-male",
    "oinkologne": "oinkologne-male",
    
    // El clásico problema de Nidoran (la API usa -m y -f en vez de macho/hembra)
    "nidoran": "nidoran-m",
};

const type1 = document.getElementById("type1");
const type2 = document.getElementById("type2");
const type1Icon = document.getElementById("type1-icon");
const type2Icon = document.getElementById("type2-icon");
const btnRevelar = document.getElementById("btn-revelar");
const btnNoExiste = document.getElementById("btn-no-existe");
const btnNext = document.getElementById("btn-next");
const inputPokemon = document.getElementById("pokemon");
const rachaActualElement = document.getElementById("racha-actual");
const rachaMaximaElement = document.getElementById("racha-maxima");
const spritePokemon = document.getElementById("pokemon-sprite");
const divIconoTypes = document.getElementById("div-icono-types");
const h2Types = document.getElementById("h2-types");
const respuestaInput = document.getElementById("respuesta-input");
const setting = document.getElementById("btn-engranaje");
const menuDesplegable = document.getElementById("menu-desplegable");
const btnResetRacha = document.getElementById("btn-reset-racha");
const btnResetJuego = document.getElementById("btn-reset-juego");
const notificacion = document.getElementById("notificacion");
const toastMensaje = document.getElementById("mensaje");

let type1Value
let type2Value
let rachaActual = 0
let rachaMaxima = localStorage.getItem("rachaMaxima") || 0;


generarTipos();
rachaMaximaElement.textContent = rachaMaxima;

// Función para generar números aleatorios
function Aleatoriedad(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

// Función para generar tipos aleatorios
function generarTipos() {
    type1Value = types[Aleatoriedad(0, types.length - 1)];
    type2Value = types[Aleatoriedad(0, types.length - 1)];
    
    type1Icon.src = typesIcono[type1Value];
    type2Icon.src = typesIcono[type2Value];
    
    type1Icon.style.backgroundColor = coloresTipos[type1Value];
    type2Icon.style.backgroundColor = coloresTipos[type2Value];
}

// Función para validar la respuesta del usuario
async function validarRespuesta(respuestaLimpia) {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${respuestaLimpia}`);

        if (!respuesta.ok) {
            mostrarNotificacion("¡Ese Pokémon no existe o está mal escrito!", "error");
            return;
        }

        if (respuestaLimpia === "") {
            mostrarNotificacion("Por favor, ingresa un nombre de Pokémon", "error");
            return;
        }

        const datos = await respuesta.json();
        const tiposApi = datos.types.map(t => t.type.name);
        const esCorrecto = validarTipos(tiposApi, type1Value, type2Value);

        const urlSprite = datos.sprites.other["official-artwork"].front_default || datos.sprites.front_default;

        if (esCorrecto) {

            spritePokemon.src = urlSprite;
            spritePokemon.style.display = "flex";
            divIconoTypes.style.display = "none";
            h2Types.textContent = "Felicitaciones! 🎊";
            respuestaInput.style.display = "none";
            btnNoExiste.style.display = "none";
            btnRevelar.style.display = "none";
            btnNext.style.display = "flex";

            setTimeout(() => {
                mostrarNotificacion("¡CORRECTO! Sumas a tu racha.");
                rachaActual++;
                if (rachaActual > rachaMaxima) {
                    rachaMaxima = rachaActual;
                    localStorage.setItem("rachaMaxima", rachaMaxima);
                }
                rachaActualElement.textContent = rachaActual;
                rachaMaximaElement.textContent = rachaMaxima;
            }, 100);

            generarTipos()
        } else {
            mostrarNotificacion("¡Incorrecto! Ese Pokémon no tiene esa combinación de tipos.");
            rachaActual = 0;
            rachaActualElement.textContent = rachaActual;
        }
        
    }
    catch (error) {
        console.error("Error conectando con la API:", error);
        mostrarNotificacion("El Pokémon no existe o está mal escrito");
    }
}

// Función auxiliar para comparar los tipos sin importar el orden
function validarTipos(tiposApi, type1Value, type2Value) {
    if (type1Value === type2Value) {
        return tiposApi.length === 1 && tiposApi[0] === type1Value;
    }
    
    if (tiposApi.length !== 2) return false;
    return tiposApi.includes(type1Value) && tiposApi.includes(type2Value);
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {

    toastMensaje.textContent = mensaje;
    
    notificacion.classList.add("mostrar");

    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 2000);
}


setting.addEventListener("click", () => {
    menuDesplegable.classList.toggle("mostrar");
    setting.style.transform = menuDesplegable.classList.contains("mostrar") ? "rotate(90deg)" : "rotate(0deg)";
});

// Evento para el botón de revelar
btnRevelar.addEventListener("click", () => {
    const respuesta = inputPokemon.value;
    const respuestaLimpia = respuesta.toLowerCase().trim();
    const respuestaFormateada = respuestaLimpia.replace(/ /g, "-");
    const respuestaApi = diccionarioPokemon[respuestaFormateada] || respuestaFormateada;

    validarRespuesta(respuestaApi);
    inputPokemon.value = "";

});

// Evento para el botón de "No existe"
btnNoExiste.addEventListener("click", () => {
  
    const combinacion1 = `${type1Value},${type2Value}`;
    const combinacion2 = `${type2Value},${type1Value}`;

    const esTrampa = blacklist[combinacion1] || blacklist[combinacion2];

    if (esTrampa) {
        mostrarNotificacion("¡Bien visto! 🕵️‍♂️ Esa combinación NO existe. ¡Punto para ti!");
        rachaActual++;
        if (rachaActual > rachaMaxima) {
            rachaMaxima = rachaActual;
            localStorage.setItem("rachaMaxima", rachaMaxima);
        }
        rachaActualElement.textContent = rachaActual;
        rachaMaximaElement.textContent = rachaMaxima;
        
        generarTipos(); 

    } else {
        mostrarNotificacion("¡Te equivocaste! ❌ Esa combinación SÍ existe en el juego.");
        
        rachaActual = 0;
        rachaActualElement.textContent = rachaActual;
    }
});

btnNext.addEventListener("click", () => {
    spritePokemon.style.display = "none";
    divIconoTypes.style.display = "flex";
    respuestaInput.style.display = "block";
    btnNoExiste.style.display = "flex";
    btnRevelar.style.display = "flex";
    btnNext.style.display = "none";
    h2Types.textContent = "Tipos Del Pokemon";
    generarTipos();
});

btnResetRacha.addEventListener("click", () => {
    localStorage.removeItem("rachaMaxima");

    rachaMaxima = 0;
    rachaActual = 0;
    
    rachaMaximaElement.textContent = rachaMaxima;
    rachaActualElement.textContent = rachaActual;

    menuDesplegable.classList.remove("mostrar");
    
    mostrarNotificacion("¡Récord borrado con éxito! Empiezas desde cero.");
});

btnResetJuego.addEventListener("click", () => {

    rachaActual = 0;
    
    rachaMaximaElement.textContent = rachaMaxima;
    rachaActualElement.textContent = rachaActual;
    
    menuDesplegable.classList.remove("mostrar");
    generarTipos();
});



