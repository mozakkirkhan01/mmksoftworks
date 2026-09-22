import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot" [style.transform]="'translate3d(' + posX() + 'px, ' + posY() + 'px, 0)'" [class.hovered]="isHovered()"></div>
    <div class="cursor-ring" [style.transform]="'translate3d(' + posX() + 'px, ' + posY() + 'px, 0)'" [class.hovered]="isHovered()"></div>
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
      transition: transform 0.05s linear;
      box-shadow: 0 0 10px var(--mmk-cyan);
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
      transition: transform 0.15s ease-out, width 0.2s ease, height 0.2s ease, border-color 0.2s ease;

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
export class CustomCursorComponent {
  posX = signal(-100);
  posY = signal(-100);
  isHovered = signal(false);

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.posX.set(e.clientX);
    this.posY.set(e.clientY);

    const target = e.target as HTMLElement;
    const isInteractive = target && (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') !== null ||
      target.closest('button') !== null ||
      target.classList.contains('interactive')
    );

    this.isHovered.set(!!isInteractive);
  }
}
