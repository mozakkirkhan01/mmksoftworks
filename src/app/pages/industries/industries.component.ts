import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { INDUSTRIES_DATA } from '../../shared/data/industries.data';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-industries-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">DOMAINS & VERTICALS</span>
        <h1 class="hero-title">
          Built for the way <br>
          <span class="brand-gradient-text">your industry works.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          Tailored software architectures designed around specific operational needs across India.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="ind-page-grid">
          <div *ngFor="let ind of industries" class="ind-full-card mmk-glass-card">
            <h3>{{ ind.title }}</h3>
            <p>{{ ind.description }}</p>
            <div class="pills">
              <span *ngFor="let m of ind.keyModules" class="pill">{{ m }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inner-page-hero {
      padding-top: 150px;
      padding-bottom: 60px;
      background-color: var(--mmk-bg-primary);

      .eyebrow {
        justify-content: center;
      }
    }

    .ind-page-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .ind-full-card {
      padding: 2.5rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--mmk-white);
        margin-bottom: 0.75rem;
      }

      p {
        font-size: 0.95rem;
        color: var(--mmk-muted-light);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .pills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .pill {
          font-family: var(--font-code);
          font-size: 0.725rem;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          background: rgba(25, 211, 255, 0.08);
          border: 1px solid rgba(25, 211, 255, 0.2);
          color: var(--mmk-cyan);
        }
      }
    }
  `]
})
export class IndustriesComponent implements OnInit {
  private seoService = inject(SeoService);
  industries = INDUSTRIES_DATA;

  ngOnInit(): void {
    this.seoService.updateSeo('Industry Solutions', 'Education, Travel, Retail, Healthcare, and Cooperative Society ERP solutions by MMK Softworks.');
  }
}
