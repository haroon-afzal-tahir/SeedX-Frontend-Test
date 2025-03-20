import { useState, useEffect } from "react";

const WIDTH = 280;
const ANIMATION_SPEED = 0.8;

export const useSidebarAnimation = (isOpen: boolean) => {
  const [margin, setMargin] = useState(-WIDTH);

  useEffect(() => {
    const target = isOpen ? 0 : -WIDTH;
    let start: number | null = null;
    let frameId: number;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = (timestamp - start) * ANIMATION_SPEED;

      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const easedProgress = easeOutExpo(Math.min(progress / WIDTH, 1));
      const newMargin = isOpen
        ? -WIDTH + WIDTH * easedProgress
        : -WIDTH * easedProgress;

      setMargin(newMargin);

      if (progress < WIDTH) {
        frameId = requestAnimationFrame(animate);
      } else {
        setMargin(target);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return margin;
};
