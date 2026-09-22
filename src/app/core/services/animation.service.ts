import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  constructor() {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  createContext(scope: ElementRef | HTMLElement | undefined, callback: (ctx: gsap.Context) => void): gsap.Context {
    const scopeElement = scope instanceof ElementRef ? scope.nativeElement : scope;
    return gsap.context(callback, scopeElement);
  }

  refreshScrollTriggers(): void {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}
