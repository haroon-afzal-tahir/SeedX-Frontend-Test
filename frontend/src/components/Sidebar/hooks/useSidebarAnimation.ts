import { useState, useEffect } from "react";

const WIDTH = 250;
const ANIMATION_SPEED = 0.2;

export const useSidebarAnimation = (isOpen: boolean) => {
  const [margin, setMargin] = useState(-WIDTH);

  useEffect(() => {
    const target = isOpen ? 0 : -WIDTH;
    let start: number | null = null;
    let frameId: number;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = (timestamp - start) * ANIMATION_SPEED;
      const distance = target - margin;
      const movement = Math.min(Math.abs(distance), progress);

      setMargin(margin + (distance > 0 ? movement : -movement));

      if (Math.abs(distance) > 0.5) {
        frameId = requestAnimationFrame(animate);
      } else {
        setMargin(target);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, margin]);

  return margin;
};
