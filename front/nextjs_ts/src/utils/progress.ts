export const calculateProgress = (elapsedTime: number, totalDuration: number) => {
  const progressRatio = 1 - Math.exp(-elapsedTime / totalDuration);
  return progressRatio;
  };