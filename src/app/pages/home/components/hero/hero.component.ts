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
      gsap.set('.robot-stage', { opacity: 0, scale: 0.8, y: 40 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15
      })
      .to('.robot-stage', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: 'back.out(1.5)'
      }, '-=0.5');

      // Floating robot levitation animation
      gsap.to('.robot-3d-box', {
        y: '+=12',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Synchronized holographic pedestal shadow
      gsap.to('.holo-pedestal', {
        scale: 0.86,
        opacity: 0.6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Natural blinking animation
      gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
        .to('.eye-glow', { scaleY: 0.1, duration: 0.1, ease: 'power1.inOut' })
        .to('.eye-glow', { scaleY: 1, duration: 0.12, ease: 'power1.inOut' });
    });
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // 3D Robot Perspective Tilt
    gsap.to('.robot-3d-box', {
      rotationY: relX * 24,
      rotationX: -relY * 18,
      rotationZ: relX * 4,
      duration: 0.35,
      ease: 'power2.out'
    });

    // Eye Pupils Tracking Cursor Position
    gsap.to('.pupil-dot', {
      x: relX * 7,
      y: relY * 5,
      duration: 0.18,
      ease: 'power2.out'
    });

    // Speech pill reaction
    gsap.to('.robot-speech-pill', {
      x: relX * -10,
      y: relY * -8,
      duration: 0.45,
      ease: 'power2.out'
    });

    // Holographic ground pedestal shift
    gsap.to('.holo-pedestal', {
      x: relX * 10,
      duration: 0.4,
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
