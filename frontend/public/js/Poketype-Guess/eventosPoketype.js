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
  campista
} from './config.js';

// Funciones importadas desde otros archivos
import { ocultarBanner } from '../admob.js';
import { iniciarDesafioDelDia } from './Desafio del Dia/desafio-dia.js';
import './Modo Estudio/ligas-ui.js';

// Variable de estado para diferenciar Estudio de Entrenamiento
let modoJuegoSeleccionado = 'entrenamiento'; 

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







