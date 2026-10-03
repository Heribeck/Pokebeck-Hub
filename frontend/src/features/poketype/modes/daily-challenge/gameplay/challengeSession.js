import { getChallengeParams } from "../algorithms/challengeTier.js";

export function createChallengeSession(streak) {
  return {
    params: getChallengeParams(streak),
    currentRound: 0,
    results: [],
  };
}

export function registerRoundResult(session, isCorrect) {
  const results = [...session.results, isCorrect ? 'correct' : 'wrong'];
  const currentRound = session.currentRound + 1;

  return {
    session: { ...session, results, currentRound },
    sessionFinished: currentRound >= session.params.totalRounds,
  };
}

export function calculateFinalResult(session) {
  const hits = session.results.filter(r => r === 'correct').length;
  const total = session.results.length;
  const percentage = total === 0 ? 0 : Math.round((hits / total) * 100);

  return {
    hits,
    misses: total - hits,
    totalRounds: total,
    percentage,
    passed: percentage >= session.params.passPercent,
  };
}
