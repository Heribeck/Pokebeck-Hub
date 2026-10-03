import { CHALLENGE_TIERS } from "../config/challengeConfig.js";

export function getChallengeParams(streak) {
  const sorted = [...CHALLENGE_TIERS].sort((a, b) => a.minStreak - b.minStreak);
  let current = sorted[0];

  for (const tier of sorted) {
    if (streak >= tier.minStreak) current = tier;
  }

  return { speed: current.speed, totalRounds: current.totalRounds, passPercent: current.passPercent };
}
