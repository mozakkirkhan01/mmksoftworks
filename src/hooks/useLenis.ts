// hooks/useLenis.ts
"use client";
import { useEffect } from 'react';
import Lenis from 'lenis';

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Controls the smoothness
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optional custom easing
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up the effect on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);
};

export default useLenis;
