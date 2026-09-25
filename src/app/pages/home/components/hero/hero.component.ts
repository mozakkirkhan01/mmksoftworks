import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
  @ViewChild('robotCanvas', { static: false }) robotCanvasRef!: ElementRef<HTMLCanvasElement>;

  private animationService = inject(AnimationService);
  private smoothScrollService = inject(SmoothScrollService);
  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;
  private naturalBlinkTween?: gsap.core.Timeline;

  // View Mode: false = Classic Interactive Robot (Default), true = Real-Time 3D WebGL GLB Mode
  isGLBViewActive = signal<boolean>(false);

  // Interactive Robot States
  speechText = signal<string>("Hi! I'm <strong>MMK Bot</strong>. Ready to build?");
  isDancing = signal<boolean>(false);
  isWaving = signal<boolean>(false);
  isBlinking = signal<boolean>(false);
  is3DLoaded = signal<boolean>(false);

  danceNotes = [
    { icon: '🎵', left: 18, delay: 0 },
    { icon: '🎶', left: 78, delay: 0.35 },
    { icon: '⚡', left: 25, delay: 0.7 },
    { icon: '🕺', left: 82, delay: 1.05 },
    { icon: '✨', left: 15, delay: 1.4 },
    { icon: '🤖', left: 75, delay: 1.75 },
    { icon: '🎉', left: 50, delay: 2.1 }
  ];

  // Three.js Core
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private mixer?: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animFrameId?: number;

  // 3D Bones & Nodes for Real-Time Tracking
  private headBone?: THREE.Object3D;
  private spineBone?: THREE.Object3D;
  private robotModel?: THREE.Object3D;

  // Animation Actions Map
  private actions: { [name: string]: THREE.AnimationAction } = {};
  private activeActionName: string = 'Idle';

  // Mouse Coordinates for 3D Tracking
  private targetRotY = 0;
  private targetRotX = 0;
  private resetSpeechTimer?: any;

  ngAfterViewInit(): void {
    // 1. Angular GSAP Hero Reveal & Classic Interactive Setup
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

      // Continuous ambient breathing floating levitation
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

      // Natural subtle blinking interval for classic mode
      this.naturalBlinkTween = gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
        .to('.eye-glow', { scaleY: 0.1, duration: 0.1, ease: 'power1.inOut' })
        .to('.eye-glow', { scaleY: 1, duration: 0.12, ease: 'power1.inOut' });
    });

    // 2. Pre-initialize Three.js WebGL GLB Robot in background
    this.initThreeRobot();
  }

  toggleGLBMode(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const nextState = !this.isGLBViewActive();
    this.isGLBViewActive.set(nextState);

    if (nextState) {
      this.setTemporarySpeech("3D WebGL GLB Mode activated! 🌐 Move cursor or click to interact with 3D model!", 3500);
      setTimeout(() => this.onResize(), 50);
    } else {
      this.setTemporarySpeech("Classic Interactive Mode activated! ✨ Click my hands, eyes, or stomach!", 3500);
    }
  }

  private initThreeRobot(): void {
    if (!this.robotCanvasRef) return;
    const canvas = this.robotCanvasRef.nativeElement;
    const width = canvas.clientWidth || 340;
    const height = canvas.clientHeight || 460;

    // Create Scene
    this.scene = new THREE.Scene();

    // Create Camera with cinematic perspective
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 1.25, 3.8);
    this.camera.lookAt(0, 1.15, 0);

    // Create WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(2.5, 4.5, 3);
    this.scene.add(dirLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00e5ff, 3.4);
    cyanRimLight.position.set(-3.5, 2.5, -2.5);
    this.scene.add(cyanRimLight);

    const blueFillLight = new THREE.PointLight(0x168bff, 2.4, 12);
    blueFillLight.position.set(0, 0.5, 2.5);
    this.scene.add(blueFillLight);

    // Load Rigged GLB Model
    const loader = new GLTFLoader();
    loader.load(
      'assets/models/robot.glb',
      (gltf) => {
        this.robotModel = gltf.scene;
        this.robotModel.position.set(0, 0.15, 0);
        this.scene?.add(this.robotModel);

        // Find tracking joints
        this.headBone = this.robotModel.getObjectByName('Head');
        this.spineBone = this.robotModel.getObjectByName('Spine');

        // Setup Animation Mixer
        this.mixer = new THREE.AnimationMixer(this.robotModel);
        for (const clip of gltf.animations) {
          const action = this.mixer.clipAction(clip);
          this.actions[clip.name] = action;
        }

        // Start Idle Animation by Default
        if (this.actions['Idle']) {
          this.actions['Idle'].play();
          this.activeActionName = 'Idle';
        }

        this.is3DLoaded.set(true);

        // Run Render Loop Outside Angular Zone
        this.ngZone.runOutsideAngular(() => {
          this.animate();
        });
      },
      undefined,
      (error) => {
        console.warn('Fallback to Classic stage: could not load GLB model', error);
      }
    );

    // Window Resize Handler
    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => {
    if (!this.robotCanvasRef || !this.renderer || !this.camera) return;
    const canvas = this.robotCanvasRef.nativeElement;
    const width = canvas.clientWidth || 340;
    const height = canvas.clientHeight || 460;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Smooth Cursor Tracking Interpolation for GLB mode
    if (this.headBone && !this.isDancing()) {
      this.headBone.rotation.y = THREE.MathUtils.lerp(this.headBone.rotation.y, this.targetRotY, 0.08);
      this.headBone.rotation.x = THREE.MathUtils.lerp(this.headBone.rotation.x, this.targetRotX, 0.08);
    }

    if (this.robotModel && !this.isDancing()) {
      this.robotModel.position.y = 0.15 + Math.sin(this.clock.getElapsedTime() * 2.0) * 0.025;
    }

    if (this.renderer && this.scene && this.camera && this.isGLBViewActive()) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef) return;
    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // 1. Classic Mode Interactive Tilt & Pupil Tracking
    if (!this.isDancing()) {
      if (!this.isGLBViewActive()) {
        gsap.to('.robot-3d-box', {
          rotationY: relX * 22,
          rotationX: -relY * 16,
          rotationZ: relX * 4,
          duration: 0.35,
          ease: 'power2.out'
        });

        gsap.to('.pupil-dot', {
          x: relX * 7,
          y: relY * 5,
          duration: 0.18,
          ease: 'power2.out'
        });
      } else {
        // 3D GLB Target Rotation
        this.targetRotY = relX * 0.45;
        this.targetRotX = -relY * 0.32;
      }
    }

    // 2. Parallax Speech Pill & Pedestal
    gsap.to('.robot-speech-pill', {
      x: relX * -8,
      y: relY * -6,
      duration: 0.45,
      ease: 'power2.out'
    });

    gsap.to('.holo-pedestal', {
      x: relX * 10,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  private play3DAction(name: string, loopOnce = true, onFinish?: () => void): void {
    if (!this.mixer || !this.actions[name]) return;

    const newAction = this.actions[name];
    const prevAction = this.actions[this.activeActionName];

    if (loopOnce) {
      newAction.reset();
      newAction.setLoop(THREE.LoopOnce, 1);
      newAction.clampWhenFinished = true;

      const onClipFinished = (e: any) => {
        if (e.action === newAction) {
          this.mixer?.removeEventListener('finished', onClipFinished);
          if (this.actions['Idle']) {
            newAction.crossFadeTo(this.actions['Idle'], 0.4, false);
            this.actions['Idle'].reset().play();
            this.activeActionName = 'Idle';
          }
          if (onFinish) onFinish();
        }
      };
      this.mixer.addEventListener('finished', onClipFinished);
    } else {
      newAction.reset().play();
    }

    if (prevAction && prevAction !== newAction) {
      prevAction.crossFadeTo(newAction, 0.35, true);
    }

    newAction.play();
    this.activeActionName = name;
  }

  /**
   * Click on 3D WebGL Canvas -> Random Action / Wave
   */
  onCanvasClick(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing() || !this.isGLBViewActive()) return;

    if (!this.isWaving() && !this.isBlinking()) {
      const actions = ['Wave', 'Blink', 'Dance'];
      const pick = actions[Math.floor(Math.random() * actions.length)];
      if (pick === 'Wave') {
        this.onHandClick('left');
      } else if (pick === 'Blink') {
        this.onEyeClick();
      } else {
        this.onStomachClick();
      }
    }
  }

  /**
   * Action 1: On Click Hand -> Wave!
   */
  onHandClick(side: 'left' | 'right', event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isWaving.set(true);
    this.setTemporarySpeech("Hello there! 👋 Welcome to <strong>MMK Softworks</strong>!", 3000);

    if (this.isGLBViewActive()) {
      // Play 3D Rigged Wave in WebGL
      this.play3DAction('Wave', true, () => {
        this.isWaving.set(false);
      });
      gsap.timeline()
        .to('.robot-stage', { scale: 1.03, duration: 0.25, ease: 'sine.out' })
        .to('.robot-stage', { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    } else {
      // Classic Articulated Hand Wave with GSAP Physics
      const handEl = side === 'left' ? '.robot-hand.hand-left' : '.robot-hand-target.hand-right';
      if (side === 'left') {
        gsap.timeline({
          onComplete: () => this.isWaving.set(false)
        })
        .to(handEl, { rotation: -32, scale: 1.08, duration: 0.22, ease: 'power2.out' })
        .to(handEl, { rotation: 26, duration: 0.18, repeat: 7, yoyo: true, ease: 'sine.inOut' })
        .to(handEl, { rotation: 0, scale: 1, duration: 0.28, ease: 'power2.out' });

        gsap.timeline()
          .to('.robot-3d-box', { rotationZ: -5, duration: 0.25, ease: 'sine.out' })
          .to('.robot-3d-box', { rotationZ: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)', delay: 1.4 });
      } else {
        gsap.timeline({
          onComplete: () => this.isWaving.set(false)
        })
        .to('.robot-3d-box', { rotationZ: 6, rotationY: 12, duration: 0.25, ease: 'sine.out' })
        .to('.robot-3d-box', { rotationZ: -4, rotationY: -6, duration: 0.25, repeat: 3, yoyo: true })
        .to('.robot-3d-box', { rotationZ: 0, rotationY: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
      }
    }
  }

  /**
   * Action 2: On Click Eye -> Blink!
   */
  onEyeClick(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isBlinking.set(true);
    this.setTemporarySpeech("Blink! 😉 Scanning business processes... All systems optimal!", 3000);

    if (this.isGLBViewActive()) {
      // Play 3D Rigged Blink in WebGL
      this.play3DAction('Blink', true, () => {
        this.isBlinking.set(false);
      });
    } else {
      // Classic Multi-Blink, Wink, and Radiant Flash
      this.naturalBlinkTween?.pause();

      const blinkTl = gsap.timeline({
        onComplete: () => {
          this.isBlinking.set(false);
          this.naturalBlinkTween?.resume();
        }
      });

      blinkTl
        .to('.eye-glow', { scaleY: 0.05, duration: 0.08, ease: 'power1.inOut' })
        .to('.eye-glow', { scaleY: 1, duration: 0.1, ease: 'power1.inOut' })
        .to('.eye-glow', { scaleY: 0.05, duration: 0.08, ease: 'power1.inOut', delay: 0.06 })
        .to('.eye-glow', { scaleY: 1, duration: 0.1, ease: 'power1.inOut' })
        .to('.eye-glow.eye-left', { scaleY: 0.05, duration: 0.45, ease: 'power2.out', delay: 0.15 })
        .to('.eye-glow.eye-left', { scaleY: 1, duration: 0.15, ease: 'power2.out' })
        .to('.eye-glow', { 
          boxShadow: '0 0 24px #00E5FF, 0 0 45px rgba(0, 229, 255, 0.9)', 
          duration: 0.35, 
          yoyo: true, 
          repeat: 1 
        });
    }
  }

  /**
   * Action 3: On Click Stomach -> Dance!
   */
  onStomachClick(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isDancing()) return;

    this.isDancing.set(true);
    this.setTemporarySpeech("Party mode! 🕺 Let's groove and code!", 4200);

    if (this.isGLBViewActive()) {
      // Play 3D Rigged Dance in WebGL
      this.play3DAction('Dance', true, () => {
        this.isDancing.set(false);
        this.setTemporarySpeech("Phew! What a groove. Ready to build something great? 🚀", 3500);
      });

      gsap.timeline()
        .to('.robot-stage', { y: -12, duration: 0.2, repeat: 9, yoyo: true, ease: 'sine.inOut' })
        .to('.robot-stage', { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    } else {
      // Classic 5-Stage Epic Dance Routine with GSAP
      const danceTl = gsap.timeline({
        onComplete: () => {
          this.isDancing.set(false);
          this.setTemporarySpeech("Phew! What a groove. Ready to build something great? 🚀", 3500);
        }
      });

      // 1. Squat bounce
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
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resetSpeechTimer) {
      clearTimeout(this.resetSpeechTimer);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }
}
