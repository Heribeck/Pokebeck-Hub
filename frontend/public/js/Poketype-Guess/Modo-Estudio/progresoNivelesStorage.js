// Guarda qué niveles de Estudio ya completó el jugador con éxito, para:
// 1) no volver a otorgar HX si repite un nivel ya superado
// 2) saber si una liga completa ya se graduó (para desbloquear Entrenamiento)
const PreferencesNativo = window.Capacitor?.Plugins?.Preferences;

const PreferencesLocalStorage = {
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
};

if (!PreferencesNativo) {
  console.warn('Preferences no disponible, usando localStorage como respaldo para progreso de niveles.');
}

const Preferences = PreferencesNativo || PreferencesLocalStorage;
const CLAVE_NIVELES_COMPLETADOS = 'pokebeck_niveles_completados';

// Devuelve la lista de IDs de niveles ya completados (array de strings)
export async function obtenerNivelesCompletados() {
  try {
    const resultado = await Preferences.get({ key: CLAVE_NIVELES_COMPLETADOS });
    if (!resultado || !resultado.value) return [];
    return JSON.parse(resultado.value);
  } catch (error) {
    console.error('Error leyendo niveles completados:', error);
    return [];
  }
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

  try {
    await Preferences.set({ key: CLAVE_NIVELES_COMPLETADOS, value: JSON.stringify(completados) });
  } catch (error) {
    console.error('Error guardando nivel completado:', error);
  }

  return completados;
}

// ¿Completó TODOS los niveles de una lista? (para saber si graduó una liga completa)
export async function haCompletadoTodos(listaDeNivelIds) {
  const completados = await obtenerNivelesCompletados();
  return listaDeNivelIds.every(id => completados.includes(id));
}