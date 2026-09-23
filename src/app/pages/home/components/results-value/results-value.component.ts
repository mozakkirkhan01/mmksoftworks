import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-value',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mmk-section value-section">
      <div class="mmk-container">
        <div class="value-header text-center">
          <span class="eyebrow">MEASURABLE VALUE</span>
          <h2 class="section-title">
            Tangible outcomes for <br>
            <span class="brand-gradient-text">every operational tier.</span>
          </h2>
        </div>

        <div class="value-grid">
          <div *ngFor="let val of capabilities" class="value-card mmk-glass-card">
            <div class="val-header-tag">{{ val.badge }}</div>
            <h3 class="val-title">{{ val.title }}</h3>
            <p class="val-desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .value-section {
      background-color: var(--mmk-bg-primary);
    }

    .value-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 4rem;

      .eyebrow {
        justify-content: center;
      }
    }

    .value-grid {
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

    .value-card {
      padding: 2.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      text-align: center;

      .val-header-tag {
        font-family: var(--font-code);
        font-size: 0.725rem;
        letter-spacing: 0.15em;
        color: var(--mmk-cyan);
        margin-bottom: 1rem;
      }

      .val-title {
        font-family: var(--font-heading);
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--mmk-white);
        margin-bottom: 0.75rem;
      }

      .val-desc {
        font-size: 0.9rem;
        color: var(--mmk-muted-light);
        line-height: 1.6;
      }
    }
  `]
})
export class ResultsValueComponent {
  capabilities = [
    { badge: 'ONE PLATFORM', title: 'Unified Ecosystem', desc: 'Connect isolated operations, financial reporting, and departmental workflows into one platform.' },
    { badge: 'LESS MANUAL WORK', title: 'Workflow Automation', desc: 'Automate repetitive administrative tasks, fee billing reminders, and EOD reconciliations.' },
    { badge: 'BETTER VISIBILITY', title: 'Real-Time Insights', desc: 'Transform raw operational transactions into instant executive dashboards and reports.' },
    { badge: 'BUILT TO SCALE', title: 'Future-Ready Architecture', desc: 'Add new modules, additional branches, and custom features as your organization grows.' }
  ];
}
