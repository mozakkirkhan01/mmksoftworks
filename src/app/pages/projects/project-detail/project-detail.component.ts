import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS_DATA } from '../../../shared/data/projects.data';
import { Project } from '../../../core/models/project.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="project" class="mmk-section inner-page-hero">
      <div class="mmk-container">
        <span class="eyebrow">CASE STUDY: {{ project.category }}</span>
        <h1 class="hero-title">
          {{ project.title }} <br>
          <span class="brand-gradient-text">{{ project.subtitle }}</span>
        </h1>
        <p class="section-subtitle">
          {{ project.summary }}
        </p>
      </div>
    </section>

    <section *ngIf="project" class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="case-study-grid">
          <div class="case-box mmk-glass-card">
            <h3>Operational Challenge</h3>
            <p>{{ project.challenge }}</p>
          </div>

          <div class="case-box mmk-glass-card">
            <h3>MMK Solution Delivered</h3>
            <p>{{ project.solutionProvided }}</p>
          </div>
        </div>

        <div class="features-block mmk-glass-card mt-5">
          <h3>Core Platform Features</h3>
          <ul>
            <li *ngFor="let f of project.features">✓ {{ f }}</li>
          </ul>
        </div>

        <div class="tech-stack-block mt-4 text-center">
          <span class="eyebrow">TECHNOLOGY STACK USED</span>
          <div class="tech-pills">
            <span *ngFor="let t of project.techStack" class="t-pill">{{ t }}</span>
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
    }

    .case-study-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .case-box {
      padding: 3rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--mmk-white);
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        color: var(--mmk-muted-light);
        line-height: 1.7;
      }
    }

    .features-block {
      padding: 3rem;
      margin-top: 3rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--mmk-white);
        margin-bottom: 1.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.85rem;

        li {
          font-size: 1rem;
          color: var(--mmk-text-light);
        }
      }
    }

    .tech-stack-block {
      margin-top: 4rem;

      .eyebrow {
        justify-content: center;
      }

      .tech-pills {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;

        .t-pill {
          font-family: var(--font-code);
          font-size: 0.85rem;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          background: rgba(25, 211, 255, 0.08);
          border: 1px solid rgba(25, 211, 255, 0.25);
          color: var(--mmk-cyan);
        }
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  project?: Project;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.project = PROJECTS_DATA.find(p => p.slug === slug) || PROJECTS_DATA[0];
      if (this.project) {
        this.seoService.updateSeo(`${this.project.title} | Case Study`, this.project.summary);
      }
    });
  }
}
