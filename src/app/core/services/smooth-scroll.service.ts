import { Injectable, inject, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService {
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private lenis: Lenis | null = null;
  private tickerCallback: ((time: number) => void) | null = null;
  private routerSub: Subscription | null = null;

  initSmoothScroll(): void {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.destroy();

    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
      });

      // Synchronize Lenis scroll with GSAP ScrollTrigger
      this.lenis.on('scroll', ScrollTrigger.update);

      // Add to GSAP Ticker outside Angular zone
      this.tickerCallback = (time: number) => {
        this.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(this.tickerCallback);

      // Disable GSAP lag smoothing to avoid jumps during scrolling
      gsap.ticker.lagSmoothing(0);
    });

    // Reset scroll and refresh ScrollTrigger on navigation
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollTo(0, { immediate: true });
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      });
  }

  scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }): void {
    const defaultOffset = typeof target === 'string' && target.startsWith('#') ? -80 : 0;
    const finalOptions = {
      offset: defaultOffset,
      ...options
    };

    if (this.lenis) {
      this.lenis.scrollTo(target, finalOptions);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: finalOptions.immediate ? 'auto' : 'auto' });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  getLenis(): Lenis | null {
    return this.lenis;
  }

  destroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
      this.routerSub = null;
    }
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

