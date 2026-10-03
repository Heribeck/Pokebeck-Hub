import { getChallengeParams } from "../algorithms/challengeTier.js";

export function calculateChallengeSpeed(streak) {
  return getChallengeParams(streak).speed;
}
