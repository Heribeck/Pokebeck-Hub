export function startTimerTraining(speed, setTimerValue, onTimeOut, correctPokemon) {
  let left = 100;

  const interval = setInterval(()=>{
    left -= speed;
    setTimerValue(left);

    if (left <= 0) {
      clearInterval(interval);
      onTimeOut?.(correctPokemon);
    }

  },100);

  return interval
}
