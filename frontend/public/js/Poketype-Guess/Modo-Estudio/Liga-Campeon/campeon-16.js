import { filtrarPokedexPorGeneracionEstudio } from "../filtroGeneracionEstudio.js";

const TOTAL_RONDAS = 20;

export function generarColaRondasCampeon16(param1, param2) {
  // 1. Detección inteligente de parámetros
  let pokedex = Array.isArray(param1) ? param1 : (typeof pokedexDatos !== 'undefined' ? pokedexDatos : null);
  let generador = typeof param1 === 'function' ? param1 : (typeof param2 === 'function' ? param2 : Math.random);

  if (!pokedex || !Array.isArray(pokedex)) {
    console.error("Error en Campeón 13: No se recibió un array de pokedex válido.");
    return [];
  }

  // 2. Filtramos la Pokédex base (Gen 1-9)
  const poolFiltrado = filtrarPokedexPorGeneracionEstudio(pokedex, 'todas', "absoluto");

  // 3. Escaneamos las combinaciones válidas
  const mapaCombinaciones = new Map();

  poolFiltrado.forEach(p => {
    // Lee tipo 1 y tipo 2 ya sea de p.type1/p.type2 o de un array p.types
    const t1 = p.type1 || (p.types && p.types[0]);
    const t2 = p.type2 || (p.types && p.types[1]);

    if (t1 && t2) {
      const tipos = [String(t1).toLowerCase(), String(t2).toLowerCase()].sort();
      const clave = `${tipos[0]}-${tipos[1]}`;

      if (!mapaCombinaciones.has(clave)) {
        mapaCombinaciones.set(clave, { type1: tipos[0], type2: tipos[1] });
      }
    }
  });

  const combinacionesValidas = Array.from(mapaCombinaciones.values());

  if (combinacionesValidas.length === 0) {
    console.warn("Advertencia: No se encontraron combinaciones válidas en el pool.");
    return [];
  }

  // 4. Generamos las rondas
  const cola = [];
  for (let i = 0; i < TOTAL_RONDAS; i++) {
    const indice = Math.floor(generador() * combinacionesValidas.length);
    cola.push({ ...combinacionesValidas[indice] });
  }

  return cola;
}   