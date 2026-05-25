import confetti from 'canvas-confetti';

/**
 * Returns a fire() function that triggers a confetti burst.
 */
export function useConfetti() {
  const fire = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7F77DD', '#1D9E75', '#EF9F27', '#D85A30', '#E8E8F0'],
    });
  };

  return { fire };
}
