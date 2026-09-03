// Sistema de Victoria Definitiva para PokeType
// Se ejecuta una sola vez cuando el usuario completa campeon-18

const CLAVE_LIGA_COMPLETADA = "pokeTypeLeagueCompleted";
const DURACION_CONFETI = 4000;
const COLORES_CONFETI = [
    "#E3350D", // Rojo PokeType
    "#FFD700", // Dorado
    "#3B82F6", // Azul
    "#FFFFFF", // Blanco
    "#FF6B6B", // Rosa claro
    "#4ECDC4", // Turquesa
    "#F7DC6F", // Ámbar
];

let victoriaEnCurso = false;
let intervaloLluvia = null;

/**
 * Verifica si la liga ya fue completada anteriormente
 */
function estaLigaCompletada() {
    return localStorage.getItem(CLAVE_LIGA_COMPLETADA) === "true";
}

/**
 * Guarda la victoria definitiva en localStorage
 */
function guardarVictoriaDefinitiva() {
    localStorage.setItem(CLAVE_LIGA_COMPLETADA, "true");
}

/**
 * Función principal que ejecuta toda la secuencia de victoria
 */
function ejecutarVictoriaDefinitiva() {
    if (victoriaEnCurso) return;
    if (estaLigaCompletada()) return;
    
    victoriaEnCurso = true;
    guardarVictoriaDefinitiva();
    actualizarMaestroEnMain();
    lanzarConfeti();
    
    setTimeout(() => {
        mostrarModalVictoria();
        victoriaEnCurso = false;
    }, 4500);
}

/**
 * Actualiza el Main para mostrar el título de Maestro
 */
async function actualizarMaestroEnMain() {
    const elementoMaestro = document.querySelector("[data-maestro-poketype]");
    
    if (!elementoMaestro) return;
    
    elementoMaestro.style.display = "flex";
    elementoMaestro.classList.add("maestro-poketype--aparecer");
}

/**
 * Inicia la secuencia de confeti
 */
function lanzarConfeti() {
    const contenedor = document.getElementById("contenedor-confeti");
    if (!contenedor) return;
    
    contenedor.innerHTML = "";
    
    // Fase 1: Ráfaga inicial
    for (let i = 0; i < 50; i++) {
        setTimeout(() => crearParticulaExplosion(contenedor), i * 20);
    }
    
    // Fase 2: Lluvia continua
    iniciarLluviaConfeti(contenedor);
    
    // Detener lluvia después de DURACION_CONFETI
    setTimeout(() => {
        detenerLluviaConfeti();
        limpiarConfeti(contenedor);
    }, DURACION_CONFETI);
}

/**
 * Crea una partícula de confeti con propiedades aleatorias
 */
function crearParticulaConfeti(contenedor, tipo = "lluvia") {
    const particula = document.createElement("div");
    particula.className = "confeti";
    
    const color = COLORES_CONFETI[Math.floor(Math.random() * COLORES_CONFETI.length)];
    const tamano = 5 + Math.random() * 15;
    const duracion = 2 + Math.random() * 3;
    const retraso = Math.random() * 0.5;
    const rotacion = Math.random() * 360;
    
    particula.style.setProperty("--color", color);
    particula.style.setProperty("--tamano", `${tamano}px`);
    particula.style.setProperty("--duracion", `${duracion}s`);
    particula.style.setProperty("--retraso", `${retraso}s`);
    particula.style.setProperty("--rotacion", `${rotacion}deg`);
    
    if (tipo === "lluvia") {
        particula.style.setProperty("--x", `${Math.random() * 100}vw`);
        particula.style.setProperty("--y", "-20px");
    } else {
        particula.style.setProperty("--x", "50vw");
        particula.style.setProperty("--y", "50vh");
        particula.classList.add("confeti--explosion");
    }
    
    contenedor.appendChild(particula);
    
    particula.addEventListener("animationend", () => {
        particula.remove();
    });
}

/**
 * Crea partículas de explosión desde el centro
 */
function crearParticulaExplosion(contenedor) {
    const particula = document.createElement("div");
    particula.className = "confeti confeti--explosion";
    
    const color = COLORES_CONFETI[Math.floor(Math.random() * COLORES_CONFETI.length)];
    const tamano = 8 + Math.random() * 12;
    const angulo = Math.random() * 360;
    const distancia = 30 + Math.random() * 50;
    const duracion = 0.8 + Math.random() * 0.4;
    
    // Calcular trayectoria en JavaScript para compatibilidad WebView
    const anguloRad = angulo * (Math.PI / 180);
    const destinoX = Math.cos(anguloRad) * distancia;
    const destinoY = Math.sin(anguloRad) * distancia;
    
    particula.style.setProperty("--color", color);
    particula.style.setProperty("--tamano", `${tamano}px`);
    particula.style.setProperty("--duracion", `${duracion}s`);
    particula.style.setProperty("--destino-x", `${destinoX}vh`);
    particula.style.setProperty("--destino-y", `${destinoY}vh`);
    
    contenedor.appendChild(particula);
    
    particula.addEventListener("animationend", () => {
        particula.remove();
    });
}

/**
 * Inicia la lluvia continua de confeti
 */
function iniciarLluviaConfeti(contenedor) {
    if (intervaloLluvia) return;
    
    intervaloLluvia = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            crearParticulaConfeti(contenedor, "lluvia");
        }
    }, 100);
}

/**
 * Detiene la lluvia de confeti
 */
function detenerLluviaConfeti() {
    if (intervaloLluvia) {
        clearInterval(intervaloLluvia);
        intervaloLluvia = null;
    }
}

/**
 * Limpia todas las partículas de confeti
 */
function limpiarConfeti(contenedor) {
    setTimeout(() => {
        contenedor.innerHTML = "";
    }, 1000);
}

/**
 * Muestra el modal de victoria
 */
function mostrarModalVictoria() {
    const modal = document.getElementById("modal-victoria");
    if (!modal) return;
    
    modal.style.display = "flex";
    document.body.classList.add("modal-victoria-abierto");
    
    // Vibración de celebración
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 300]);
    }
}

/**
 * Oculta el modal de victoria
 */
function ocultarModalVictoria() {
    const modal = document.getElementById("modal-victoria");
    if (!modal) return;
    
    modal.style.display = "none";
    document.body.classList.remove("modal-victoria-abierto");
}

/**
 * Comparte el logro usando Web Share API con fallback
 */
async function compartirLogro() {
    const mensaje = "🏆 ¡He alcanzado la MAESTRÍA ABSOLUTA en PokeType!\n\nHe completado la Liga y me he convertido en Maestro de PokeType.\n\n¿Puedes superar el desafío?";
    const url = window.location.href;
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: "¡Maestría Absoluta en PokeType!",
                text: mensaje,
                url: url
            });
        } else {
            throw new Error("Web Share no disponible");
        }
    } catch (error) {
        // Usuario canceló o Web Share no disponible
        if (error.name !== "AbortError") {
            copiarLogro(mensaje);
        }
    }
}

/**
 * Copia el logro al portapapeles
 */
async function copiarLogro(mensaje) {
    try {
        await navigator.clipboard.writeText(mensaje);
        mostrarNotificacion("¡Logro copiado!");
    } catch (error) {
        mostrarNotificacion("Puedes copiar tu logro para compartirlo.");
    }
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(texto) {
    const notificacion = document.createElement("div");
    notificacion.className = "notificacion-victoria";
    notificacion.textContent = texto;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add("notificacion-victoria--visible");
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove("notificacion-victoria--visible");
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

/**
 * Verifica y aplica el título de Maestro al cargar la aplicación
 */
export async function verificarVictoriaAlIniciar() {
    if (estaLigaCompletada()) {
       await actualizarMaestroEnMain();
    }
}

/**
 * Verifica y aplica el título de Maestro cuando se vuelve al Main
 */
function verificarVictoriaAlVolverAlMain() {
    if (estaLigaCompletada()) {
        actualizarMaestroEnMain();
    }
}

// Exportar funciones para uso externo
window.victoriaPokeType = {
    ejecutarVictoriaDefinitiva,
    estaLigaCompletada,
    verificarVictoriaAlIniciar,
    verificarVictoriaAlVolverAlMain,
    compartirLogro,
    ocultarModalVictoria
};
