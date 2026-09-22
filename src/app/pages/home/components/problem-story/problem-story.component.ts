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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.sectionRef.nativeElement,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1
        }
      });

      tl.to('.workflow-manual', { opacity: 0.2, filter: 'blur(4px)', duration: 0.5 })
        .to('.transformation-glow', { opacity: 1, scale: 1.1, duration: 0.5 }, '-=0.3')
        .to('.workflow-mmk', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to('.connect-line-svg', { strokeDashoffset: 0, duration: 0.8 }, '-=0.6');
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
