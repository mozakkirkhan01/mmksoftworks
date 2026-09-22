import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../../../core/services/animation.service';
import { TECH_STACK_DATA } from '../../../../shared/data/technology.data';

@Component({
  selector: 'app-tech-architecture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-architecture.component.html',
  styleUrl: './tech-architecture.component.scss'
})
export class TechArchitectureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('techRef', { static: true }) techRef!: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private ctx?: gsap.Context;

  techLayers = TECH_STACK_DATA;

  externalNodes = [
    { title: 'Payment Gateway', sub: 'Razorpay / UPI' },
    { title: 'WhatsApp Business', sub: 'Meta API' },
    { title: 'SMS Gateway', sub: 'Transactional' },
    { title: 'Email Services', sub: 'SMTP / SendGrid' },
    { title: 'Third-Party APIs', sub: 'REST / Tally' }
  ];

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.techRef, () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.arch-node', {
        scrollTrigger: {
          trigger: this.techRef.nativeElement,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1
        },
        opacity: 0,
        scale: 0.85,
        stagger: 0.1
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
