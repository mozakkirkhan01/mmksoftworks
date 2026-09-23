import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
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

  // Interactive Robot States
  speechText = signal<string>("Hi! I'm <strong>MMK Bot</strong>. Ready to build?");
  isDancing = signal<boolean>(false);
  isWaving = signal<boolean>(false);
  isBlinking = signal<boolean>(false);

  danceNotes = [
    { icon: '🎵', left: 18, delay: 0 },
    { icon: '🎶', left: 78, delay: 0.35 },
    { icon: '⚡', left: 25, delay: 0.7 },
    { icon: '🕺', left: 82, delay: 1.05 },
    { icon: '✨', left: 15, delay: 1.4 },
    { icon: '🤖', left: 75, delay: 1.75 },
    { icon: '🎉', left: 50, delay: 2.1 }
  ];

  private resetSpeechTimer?: any;
  private naturalBlinkTween?: gsap.core.Timeline;

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

      // Natural subtle blinking interval
      this.naturalBlinkTween = gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
        .to('.eye-glow', { scaleY: 0.1, duration: 0.1, ease: 'power1.inOut' })
        .to('.eye-glow', { scaleY: 1, duration: 0.12, ease: 'power1.inOut' });
    });
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef || this.isDancing()) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // 3D Robot Perspective Tilt
    gsap.to('.robot-3d-box', {
      rotationY: relX * 22,
      rotationX: -relY * 16,
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

    // Speech pill subtle counter-parallax
    gsap.to('.robot-speech-pill', {
      x: relX * -8,
      y: relY * -6,
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

  /**
   * Action 1: On Click Hand -> Wave at user!
   */
  onHandClick(side: 'left' | 'right', event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isWaving.set(true);
    this.setTemporarySpeech("Hello there! 👋 Welcome to <strong>MMK Softworks</strong>!", 3000);

    const handEl = side === 'left' ? '.robot-hand.hand-left' : '.robot-hand-target.hand-right';

    // Left articulated hand waving physics
    if (side === 'left') {
      gsap.timeline({
        onComplete: () => this.isWaving.set(false)
      })
      .to(handEl, { rotation: -32, scale: 1.08, duration: 0.22, ease: 'power2.out' })
      .to(handEl, { rotation: 26, duration: 0.18, repeat: 7, yoyo: true, ease: 'sine.inOut' })
      .to(handEl, { rotation: 0, scale: 1, duration: 0.28, ease: 'power2.out' });

      // Cheerful friendly body tilt to accompany wave
      gsap.timeline()
        .to('.robot-3d-box', { rotationZ: -5, duration: 0.25, ease: 'sine.out' })
        .to('.robot-3d-box', { rotationZ: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)', delay: 1.4 });
    } else {
      // Right hand friendly wave reaction
      gsap.timeline({
        onComplete: () => this.isWaving.set(false)
      })
      .to('.robot-3d-box', { rotationZ: 6, rotationY: 12, duration: 0.25, ease: 'sine.out' })
      .to('.robot-3d-box', { rotationZ: -4, rotationY: -6, duration: 0.25, repeat: 3, yoyo: true })
      .to('.robot-3d-box', { rotationZ: 0, rotationY: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
    }
  }

  /**
   * Action 2: On Click Eye -> Blink, wink and sparkle!
   */
  onEyeClick(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isBlinking.set(true);
    this.setTemporarySpeech("Blink! 😉 Scanning business processes... All systems optimal!", 3000);

    // Pause natural blinking during interaction
    this.naturalBlinkTween?.pause();

    const blinkTl = gsap.timeline({
      onComplete: () => {
        this.isBlinking.set(false);
        this.naturalBlinkTween?.resume();
      }
    });

    // Rapid cheerful multi-blink
    blinkTl
      .to('.eye-glow', { scaleY: 0.05, duration: 0.08, ease: 'power1.inOut' })
      .to('.eye-glow', { scaleY: 1, duration: 0.1, ease: 'power1.inOut' })
      .to('.eye-glow', { scaleY: 0.05, duration: 0.08, ease: 'power1.inOut', delay: 0.06 })
      .to('.eye-glow', { scaleY: 1, duration: 0.1, ease: 'power1.inOut' })
      // Cute wink with left eye
      .to('.eye-glow.eye-left', { scaleY: 0.05, duration: 0.45, ease: 'power2.out', delay: 0.15 })
      .to('.eye-glow.eye-left', { scaleY: 1, duration: 0.15, ease: 'power2.out' })
      // Radiant energy pupil flash
      .to('.eye-glow', { 
        boxShadow: '0 0 24px #00E5FF, 0 0 45px rgba(0, 229, 255, 0.9)', 
        duration: 0.35, 
        yoyo: true, 
        repeat: 1 
      });
  }

  /**
   * Action 3: On Click Stomach -> High energy robot dance!
   */
  onStomachClick(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isDancing.set(true);
    this.setTemporarySpeech("Party mode! 🕺 Let's groove and code!", 4200);

    const danceTl = gsap.timeline({
      onComplete: () => {
        this.isDancing.set(false);
        this.setTemporarySpeech("Phew! What a groove. Ready to build something great? 🚀", 3500);
      }
    });

    // 1. Surprised squat bounce into dance
    danceTl.to('.robot-3d-box', { 
      y: -28, 
      scaleY: 1.08, 
      scaleX: 0.92, 
      duration: 0.22, 
      ease: 'power2.out' 
    })
    .to('.robot-3d-box', { 
      y: 12, 
      scaleY: 0.92, 
      scaleX: 1.08, 
      duration: 0.2, 
      ease: 'power2.in' 
    })
    // 2. Groovy rhythmic hip wiggle & side bounce
    .to('.robot-3d-box', { 
      rotationZ: -16, 
      rotationY: -22, 
      x: -20, 
      y: -10, 
      duration: 0.26, 
      ease: 'sine.inOut' 
    })
    .to('.robot-3d-box', { 
      rotationZ: 16, 
      rotationY: 22, 
      x: 20, 
      y: 8, 
      duration: 0.26, 
      ease: 'sine.inOut' 
    })
    .to('.robot-3d-box', { 
      rotationZ: -14, 
      rotationY: -16, 
      x: -16, 
      y: -8, 
      duration: 0.24, 
      ease: 'sine.inOut' 
    })
    .to('.robot-3d-box', { 
      rotationZ: 14, 
      rotationY: 16, 
      x: 16, 
      y: 6, 
      duration: 0.24, 
      ease: 'sine.inOut' 
    })
    // 3. 360 Pirouette / Aerial Jump Spin
    .to('.robot-3d-box', { 
      y: -36, 
      rotationY: 180, 
      scale: 1.1, 
      duration: 0.45, 
      ease: 'power1.inOut' 
    })
    .to('.robot-3d-box', { 
      y: 0, 
      rotationY: 360, 
      scale: 1, 
      duration: 0.45, 
      ease: 'power2.out' 
    })
    // 4. Double arm-pump groove
    .to('.robot-3d-box', { 
      y: -18, 
      rotationZ: -8, 
      duration: 0.18, 
      repeat: 3, 
      yoyo: true, 
      ease: 'sine.inOut' 
    })
    // 5. Final strike a pose & smooth settle
    .to('.robot-3d-box', { 
      rotationZ: 0, 
      rotationY: 0, 
      rotationX: 0, 
      x: 0, 
      y: 0, 
      scale: 1, 
      duration: 0.55, 
      ease: 'elastic.out(1, 0.4)' 
    });

    // Left hand energetic wave in rhythm with dance
    gsap.timeline()
      .to('.robot-hand.hand-left', { 
        rotation: -38, 
        duration: 0.2, 
        repeat: 9, 
        yoyo: true, 
        ease: 'sine.inOut' 
      })
      .to('.robot-hand.hand-left', { 
        rotation: 0, 
        duration: 0.35, 
        ease: 'power2.out' 
      });
  }

  private setTemporarySpeech(text: string, durationMs: number): void {
    if (this.resetSpeechTimer) {
      clearTimeout(this.resetSpeechTimer);
    }
    this.speechText.set(text);
    this.resetSpeechTimer = setTimeout(() => {
      this.speechText.set("Hi! I'm <strong>MMK Bot</strong>. Ready to build?");
    }, durationMs);
  }

  scrollToSolutions(): void {
    this.smoothScrollService.scrollTo('#solutions-story');
  }

  scrollToContact(): void {
    this.smoothScrollService.scrollTo('#contact-section');
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    if (this.resetSpeechTimer) {
      clearTimeout(this.resetSpeechTimer);
    }
  }
}
