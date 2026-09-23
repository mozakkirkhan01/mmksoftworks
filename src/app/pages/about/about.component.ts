import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mmk-section inner-page-hero">
      <div class="mmk-container text-center">
        <span class="eyebrow">ABOUT MMK SOFTWORKS</span>
        <h1 class="hero-title">
          Engineering technology for <br>
          <span class="brand-gradient-text">India's growing enterprises.</span>
        </h1>
        <p class="section-subtitle mx-auto">
          We combine deep business workflow analysis, modern web engineering, and enterprise database architecture to build software that accelerates business growth.
        </p>
      </div>
    </section>

    <section class="mmk-section inner-content">
      <div class="mmk-container">
        <div class="about-story-grid">
          <div class="story-card mmk-glass-card">
            <h3>Who We Are</h3>
            <p>
              MMK Softworks is an Indian software development company founded with a single mission: to build custom software tailored precisely to how real businesses actually operate.
            </p>
          </div>

          <div class="story-card mmk-glass-card">
            <h3>Our Core Philosophy</h3>
            <p>
              We believe business software shouldn't require complex workarounds or bloated manual steps. Our mantra—<strong>Ideas → Code → Impact</strong>—drives every line of code we write.
            </p>
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

    .about-story-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .story-card {
      padding: 3rem;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.6rem;
        color: var(--mmk-white);
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        color: var(--mmk-muted-light);
        line-height: 1.7;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo('Company & Ethos', 'Learn about MMK Softworks, our team, mission, and enterprise software engineering values.');
  }
}
