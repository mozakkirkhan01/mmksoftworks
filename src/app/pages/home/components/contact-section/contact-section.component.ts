import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  contactForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    companyName: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{10,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    interest: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);
  submitSuccessMessage = signal<string | null>(null);

  interests = [
    'Custom ERP',
    'School ERP',
    'Travel ERP',
    'Retail ERP',
    'Hospital ERP',
    'Cooperative ERP',
    'Web Application',
    'Business Automation',
    'Other'
  ];

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccessMessage.set(null);

    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.submitSuccessMessage.set(res.message);
          this.contactForm.reset();
        }
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
