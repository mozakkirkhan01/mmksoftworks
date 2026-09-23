import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SERVICES_DATA } from '../../shared/data/services.data';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">ENGINEERING SERVICES</span>
        <h1 class="hero-title">
          Custom software engineering <br>
          <span class="brand-gradient-text">tailored for enterprise growth.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          From custom ERP development and web applications to business automation and system integrations.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="services-full-list">
          <div *ngFor="let srv of services" class="srv-full-card mmk-glass-card">
            <div class="srv-info">
              <h2>{{ srv.title }}</h2>
              <p class="desc">{{ srv.fullDescription }}</p>
            </div>
            <div class="deliverables-box">
              <h4>Key Deliverables</h4>
              <ul>
                <li *ngFor="let d of srv.deliverables">✓ {{ d }}</li>
              </ul>
              <a routerLink="/contact" class="btn-srv-contact">Discuss Requirement →</a>
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

    .services-full-list {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .srv-full-card {
      padding: 3rem;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }

      h2 {
        font-family: var(--font-heading);
        font-size: 1.8rem;
        color: var(--mmk-white);
        margin-bottom: 1rem;
      }

      .desc {
        font-size: 1rem;
        color: var(--mmk-muted-light);
        line-height: 1.7;
      }

      .deliverables-box {
        background: rgba(4, 17, 29, 0.6);
        padding: 1.5rem;
        border-radius: 12px;

        h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          color: var(--mmk-white);
          margin-bottom: 1rem;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          li {
            font-size: 0.875rem;
            color: var(--mmk-text-light);
          }
        }

        .btn-srv-contact {
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
export class ServicesComponent implements OnInit {
  private seoService = inject(SeoService);
  services = SERVICES_DATA;

  ngOnInit(): void {
    this.seoService.updateSeo('Software Engineering Services', 'Custom ERP development, Web apps, Business automation, and API integrations by MMK Softworks.');
  }
}
