import { useState, useEffect } from "react";

const WIDTH = 250;
const ANIMATION_SPEED = 0.15;

export const useSidebarAnimation = (isOpen: boolean) => {
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    const target = isOpen ? 0 : -WIDTH;
    let frameId: number;

    function animatePosition() {
      const distance = target - margin;
      const movement = distance * ANIMATION_SPEED;

      if (Math.abs(distance) < 0.5) {
        setMargin(target);
        return;
      }

      setMargin(margin + movement);
      frameId = requestAnimationFrame(animatePosition);
    }

    frameId = requestAnimationFrame(animatePosition);

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, margin]);

  return margin;
};
