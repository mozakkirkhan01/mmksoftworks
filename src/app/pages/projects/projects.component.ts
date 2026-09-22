import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROJECTS_DATA } from '../../shared/data/projects.data';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">PORTFOLIO & CASE STUDIES</span>
        <h1 class="hero-title">
          Software platforms <br>
          <span class="brand-gradient-text">we've built and deployed.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          Explore real-world software applications built for travel operators, healthcare clinics, schools, and financial credit unions.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="projects-page-grid">
          <div *ngFor="let proj of projects" class="proj-page-card mmk-glass-card">
            <span class="tag">{{ proj.category }}</span>
            <h3>{{ proj.title }}</h3>
            <p>{{ proj.summary }}</p>

            <div class="tech-tags">
              <span *ngFor="let t of proj.techStack" class="t-tag">{{ t }}</span>
            </div>

            <div class="card-action">
              <a [routerLink]="['/projects', proj.slug]" class="btn-case">Read Full Case Study →</a>
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

    .projects-page-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .proj-page-card {
      padding: 3rem;
      display: flex;
      flex-direction: column;

      .tag {
        font-family: var(--font-code);
        font-size: 0.725rem;
        color: var(--mmk-cyan);
        margin-bottom: 0.75rem;
      }

      h3 {
        font-family: var(--font-heading);
        font-size: 1.6rem;
        color: var(--mmk-white);
        margin-bottom: 0.75rem;
      }

      p {
        font-size: 0.95rem;
        color: var(--mmk-muted-light);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;

        .t-tag {
          font-family: var(--font-code);
          font-size: 0.725rem;
          padding: 0.25rem 0.65rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: var(--mmk-text-light);
        }
      }

      .card-action {
        margin-top: auto;

        .btn-case {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--mmk-cyan);
          text-decoration: none;
        }
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  private seoService = inject(SeoService);
  projects = PROJECTS_DATA;

  ngOnInit(): void {
    this.seoService.updateSeo('Case Studies & Software Portfolio', 'Explore custom software projects engineered by MMK Softworks.');
  }
}
