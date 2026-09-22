import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="trust-section">
      <div class="mmk-container">
        <p class="trust-title">Software built for real businesses across key industries</p>
        <div class="ticker-wrapper">
          <div class="ticker-track">
            <div *ngFor="let item of categoriesConcat" class="ticker-item">
              <span class="ticker-dot"></span>
              <span class="ticker-text">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .trust-section {
      padding: 40px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(4, 17, 29, 0.5);
      overflow: hidden;
    }

    .trust-title {
      text-align: center;
      font-family: var(--font-code);
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--mmk-muted-light);
      margin-bottom: 1.5rem;
    }

    .ticker-wrapper {
      display: flex;
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
    }

    .ticker-track {
      display: flex;
      align-items: center;
      gap: 3rem;
      white-space: nowrap;
      animation: tickerScroll 30s linear infinite;
    }

    .ticker-item {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;

      .ticker-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--mmk-cyan);
      }

      .ticker-text {
        font-family: var(--font-heading);
        font-size: 1.1rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.7);
        letter-spacing: 0.02em;
      }
    }

    @keyframes tickerScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `]
})
export class TrustStripComponent {
  categories = ['Education', 'Travel & Tourism', 'Retail & Wholesale', 'Healthcare & Clinics', 'Cooperative Societies', 'Service SMEs'];
  categoriesConcat = [...this.categories, ...this.categories, ...this.categories];
}
