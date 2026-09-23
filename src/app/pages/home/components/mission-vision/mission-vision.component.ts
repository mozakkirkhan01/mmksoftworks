import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission-vision',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mmk-section mission-section">
      <div class="mmk-container">
        <div class="mission-grid">
          <div class="mission-box mmk-glass-card">
            <span class="eyebrow">OUR MISSION</span>
            <h3 class="mission-title">
              To empower businesses with <span class="gradient-text">simple, powerful, and affordable</span> software solutions that improve productivity and accelerate digital transformation.
            </h3>
          </div>

          <div class="vision-box mmk-glass-card">
            <span class="eyebrow">OUR VISION</span>
            <h3 class="vision-title">
              To become a trusted software company delivering <span class="brand-gradient-text">innovative ERP and business automation</span> solutions across India.
            </h3>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .mission-section {
      background-color: var(--mmk-bg-primary);
      padding: 100px 0;
    }

    .mission-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .mission-box, .vision-box {
      padding: 3.5rem 3rem;
      display: flex;
      flex-direction: column;

      .mission-title, .vision-title {
        font-family: var(--font-heading);
        font-size: clamp(1.4rem, 2vw + 0.5rem, 2rem);
        font-weight: 600;
        line-height: 1.4;
        color: var(--mmk-white);
        margin-top: 1.25rem;
      }
    }
  `]
})
export class MissionVisionComponent {}
