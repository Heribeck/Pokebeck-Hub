// Devuelve la fecha de ayer en formato "YYYY-MM-DD"
export function getYesterday() {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const año = ayer.getFullYear();
  const mes = String(ayer.getMonth() + 1).padStart(2, '0');
  const dia = String(ayer.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Devuelve la fecha de hoy en formato "YYYY-MM-DD", en la zona horaria local del dispositivo
export function getToday() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Devuelve la fecha y hora actual en formato "YYYY-MM-DD HH:mm"
export function getCurrentDateTime() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minuto = String(ahora.getMinutes()).padStart(2, '0');
  return `${año}-${mes}-${dia} ${hora}:${minuto}`;
}

// Devuelve la hora de reinicio (8pm) de hoy en formato "YYYY-MM-DD 20:00" -- (Inactiva)
function getNextResetTime() {
  const hoy = new Date();
  hoy.setHours(20, 0, 0, 0);
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia} 20:00`;
}

// Verifica si ya pasó la hora de reinicio (8pm) hoy
export function hasResetTimePassed() {
  const ahora = new Date();
  const hora8pm = new Date();
  hora8pm.setHours(20, 0, 0, 0);
  return ahora >= hora8pm;
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));