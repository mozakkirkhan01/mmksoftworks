import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../../../core/services/animation.service';
import { SOLUTIONS_DATA } from '../../../../shared/data/solutions.data';
import { Solution } from '../../../../core/models/solution.model';

@Component({
  selector: 'app-erp-ecosystem',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './erp-ecosystem.component.html',
  styleUrl: './erp-ecosystem.component.scss'
})
export class ErpEcosystemComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stickySection', { static: true }) stickySection!: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private ctx?: gsap.Context;

  solutions: Solution[] = SOLUTIONS_DATA.filter(s => s.id !== 'custom-erp');
  activeIndex = signal<number>(0);

  ngAfterViewInit(): void {
    this.ctx = this.animationService.createContext(this.stickySection, () => {
      gsap.registerPlugin(ScrollTrigger);

      const items = gsap.utils.toArray('.solution-scroll-trigger');

      items.forEach((item: any, i: number) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => this.setActiveIndex(i),
          onEnterBack: () => this.setActiveIndex(i)
        });
      });
    });
  }

  setActiveIndex(index: number): void {
    if (this.activeIndex() !== index) {
      this.activeIndex.set(index);
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
