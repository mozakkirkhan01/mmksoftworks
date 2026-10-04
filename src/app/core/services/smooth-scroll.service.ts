import { Injectable, inject, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private lenis: Lenis | null = null;
  private tickerCallback: ((time: number) => void) | null = null;
  private routerSub: Subscription | null = null;
  private motionQuery?: MediaQueryList;
  private desktopQuery?: MediaQueryList;
  private refreshFrame?: number;

  initSmoothScroll(): void {
    if (typeof window === 'undefined') return;
    this.destroy();
    gsap.registerPlugin(ScrollTrigger);
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.desktopQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    this.ngZone.runOutsideAngular(() => {
      this.motionQuery?.addEventListener('change', this.configureScroll);
      this.desktopQuery?.addEventListener('change', this.configureScroll);
      this.configureScroll();
      // Router owns restoration and fragments; avoid a competing scroll-to-top.
      this.routerSub = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => this.scheduleRefresh());
    });
  }

  private configureScroll = (): void => {
    this.stopLenis();
    if (!this.motionQuery?.matches && this.desktopQuery?.matches) {
      this.lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        autoRaf: false
      });
      this.lenis.on('scroll', ScrollTrigger.update);
      // GSAP uses requestAnimationFrame: one clock, no extra Lenis RAF loop.
      this.tickerCallback = (seconds: number) => this.lenis?.raf(seconds * 1000);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(this.tickerCallback);
    }
    this.scheduleRefresh();
  };

  private scheduleRefresh(): void {
    if (this.refreshFrame !== undefined) cancelAnimationFrame(this.refreshFrame);
    this.refreshFrame = requestAnimationFrame(() => {
      this.refreshFrame = undefined;
      this.lenis?.resize();
      ScrollTrigger.refresh();
    });
  }

  scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }): void {
    if (typeof window === 'undefined') return;
    const offset = options?.offset ?? (typeof target === 'string' && target.startsWith('#') ? -80 : 0);
    if (this.lenis && !this.motionQuery?.matches) {
      this.lenis.scrollTo(target, { ...options, offset });
      return;
    }
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element === null) return;
    const top = typeof element === 'number' ? element : element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top + offset), behavior: 'instant' });
  }

  getLenis(): Lenis | null {
    return this.lenis;
  }

  private stopLenis(): void {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
      gsap.ticker.lagSmoothing(500, 33);
    }
    this.lenis?.off('scroll', ScrollTrigger.update);
    this.lenis?.destroy();
    this.lenis = null;
  }

  destroy(): void {
    this.motionQuery?.removeEventListener('change', this.configureScroll);
    this.desktopQuery?.removeEventListener('change', this.configureScroll);
    this.motionQuery = undefined;
    this.desktopQuery = undefined;
    this.routerSub?.unsubscribe();
    this.routerSub = null;
    if (this.refreshFrame !== undefined) cancelAnimationFrame(this.refreshFrame);
    this.refreshFrame = undefined;
    this.stopLenis();
  }
}
