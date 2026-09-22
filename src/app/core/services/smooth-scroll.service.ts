import { Injectable, inject } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService {
  private lenis: Lenis | null = null;

  initSmoothScroll(): void {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  destroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}
