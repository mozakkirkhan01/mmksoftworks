import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContactFormData {
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  submitContactForm(formData: ContactFormData): Observable<{ success: boolean; message: string }> {
    // Simulated API response for contact form submission
    console.log('MMK Softworks Contact Inquiry Submitted:', formData);
    return of({
      success: true,
      message: 'Thank you for contacting MMK Softworks! Our software team will reach out to you within 24 hours.'
    }).pipe(delay(1200));
  }
}
