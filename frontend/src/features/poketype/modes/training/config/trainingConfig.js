export const BASE_SPEED = {
  facil: 0.5,
  normal: 1.5,
  dificil: 3,
};

export const ALLOWS_PROGRESSION = {
  facil: false,
  normal: false,
  dificil: true,
};

const ALLOWS_REPEAT = {
  facil: true,
  normal: false,
  dificil: false,
};

export function allowRepeat(modo) {
  return ALLOWS_REPEAT[modo] ?? false;
}