import { Injectable, ElementRef, inject, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private ngZone = inject(NgZone);
  constructor() {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  createContext(scope: ElementRef | HTMLElement | undefined, callback: (ctx: gsap.Context) => void, respectMotion = true): gsap.Context {
    const scopeElement = scope instanceof ElementRef ? scope.nativeElement : scope;
    return this.ngZone.runOutsideAngular(() => gsap.context(ctx => {
      if (!respectMotion) {
        callback(ctx);
        return;
      }
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', callback, scopeElement);
      return () => media.revert();
    }, scopeElement));
  }

  refreshScrollTriggers(): void {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}
