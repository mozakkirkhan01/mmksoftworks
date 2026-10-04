import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-problem-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-story.component.html',
  styleUrl: './problem-story.component.scss'
})
export class ProblemStoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.sectionRef, () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo('.workflow-manual',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: this.sectionRef.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.workflow-mmk',
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.12,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: this.sectionRef.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.transformation-glow',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.6,
          scale: 1,
          duration: 0.6,
          delay: 0.15,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: this.sectionRef.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
