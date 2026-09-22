import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-home-workflow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class HomeWorkflowComponent implements AfterViewInit, OnDestroy {
  @ViewChild('workflowRef', { static: true }) workflowRef!: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private ctx?: gsap.Context;

  stages = [
    { num: '01', title: 'Understand', desc: 'We study your existing workflow, challenges, and requirements in depth.' },
    { num: '02', title: 'Design', desc: 'We convert complex business processes into intuitive digital user experiences.' },
    { num: '03', title: 'Develop', desc: 'We build secure, scalable, and maintainable software architectures.' },
    { num: '04', title: 'Integrate', desc: 'We connect payment gateways, WhatsApp messaging, APIs, and legacy systems.' },
    { num: '05', title: 'Launch', desc: 'We deploy, rigorously test, and train your operational team.' },
    { num: '06', title: 'Improve', desc: 'We continuously monitor, support, and enhance the platform as you grow.' }
  ];

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.workflowRef, () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.stage-card', {
        scrollTrigger: {
          trigger: this.workflowRef.nativeElement,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 1
        },
        opacity: 0,
        y: 40,
        stagger: 0.15
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
