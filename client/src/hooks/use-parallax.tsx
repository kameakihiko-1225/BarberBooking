import { useEffect, useRef } from "react";

export function useParallax(speed = 0.4) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const offset = window.scrollY * speed;
        ref.current.style.backgroundPositionY = `${offset}px`;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
} 