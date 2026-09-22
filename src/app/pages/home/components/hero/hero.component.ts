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

  nodes = [
    { title: 'School ERP', id: 'school', angle: -60, x: 260, y: -130 },
    { title: 'Travel ERP', id: 'travel', angle: -180, x: -300, y: 0 },
    { title: 'Retail ERP', id: 'retail', angle: 0, x: 300, y: 0 },
    { title: 'Hospital ERP', id: 'hospital', angle: 130, x: -220, y: 150 },
    { title: 'Cooperative ERP', id: 'cooperative', angle: 50, x: 220, y: 150 },
    { title: 'Business Automation', id: 'automation', angle: 90, x: 0, y: 220 }
  ];

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.heroRef, () => {
      // 1. Initial State
      gsap.set('.hero-reveal', { opacity: 0, y: 35 });
      gsap.set('.center-node', { opacity: 0, scale: 0.7 });
      gsap.set('.erp-node', { opacity: 0, scale: 0.6 });
      gsap.set('.connection-path', { strokeDasharray: 400, strokeDashoffset: 400 });
      gsap.set('.particle', { opacity: 0 });

      // 2. Timeline Reveal Sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15
      })
      .to('.center-node', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)'
      }, '-=0.5')
      .to('.connection-path', {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.1
      }, '-=0.4')
      .to('.erp-node', {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'back.out(1.3)'
      }, '-=1.0')
      .to('.particle', {
        opacity: 1,
        duration: 0.5
      }, '-=0.3');

      // Continuous ambient floating animation
      gsap.to('.erp-node', {
        y: '+=8',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
      });
    });
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to('.ecosystem-visual', {
      rotationY: relX * 8,
      rotationX: -relY * 8,
      duration: 0.8,
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
