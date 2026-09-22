import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './final-cta.component.html',
  styleUrl: './final-cta.component.scss'
})
export class FinalCtaComponent {
  private smoothScroll = inject(SmoothScrollService);

  scrollToContact(): void {
    this.smoothScroll.scrollTo('#contact-section');
  }
}
