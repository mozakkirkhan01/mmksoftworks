import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
      // 1. Initial State
      gsap.set('.hero-reveal', { opacity: 0, y: 35 });
      gsap.set('.robot-3d-wrapper', { opacity: 0, scale: 0.8, y: 30 });

      // 2. Timeline Reveal Sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15
      })
      .to('.robot-3d-wrapper', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: 'back.out(1.4)'
      }, '-=0.5');

      // Continuous ambient breathing float
      gsap.to('.robot-body-container', {
        y: '+=10',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // 1. Rotate Robot Head in 3D Space
    gsap.to('.robot-head', {
      rotationY: relX * 32,
      rotationX: -relY * 22,
      rotationZ: relX * 5,
      duration: 0.4,
      ease: 'power2.out'
    });

    // 2. Move Robot Pupils (Eyes tracking cursor)
    gsap.to('.eye-pupil', {
      x: relX * 14,
      y: relY * 10,
      duration: 0.25,
      ease: 'power2.out'
    });

    // 3. Subtle Chest Reactor Glow Response
    gsap.to('.arc-reactor', {
      x: relX * 8,
      y: relY * 5,
      duration: 0.5,
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
