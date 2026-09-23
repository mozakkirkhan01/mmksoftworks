import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SOLUTIONS_DATA } from '../../../shared/data/solutions.data';
import { Solution } from '../../../core/models/solution.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-solution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section *ngIf="solution" class="mmk-section inner-page-hero">
      <div class="mmk-container">
        <span class="eyebrow">{{ solution.category }} SOLUTION</span>
        <h1 class="hero-title">
          {{ solution.title }} <br>
          <span class="brand-gradient-text">{{ solution.subtitle }}</span>
        </h1>
        <p class="section-subtitle">
          {{ solution.fullDescription }}
        </p>
      </div>
    </section>

    <section *ngIf="solution" class="mmk-section inner-content">
      <div class="mmk-container">
        <h2 class="section-title text-center mb-5">Key Core Modules</h2>
        <div class="features-detail-grid">
          <div *ngFor="let f of solution.features" class="feature-detail-card mmk-glass-card">
            <h3>{{ f.title }}</h3>
            <p>{{ f.description }}</p>
          </div>
        </div>

        <div class="cta-banner mmk-glass-card mt-5 text-center">
          <h3>Ready to deploy {{ solution.title }} in your organization?</h3>
          <p>Contact MMK Softworks today for a live demo and workflow consultation.</p>
          <a routerLink="/contact" class="btn-demo">Schedule Solution Demo →</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inner-page-hero {
      padding-top: 150px;
      padding-bottom: 60px;
      background-color: var(--mmk-bg-primary);
    }

    .features-detail-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .feature-detail-card {
      padding: 2rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.25rem;
        color: var(--mmk-white);
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.9rem;
        color: var(--mmk-muted-light);
        line-height: 1.6;
      }
    }

    .cta-banner {
      padding: 3.5rem;
      margin-top: 4rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.8rem;
        color: var(--mmk-white);
        margin-bottom: 0.75rem;
      }

      p {
        color: var(--mmk-muted-light);
        margin-bottom: 2rem;
      }

      .btn-demo {
        display: inline-block;
        padding: 0.85rem 2rem;
        border-radius: 30px;
        background: linear-gradient(135deg, #168BFF 0%, #19D3FF 100%);
        color: #04111D;
        font-weight: 700;
        text-decoration: none;
      }
    }
  `]
})
export class SolutionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  solution?: Solution;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.solution = SOLUTIONS_DATA.find(s => s.slug === slug) || SOLUTIONS_DATA[0];
      if (this.solution) {
        this.seoService.updateSeo(`${this.solution.title} | Solution Overview`, this.solution.shortDescription);
      }
    });
  }
}
