import { Preferences } from '@capacitor/preferences';
import { STUDY_COMPLETED_LEVELS_KEY } from '../../../../../config/index.js';

// Devuelve la lista de IDs de niveles ya completados (array de strings)
export async function obtenerNivelesCompletados() {
  const resultado = await Preferences.get({ key: STUDY_COMPLETED_LEVELS_KEY });
  if (!resultado || !resultado.value) return [];
  return JSON.parse(resultado.value);

}

// ¿Ya completó este nivel específico antes?
export async function yaCompletoNivel(nivelId) {
  const completados = await obtenerNivelesCompletados();
  return completados.includes(nivelId);
}

// Marca un nivel como completado (no hace nada si ya estaba marcado)
export async function marcarNivelCompletado(nivelId) {
  const completados = await obtenerNivelesCompletados();
  if (completados.includes(nivelId)) return completados;

  completados.push(nivelId);

  await Preferences.set({ key: STUDY_COMPLETED_LEVELS_KEY, value: JSON.stringify(completados) });

  return completados;
}

// ¿Completó TODOS los niveles de una lista? (para saber si graduó una liga completa)
export async function haCompletadoTodos(listaDeNivelIds) {
  const completados = await obtenerNivelesCompletados();
  return listaDeNivelIds.every(id => completados.includes(id));
}