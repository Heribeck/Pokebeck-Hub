import { dataState } from "../state/state.js";

export async function cargarPokedex(){
  const response = await fetch("./assets/data/pokedex.json");
  dataState.pokedex = await response.json();
  if (dataState.pokedex){
    console.log('Pokedex cargada correctamente con', dataState.pokedex.length, 'entradas');
  }
}