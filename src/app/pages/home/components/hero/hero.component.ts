import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import type * as THREE from 'three';
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
  private ambientAnimations: gsap.core.Animation[] = [];

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
  private three?: typeof import('three');
  private previousFrameTime?: number;
  private elapsedTime = 0;
  private loadingPromise?: Promise<void>;
  private destroyed = false;
  is3DLoading = signal(false);
  prefersReducedMotion = signal(false);
  heroPaused = signal(false);
  private motionQuery?: MediaQueryList;
  private pointerFrame?: number;
  private updateRect?: () => void;
  private visibilityHandler = () => {
    this.syncRenderLoop();
    const paused = !this.isHeroVisible || document.hidden;
    this.heroPaused.set(paused);
    // Pause only independent ambient animations. Pausing/resuming timeline
    // children changes their scheduling and can replay opacity setup tweens.
    this.ambientAnimations.forEach(animation => animation.paused(paused));
  };
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
  private resetSpeechTimer?: ReturnType<typeof setTimeout>;
  private heroObserver?: IntersectionObserver;
  private isHeroVisible = true;
  private heroMouseMoveHandler?: (e: MouseEvent) => void;
  private followPointer?: (x: number, y: number) => void;

  ngAfterViewInit(): void {
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionQuery.addEventListener('change', this.configureMotion);
    this.configureMotion();
    this.setupHeroPerformanceOptimizations();
  }

  private configureMotion = (): void => {
    this.ngZone.runOutsideAngular(() => {
      this.ctx?.revert();
      this.ctx = undefined;
      this.ambientAnimations = [];
      this.followPointer = undefined;
      this.prefersReducedMotion.set(this.motionQuery?.matches ?? false);
      this.isDancing.set(false);
      this.isWaving.set(false);
      this.isBlinking.set(false);
      this.mixer?.stopAllAction();
      if (!this.prefersReducedMotion()) {
        this.actions['Idle']?.reset().play();
        this.initHeroAnimations();
      }
      this.visibilityHandler();
      if (this.prefersReducedMotion()) this.renderStill();
    });
  };

  private initHeroAnimations(): void {
    // 1. Angular GSAP Hero Reveal & Classic Interactive Setup
    this.ctx = this.animationService.createContext(this.heroRef, () => {
      gsap.set('.hero-reveal', { opacity: 0, y: 35, force3D: true });
      gsap.set('.robot-stage', { opacity: 0, scale: 0.8, y: 40, force3D: true });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } });

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
      const float = gsap.to('.robot-3d-box', {
        y: '+=12',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Synchronized holographic pedestal shadow
      const pedestal = gsap.to('.holo-pedestal', {
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
      this.ambientAnimations = [float, pedestal, this.naturalBlinkTween];

      // Reuse pointer tweens instead of allocating/retaining new ones every frame.
      const select = gsap.utils.selector(this.heroRef.nativeElement);
      const quick = (selector: string, property: string, duration: number) =>
        gsap.quickTo(select(selector), property, { duration, ease: 'power2.out', overwrite: 'auto' });
      const rotateY = quick('.robot-3d-box', 'rotationY', 0.35);
      const rotateX = quick('.robot-3d-box', 'rotationX', 0.35);
      const rotateZ = quick('.robot-3d-box', 'rotation', 0.35);
      const pupilX = quick('.pupil-dot', 'x', 0.18);
      const pupilY = quick('.pupil-dot', 'y', 0.18);
      const speechX = quick('.robot-speech-pill', 'x', 0.45);
      const speechY = quick('.robot-speech-pill', 'y', 0.45);
      const pedestalX = quick('.holo-pedestal', 'x', 0.4);
      this.followPointer = (x, y) => {
        if (this.isGLBViewActive()) {
          this.targetRotY = x * 0.45;
          this.targetRotX = -y * 0.32;
        } else {
          rotateY(x * 22); rotateX(-y * 16); rotateZ(x * 4);
          pupilX(x * 7); pupilY(y * 5);
        }
        speechX(x * -8); speechY(y * -6); pedestalX(x * 10);
      };
    }, false); // Hero owns its live preference listener, including WebGL.

  }

  private setupHeroPerformanceOptimizations(): void {
    if (typeof window === 'undefined' || !this.heroRef) return;

    this.ngZone.runOutsideAngular(() => {
      // Pause 3D render loop when hero is off-screen
      if (typeof IntersectionObserver !== 'undefined') {
        this.heroObserver = new IntersectionObserver(([entry]) => {
          this.isHeroVisible = entry.isIntersecting;
          this.visibilityHandler();
        }, { threshold: 0.05 });
        this.heroObserver.observe(this.heroRef.nativeElement);
      }

      // Smooth throttled mousemove outside Zone.js
      let ticking = false;
      let cachedRect = this.heroRef.nativeElement.getBoundingClientRect();
      let cachedScrollY = window.scrollY;
      this.updateRect = () => {
        if (this.heroRef) cachedRect = this.heroRef.nativeElement.getBoundingClientRect();
        cachedScrollY = window.scrollY;
      };
      window.addEventListener('resize', this.updateRect, { passive: true });
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.heroMouseMoveHandler = (e: MouseEvent) => {
        if (!this.isHeroVisible || ticking || this.prefersReducedMotion() || this.isDancing()) return;
        ticking = true;
        this.pointerFrame = requestAnimationFrame(() => {
          this.pointerFrame = undefined;
          ticking = false;
          if (this.destroyed || this.prefersReducedMotion()) return;
          const rect = { left: cachedRect.left, width: cachedRect.width, height: cachedRect.height,
            top: cachedRect.top - (window.scrollY - cachedScrollY) };
          const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

          if (!this.isDancing()) this.followPointer?.(relX, relY);
        });
      };

      this.heroRef.nativeElement.addEventListener('mousemove', this.heroMouseMoveHandler, { passive: true });
    });
  }

  async toggleGLBMode(event?: MouseEvent): Promise<void> {
    event?.stopPropagation();
    if (this.is3DLoading()) return;
    if (this.isGLBViewActive()) {
      this.isGLBViewActive.set(false);
      this.syncRenderLoop();
      return;
    }
    this.is3DLoading.set(true);
    this.setTemporarySpeech('Loading 3D robot…', 3500);
    try {
      await (this.loadingPromise ??= this.initThreeRobot());
      if (this.destroyed) return;
      this.isGLBViewActive.set(true);
      this.onResize();
      this.syncRenderLoop();
      this.renderStill();
      this.setTemporarySpeech('3D robot ready! Click to interact.', 3500);
    } catch (error) {
      this.loadingPromise = undefined;
      this.disposeThreeRobot();
      if (!this.destroyed) this.setTemporarySpeech('3D is unavailable. Classic robot is ready!', 3500);
      console.warn('Could not initialize 3D robot', error);
    } finally {
      if (!this.destroyed) this.is3DLoading.set(false);
    }
  }

  private async initThreeRobot(): Promise<void> {
    const [THREE, { GLTFLoader }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js')
    ]);
    if (this.destroyed || !this.robotCanvasRef) return;
    this.three = THREE;
    await this.ngZone.runOutsideAngular(async () => {
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
    const gltf = await loader.loadAsync('assets/models/robot.glb');
    if (this.destroyed) {
      this.disposeModel(gltf.scene);
      return;
    }
    this.robotModel = gltf.scene;
    this.robotModel.position.set(0, 0.15, 0);
    this.scene.add(this.robotModel);
    this.headBone = this.robotModel.getObjectByName('Head');
    this.spineBone = this.robotModel.getObjectByName('Spine');
    this.mixer = new THREE.AnimationMixer(this.robotModel);
    for (const clip of gltf.animations) this.actions[clip.name] = this.mixer.clipAction(clip);
    if (!this.prefersReducedMotion()) this.actions['Idle']?.play();
    this.activeActionName = 'Idle';
    this.is3DLoaded.set(true);

    // Window Resize Handler
    window.addEventListener('resize', this.onResize);
    });
  }

  private onResize = (): void => {
    if (!this.robotCanvasRef || !this.renderer || !this.camera) return;
    const canvas = this.robotCanvasRef.nativeElement;
    const width = canvas.clientWidth || 340;
    const height = canvas.clientHeight || 460;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    if (this.prefersReducedMotion()) this.renderStill();
  };

  private syncRenderLoop(): void {
    const shouldRun = !this.destroyed && this.is3DLoaded() && this.isGLBViewActive()
      && this.isHeroVisible && !document.hidden && !this.prefersReducedMotion();
    if (!shouldRun) {
      if (this.animFrameId !== undefined) cancelAnimationFrame(this.animFrameId);
      this.animFrameId = undefined;
      this.previousFrameTime = undefined;
    } else if (this.animFrameId === undefined) {
      this.previousFrameTime = undefined;
      this.ngZone.runOutsideAngular(() => {
        this.animFrameId = requestAnimationFrame(this.animate);
      });
    }
  }

  private renderStill(): void {
    if (this.renderer && this.scene && this.camera && this.isGLBViewActive()) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private animate = (timestamp: number): void => {
    this.animFrameId = undefined;
    if (this.destroyed || !this.isGLBViewActive() || !this.isHeroVisible || document.hidden || this.prefersReducedMotion()) return;
    const delta = this.previousFrameTime === undefined ? 0 : Math.min((timestamp - this.previousFrameTime) / 1000, 0.05);
    this.previousFrameTime = timestamp;
    this.elapsedTime += delta;
    this.mixer?.update(delta);
    if (this.headBone && !this.isDancing() && this.three) {
      const smoothing = 1 - Math.exp(-5 * delta);
      this.headBone.rotation.y = this.three.MathUtils.lerp(this.headBone.rotation.y, this.targetRotY, smoothing);
      this.headBone.rotation.x = this.three.MathUtils.lerp(this.headBone.rotation.x, this.targetRotX, smoothing);
    }
    if (this.robotModel && !this.isDancing()) {
      this.robotModel.position.y = 0.15 + Math.sin(this.elapsedTime * 2) * 0.025;
    }
    this.renderStill();
    this.animFrameId = requestAnimationFrame(this.animate);
  };

  private createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    let timeline!: gsap.core.Timeline;
    this.ngZone.runOutsideAngular(() => {
      this.ctx?.add(() => { timeline = gsap.timeline({ ...vars, defaults: { force3D: true, ...vars?.defaults } }); });
    });
    return timeline;
  }

  private play3DAction(name: string, loopOnce = true, onFinish?: () => void): void {
    if (!this.mixer || !this.actions[name] || !this.three) { onFinish?.(); return; }

    const newAction = this.actions[name];
    const prevAction = this.actions[this.activeActionName];

    if (loopOnce) {
      newAction.reset();
      newAction.setLoop(this.three.LoopOnce, 1);
      newAction.clampWhenFinished = true;

      const onClipFinished = (e: { action: THREE.AnimationAction }) => {
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
    if (this.prefersReducedMotion() || this.isDancing() || !this.isGLBViewActive()) return;

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
    if (this.prefersReducedMotion() || this.isDancing()) return;

    this.isWaving.set(true);
    this.setTemporarySpeech("Hello there! 👋 Welcome to <strong>MMK Softworks</strong>!", 3000);

    if (this.isGLBViewActive()) {
      // Play 3D Rigged Wave in WebGL
      this.play3DAction('Wave', true, () => {
        this.isWaving.set(false);
      });
      this.createTimeline()
        .to('.robot-stage', { scale: 1.03, duration: 0.25, ease: 'sine.out' })
        .to('.robot-stage', { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    } else {
      // Classic Articulated Hand Wave with GSAP Physics
      const handEl = side === 'left' ? '.robot-hand.hand-left' : '.robot-hand-target.hand-right';
      if (side === 'left') {
        this.createTimeline({
          onComplete: () => this.isWaving.set(false)
        })
        .to(handEl, { rotation: -32, scale: 1.08, duration: 0.22, ease: 'power2.out' })
        .to(handEl, { rotation: 26, duration: 0.18, repeat: 7, yoyo: true, ease: 'sine.inOut' })
        .to(handEl, { rotation: 0, scale: 1, duration: 0.28, ease: 'power2.out' });

        this.createTimeline()
          .to('.robot-3d-box', { rotationZ: -5, duration: 0.25, ease: 'sine.out' })
          .to('.robot-3d-box', { rotationZ: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)', delay: 1.4 });
      } else {
        this.createTimeline({
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
    if (this.prefersReducedMotion() || this.isDancing()) return;

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

      const blinkTl = this.createTimeline({
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
          opacity: 0.55,
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
    if (this.prefersReducedMotion() || this.isDancing()) return;

    this.isDancing.set(true);
    this.setTemporarySpeech("Party mode! 🕺 Let's groove and code!", 4200);

    if (this.isGLBViewActive()) {
      // Play 3D Rigged Dance in WebGL
      this.play3DAction('Dance', true, () => {
        this.isDancing.set(false);
        this.setTemporarySpeech("Phew! What a groove. Ready to build something great? 🚀", 3500);
      });

      this.createTimeline()
        .to('.robot-stage', { y: -12, duration: 0.2, repeat: 9, yoyo: true, ease: 'sine.inOut' })
        .to('.robot-stage', { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    } else {
      // Classic 5-Stage Epic Dance Routine with GSAP
      const danceTl = this.createTimeline({
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
      this.createTimeline()
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

  private disposeModel(model: THREE.Object3D): void {
    const textures = new Set<THREE.Texture>();
    model.traverse(object => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      if (!mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value && typeof value === 'object' && 'isTexture' in value) textures.add(value as THREE.Texture);
        }
        material.dispose();
      }
    });
    textures.forEach(texture => texture.dispose());
  }

  private disposeThreeRobot(): void {
    this.mixer?.stopAllAction();
    if (this.robotModel) {
      this.mixer?.uncacheRoot(this.robotModel);
      this.disposeModel(this.robotModel);
    }
    this.renderer?.dispose();
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.mixer = undefined;
    this.robotModel = undefined;
    this.actions = {};
    this.is3DLoaded.set(false);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.motionQuery?.removeEventListener('change', this.configureMotion);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    if (this.updateRect) window.removeEventListener('resize', this.updateRect);
    if (this.pointerFrame !== undefined) cancelAnimationFrame(this.pointerFrame);
    this.ctx?.revert();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resetSpeechTimer) {
      clearTimeout(this.resetSpeechTimer);
    }
    if (this.heroObserver) {
      this.heroObserver.disconnect();
    }
    if (this.heroMouseMoveHandler && this.heroRef) {
      this.heroRef.nativeElement.removeEventListener('mousemove', this.heroMouseMoveHandler);
    }
    window.removeEventListener('resize', this.onResize);
    this.disposeThreeRobot();
  }
}
