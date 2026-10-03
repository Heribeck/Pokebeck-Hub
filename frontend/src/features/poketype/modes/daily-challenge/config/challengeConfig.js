export const CHALLENGE_TIERS = [
  { minStreak: 0, speed: 1, totalRounds: 10, passPercent: 50 },
  { minStreak: 5, speed: 1.5, totalRounds: 11, passPercent: 55 },
  { minStreak: 10, speed: 2, totalRounds: 12, passPercent: 60 },
  { minStreak: 20, speed: 2.2, totalRounds: 14, passPercent: 65 },
  { minStreak: 30, speed: 2.5, totalRounds: 16, passPercent: 70 },
  { minStreak: 50, speed: 3, totalRounds: 20, passPercent: 90 },
];

export const MAX_DAILY_ATTEMPTS = 3;
export const MAX_WRONG_OPTIONS_TRIES = 200;
export const WRONG_OPTIONS_COUNT = 3;
export const MAX_TYPE_GENERATION_TRIES = 2;
