import { Capacitor } from '@capacitor/core';

// Wrapper seguro para ejecutar funciones de plugins de Capacitor
export async function executePluginSafely(pluginName, pluginFunction, fallback) {
  try {
    if (!Capacitor.isPluginAvailable(pluginName)) {
      console.warn(`Plugin ${pluginName} no disponible, usando fallback`);
      if (fallback) {
        return await fallback();
      }
      return null;
    }
    
    return await pluginFunction();
  } catch (error) {
    console.error(`Error ejecutando plugin ${pluginName}:`, error);
    if (fallback) {
      console.warn(`Usando fallback para ${pluginName}`);
      return await fallback();
    }
    return null;
  }
}