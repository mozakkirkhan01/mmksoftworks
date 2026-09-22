import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TECH_STACK_DATA } from '../../shared/data/technology.data';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-technology-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">ENTERPRISE STACK & ARCHITECTURE</span>
        <h1 class="hero-title">
          Modern technology built for <br>
          <span class="brand-gradient-text">high-concurrency operations.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          Deep dive into our engineering choices across frontend, backend API services, MS SQL database optimization, and cloud DevOps.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="tech-layers-grid">
          <div *ngFor="let layer of techLayers" class="layer-card mmk-glass-card">
            <span class="layer-title">{{ layer.title }}</span>
            <p class="layer-sub">{{ layer.subtitle }}</p>

            <div class="items-grid">
              <div *ngFor="let item of layer.items" class="item-box">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-desc">{{ item.description }}</span>
              </div>
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
      background-color: #04111d;

      .eyebrow {
        justify-content: center;
      }
    }

    .tech-layers-grid {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .layer-card {
      padding: 3rem;

      .layer-title {
        font-family: var(--font-code);
        font-size: 0.8rem;
        letter-spacing: 0.15em;
        color: var(--mmk-cyan);
      }

      .layer-sub {
        font-size: 1.1rem;
        color: var(--mmk-white);
        margin-top: 0.5rem;
        margin-bottom: 2rem;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 640px) {
          grid-template-columns: 1fr;
        }
      }

      .item-box {
        padding: 1.25rem;
        border-radius: 12px;
        background: rgba(4, 17, 29, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);

        .item-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--mmk-white);
          display: block;
          margin-bottom: 0.35rem;
        }

        .item-desc {
          font-size: 0.8rem;
          color: var(--mmk-muted-light);
          line-height: 1.5;
        }
      }
    }
  `]
})
export class TechnologyComponent implements OnInit {
  private seoService = inject(SeoService);
  techLayers = TECH_STACK_DATA;

  ngOnInit(): void {
    this.seoService.updateSeo('Technology Architecture', 'Angular, ASP.NET Core, C#, MS SQL Server enterprise tech stack at MMK Softworks.');
  }
}
