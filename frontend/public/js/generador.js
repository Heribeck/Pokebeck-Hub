// Variables importadas desde config.js
import { types, typesIcono, coloresTipos, gameState, esperar, btnGenerar, tipo1, tipo2, main } from './config.js';
import { Aleatoriedad, detenerTodoElAudio, soundLose } from './utils.js';
import { guardarScoreAntesDePerder, mostrarBotonRevivir } from './modos.js';

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
      mensaje.innerHTML = "😢 ¡Se te acabo el Tiempo! 😢 </br> Una opción correcta era: " + "<strong>" + pokemonCorrect.charAt(0).toUpperCase() + pokemonCorrect.slice(1) + "</strong>";
      detenerTodoElAudio(); 

      if (main.style.display !== "none" && main.style.display !== "") {
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

      const buttons = document.querySelectorAll(".btn-opcion");

      buttons.forEach(btn => {
        btn.style.display = "none";
      });

      console.log("Tiempo acabado");
    }

  },100);
  return tiempo;
}
