import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { AnimationService } from '../../../../core/services/animation.service';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroRef', { static: true }) heroRef!: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private smoothScrollService = inject(SmoothScrollService);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.heroRef, () => {
      gsap.set('.hero-reveal', { opacity: 0, y: 35 });
      gsap.set('.cyber-robot-wrapper', { opacity: 0, scale: 0.8, y: 40 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15
      })
      .to('.cyber-robot-wrapper', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: 'back.out(1.5)'
      }, '-=0.5');

      // Floating float levitation animation
      gsap.to('.cyber-bot', {
        y: '+=12',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Levitating shoulder pods animation
      gsap.to('.left-pod', { y: '-=8', duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.right-pod', { y: '+=8', duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });
    });
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // 3D Head Tilt Motion
    gsap.to('.bot-head', {
      rotationY: relX * 36,
      rotationX: -relY * 26,
      rotationZ: relX * 6,
      duration: 0.35,
      ease: 'power2.out'
    });

    // Eye Pupils Tracking Cursor Position
    gsap.to('.pupil-iris', {
      x: relX * 16,
      y: relY * 12,
      duration: 0.2,
      ease: 'power2.out'
    });

    // Shoulder Pods Reaction
    gsap.to('.left-pod', {
      x: relX * -10,
      y: relY * -8,
      duration: 0.45,
      ease: 'power2.out'
    });

    gsap.to('.right-pod', {
      x: relX * 10,
      y: relY * 8,
      duration: 0.45,
      ease: 'power2.out'
    });
  }

  scrollToSolutions(): void {
    this.smoothScrollService.scrollTo('#solutions-story');
  }

  scrollToContact(): void {
    this.smoothScrollService.scrollTo('#contact-section');
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
