import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SOLUTIONS_DATA } from '../../shared/data/solutions.data';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">OUR ERP & AUTOMATION SUITE</span>
        <h1 class="hero-title">
          Purpose-built ERP platforms for <br>
          <span class="brand-gradient-text">every business domain.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          Explore specialized software systems tailored for schools, travel agencies, retail stores, healthcare clinics, and cooperative financial societies.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="solutions-grid">
          <div *ngFor="let sol of solutions" class="sol-page-card mmk-glass-card">
            <span class="category-badge">{{ sol.category }}</span>
            <h3>{{ sol.title }}</h3>
            <p>{{ sol.shortDescription }}</p>
            <div class="card-footer">
              <a [routerLink]="['/solutions', sol.slug]" class="sol-detail-btn">
                Explore Solution →
              </a>
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

    .solutions-grid {
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

    .sol-page-card {
      padding: 2.25rem;
      display: flex;
      flex-direction: column;

      .category-badge {
        font-family: var(--font-code);
        font-size: 0.725rem;
        color: var(--mmk-cyan);
        margin-bottom: 0.75rem;
      }

      h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--mmk-white);
        margin-bottom: 0.75rem;
      }

      p {
        font-size: 0.925rem;
        color: var(--mmk-muted-light);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .card-footer {
        margin-top: auto;

        .sol-detail-btn {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--mmk-cyan);
          text-decoration: none;
        }
      }
    }
  `]
})
export class SolutionsComponent implements OnInit {
  private seoService = inject(SeoService);
  solutions = SOLUTIONS_DATA;

  ngOnInit(): void {
    this.seoService.updateSeo('Software Solutions & Custom ERPs', 'Explore MMK Softworks custom ERP platforms for School, Travel, Retail, Hospital, and Cooperative Societies.');
  }
}
