// Elementos del DOM importados desde config.js
import {
  main,
  poketype,
  ligas,
  generador,
  btnEstudio,
  btnEntrenamiento,
  btnDesafio,
  btnGenerador,
  btnVolverMenuPoketype,
  campista,
  btnRecuperarVidaPoketype,
  adState
} from './config.js';

// Funciones importadas desde otros archivos
import { mostrarBonificado, ocultarBanner } from '../admob.js';
import { iniciarDesafioDelDia } from './Desafio del Dia/desafio-dia.js';
import { iniciarContadorRegeneracion, obtenerVidasGenerales } from './vidasGeneralesStorage.js';
import './Modo-Estudio/ligas-ui.js';
import { actualizarIndicadorVidas } from './vidaUi.js';
import { mostrarNotificacion } from './utils.js';

// Iniciar contador de regeneración de vidas
iniciarContadorRegeneracion();

// Variable de estado para diferenciar Estudio de Entrenamiento
let modoJuegoSeleccionado = 'entrenamiento'; 

btnRecuperarVidaPoketype.addEventListener('click', async () => {
  const vidas = await obtenerVidasGenerales();
  if (vidas >= 3) {
    mostrarNotificacion('Ya tienes el máximo de vidas');
    return;
  }
  adState.modoRevivirActivo = 'vidas-generales';
  adState.recompensaGanada = false;
  await mostrarBonificado();
});

// Muestra el estado real de las vidas apenas carga el panel
actualizarIndicadorVidas();

// --- |Evento de boton de "Estudio(Ligas)" desde PokeType|
btnEstudio.addEventListener("click", () => {
  modoJuegoSeleccionado = 'estudio';
  poketype.style.display = "none";
  ligas.style.display = "flex";
  ocultarBanner();
});

// --- |Evento de boton de "Entrenamiento desde PokeType|
btnEntrenamiento.addEventListener("click", () => {
  modoJuegoSeleccionado = 'entrenamiento';
  poketype.style.display = "none";
  campista.style.display = "flex";
  ocultarBanner();
});

// --- |Evento del Apartado del Desafio Del Dia desde PokeType| -- //
btnDesafio.addEventListener('click', () => {
  iniciarDesafioDelDia()
  ocultarBanner();
});

// --- |Evento del Generador desde PokeType| -- //
btnGenerador.addEventListener("click", () => {
  poketype.style.display = "none";
  generador.style.display = "flex";
});

// --- |Evento de boton de "Volver al Menú" desde PokeType| -- //
btnVolverMenuPoketype.addEventListener("click", () => {
  poketype.style.display = "none";
  main.style.display = "flex";
});







