import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSectionComponent } from '../home/components/contact-section/contact-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ContactSectionComponent],
  template: `
    <div class="inner-contact-wrapper">
      <app-contact-section></app-contact-section>
    </div>
  `,
  styles: [`
    .inner-contact-wrapper {
      padding-top: 80px;
    }
  `]
})
export class ContactPageComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo('Contact Us | MMK Softworks', 'Get in touch with MMK Softworks for custom ERP development and business automation inquiries.');
  }
}
