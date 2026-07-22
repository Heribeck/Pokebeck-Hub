// Módulo encargado de guardar y leer el progreso persistente del jugador:
// racha de Desafíos del Día completados, mejor racha histórica, e intentos usados hoy.
//
// Nota: sin bundler, los plugins de Capacitor se acceden vía window.Capacitor.Plugins
// (mismo patrón que ya usas para "App" en main.js), no con un import de npm.
//
// Respaldo automático: si el plugin nativo no está disponible (por ejemplo, probando
// en el navegador normal en vez de un emulador/dispositivo), se usa localStorage
// con la misma forma de API, para poder seguir probando sin instalar el emulador.
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
  console.warn(
    'El plugin nativo Preferences no está disponible (probablemente estás en el navegador, ' +
    'no en un emulador/dispositivo). Usando localStorage como respaldo temporal para pruebas.'
  );
}

const Preferences = PreferencesNativo || PreferencesLocalStorage;

const CLAVE_PROGRESO = 'pokebeck_progreso';

// Estructura por defecto si el jugador nunca ha guardado progreso todavía
function progresoPorDefecto() {
  return {
    racha: 0,
    mejorRacha: 0,
    ultimoDiaDesafioCompletado: null, // formato "YYYY-MM-DD"
    fechaIntentosHoy: null,           // formato "YYYY-MM-DD", para saber si resetear el contador
    intentosUsadosHoy: 0,
  };
}

// Devuelve la fecha de hoy en formato "YYYY-MM-DD", en la zona horaria local del dispositivo
function obtenerFechaDeHoy() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Devuelve la fecha de ayer en formato "YYYY-MM-DD"
function obtenerFechaDeAyer() {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const año = ayer.getFullYear();
  const mes = String(ayer.getMonth() + 1).padStart(2, '0');
  const dia = String(ayer.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Lee el progreso guardado. Si no existe nada todavía, devuelve la estructura por defecto.
export async function obtenerProgreso() {
  try {
    const resultado = await Preferences.get({ key: CLAVE_PROGRESO });
    if (!resultado || !resultado.value) {
      return progresoPorDefecto();
    }
    return JSON.parse(resultado.value);
  } catch (error) {
    console.error('Error leyendo el progreso guardado:', error);
    return progresoPorDefecto();
  }
}

// Guarda el objeto de progreso completo
async function guardarProgreso(progreso) {
  try {
    await Preferences.set({ key: CLAVE_PROGRESO, value: JSON.stringify(progreso) });
  } catch (error) {
    console.error('Error guardando el progreso:', error);
  }
}

// Cuántos intentos del Desafío del Día lleva usados HOY (máximo 2).
// Si cambió el día desde la última vez, resetea el contador automáticamente.
export async function obtenerIntentosDisponiblesHoy() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();

  if (progreso.fechaIntentosHoy !== hoy) {
    // Es un día distinto al último registrado, el contador se reinicia solo
    return 2;
  }

  return 2 - progreso.intentosUsadosHoy;
}

// Registra que el jugador usó un intento del Desafío del Día hoy (haya pasado o no).
// Devuelve cuántos intentos le quedan después de este.
export async function consumirIntentoDeHoy() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();

  if (progreso.fechaIntentosHoy !== hoy) {
    // Primer intento de un día nuevo, reinicia el contador antes de sumar
    progreso.fechaIntentosHoy = hoy;
    progreso.intentosUsadosHoy = 0;
  }

  progreso.intentosUsadosHoy += 1;
  await guardarProgreso(progreso);

  return 2 - progreso.intentosUsadosHoy;
}

// Se llama cuando el jugador APRUEBA el Desafío del Día (≥70% de aciertos).
// Suma la racha correctamente sea cual sea el último día que jugó.
export async function registrarDesafioAprobado() {
  const progreso = await obtenerProgreso();
  const hoy = obtenerFechaDeHoy();
  const ayer = obtenerFechaDeAyer();

  if (progreso.ultimoDiaDesafioCompletado === hoy) {
    // Ya lo había aprobado hoy (no debería pasar si se oculta tras aprobar, pero por seguridad no duplica)
    return progreso;
  }

  if (progreso.ultimoDiaDesafioCompletado === ayer) {
    progreso.racha += 1; // jugó ayer y hoy, la racha continúa
  } else {
    progreso.racha = 1; // no jugó ayer (o es la primera vez), la racha arranca de nuevo
  }

  progreso.mejorRacha = Math.max(progreso.mejorRacha, progreso.racha);
  progreso.ultimoDiaDesafioCompletado = hoy;

  await guardarProgreso(progreso);
  return progreso;
}

// Se llama cuando el jugador AGOTA sus 2 intentos del día sin aprobar el 70%.
// La racha se reinicia a 0 inmediatamente (no espera a que pase el día).
export async function registrarDesafioFallido() {
  const progreso = await obtenerProgreso();
  progreso.racha = 0;
  await guardarProgreso(progreso);
  return progreso;
}

// Determina qué mecánica de juego corresponde al Desafío del Día,
// según la racha ACTUAL del jugador.
export function obtenerMecanicaSegunRacha(racha) {
  if (racha >= 30) return 'campeon';
  if (racha >= 10) return 'as';
  return 'campista';
}

// Indica si el jugador YA aprobó el Desafío del Día de hoy
// (para decidir si se le sigue mostrando el modo o no)
export async function yaCompletoDesafioHoy() {
  const progreso = await obtenerProgreso();
  return progreso.ultimoDiaDesafioCompletado === obtenerFechaDeHoy();
}