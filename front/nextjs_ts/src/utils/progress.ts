export const calculateProgress = (elapsedTime: number, totalDuration: number) => {
    const k = 5 / totalDuration; // Adjust k based on totalDuration (higher totalDuration = slower progress)
    return 1 - Math.exp(-k * elapsedTime);
  };