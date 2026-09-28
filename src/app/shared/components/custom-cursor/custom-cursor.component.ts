import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #cursorDot class="cursor-dot"></div>
    <div #cursorRing class="cursor-ring"></div>
  `,
  styles: [`
    :host {
      pointer-events: none;
      z-index: 9999;
      position: fixed;
      top: 0;
      left: 0;
      display: block;

      @media (hover: none) and (pointer: coarse) {
        display: none;
      }
    }

    .cursor-dot {
      width: 8px;
      height: 8px;
      background-color: var(--mmk-cyan);
      border-radius: 50%;
      position: fixed;
      top: -4px;
      left: -4px;
      pointer-events: none;
      box-shadow: 0 0 10px var(--mmk-cyan);
      will-change: transform;
      transform: translate3d(-100px, -100px, 0);
    }

    .cursor-ring {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(25, 211, 255, 0.4);
      border-radius: 50%;
      position: fixed;
      top: -18px;
      left: -18px;
      pointer-events: none;
      transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      will-change: transform;
      transform: translate3d(-100px, -100px, 0);

      &.hovered {
        width: 52px;
        height: 52px;
        top: -26px;
        left: -26px;
        background: rgba(25, 211, 255, 0.08);
        border-color: var(--mmk-cyan);
      }
    }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  @ViewChild('cursorDot', { static: true }) cursorDotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorRing', { static: true }) cursorRingRef!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private rafId?: number;
  private mouseX = -100;
  private mouseY = -100;
  private ringX = -100;
  private ringY = -100;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveHandler = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        const target = e.target as HTMLElement | null;
        const isInteractive = !!target && (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') !== null ||
          target.closest('button') !== null ||
          target.classList.contains('interactive')
        );

        if (this.cursorRingRef?.nativeElement) {
          this.cursorRingRef.nativeElement.classList.toggle('hovered', isInteractive);
        }
      };

      window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });

      const updateCursor = () => {
        this.ringX += (this.mouseX - this.ringX) * 0.28;
        this.ringY += (this.mouseY - this.ringY) * 0.28;

        if (this.cursorDotRef?.nativeElement) {
          this.cursorDotRef.nativeElement.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
        }
        if (this.cursorRingRef?.nativeElement) {
          this.cursorRingRef.nativeElement.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
        }

        this.rafId = requestAnimationFrame(updateCursor);
      };

      this.rafId = requestAnimationFrame(updateCursor);
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.mouseMoveHandler) {
        window.removeEventListener('mousemove', this.mouseMoveHandler);
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    }
  }
}
