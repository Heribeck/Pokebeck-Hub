import { Preferences } from '@capacitor/preferences';
import { ejecutarPluginSeguro } from '../utils.js';

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};
const CLAVE_NIVELES_COMPLETADOS = 'pokebeck_niveles_completados';

// Devuelve la lista de IDs de niveles ya completados (array de strings)
export async function obtenerNivelesCompletados() {
  return await ejecutarPluginSeguro(
    'Preferences',
    async () => {
      const resultado = await Preferences.get({ key: CLAVE_NIVELES_COMPLETADOS });
      if (!resultado || !resultado.value) return [];
      return JSON.parse(resultado.value);
    },
    async () => {
      const valor = localStorage.getItem(CLAVE_NIVELES_COMPLETADOS);
      if (!valor) return [];
      return JSON.parse(valor);
    }
  );
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

  await ejecutarPluginSeguro(
    'Preferences',
    async () => {
      await Preferences.set({ key: CLAVE_NIVELES_COMPLETADOS, value: JSON.stringify(completados) });
    },
    async () => {
      localStorage.setItem(CLAVE_NIVELES_COMPLETADOS, JSON.stringify(completados));
    }
  );

  return completados;
}

// ¿Completó TODOS los niveles de una lista? (para saber si graduó una liga completa)
export async function haCompletadoTodos(listaDeNivelIds) {
  const completados = await obtenerNivelesCompletados();
  return listaDeNivelIds.every(id => completados.includes(id));
}