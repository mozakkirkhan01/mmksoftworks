import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-heading-wrapper" [class.center]="align === 'center'">
      <span *ngIf="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h2 class="section-title" [innerHTML]="title"></h2>
      <p *ngIf="description" class="section-subtitle" [innerHTML]="description"></p>
    </div>
  `,
  styles: [`
    .section-heading-wrapper {
      margin-bottom: 3.5rem;
      max-width: 800px;

      &.center {
        margin-left: auto;
        margin-right: auto;
        text-align: center;

        .eyebrow {
          justify-content: center;
        }

        .section-subtitle {
          margin-left: auto;
          margin-right: auto;
        }
      }
    }

    .section-title {
      margin-top: 0.5rem;
      margin-bottom: 1.25rem;
    }
  `]
})
export class SectionHeadingComponent {
  @Input() eyebrow?: string;
  @Input() title!: string;
  @Input() description?: string;
  @Input() align: 'left' | 'center' = 'left';
}
