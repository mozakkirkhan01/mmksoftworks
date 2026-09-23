import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private seoService = inject(SeoService);

  applicationForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{10,15}$/)]],
    position: ['', Validators.required],
    experienceYears: ['', Validators.required],
    portfolioUrl: [''],
    coverLetter: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  culturePerks = [
    {
      title: 'Real Business Impact',
      desc: 'Build custom ERP platforms and automation software that power the daily operations of real enterprises.'
    },
    {
      title: 'Modern Engineering Stack',
      desc: 'Work with Angular 21, TypeScript, SCSS, GSAP, ASP.NET Core, C#, and Microsoft SQL Server.'
    },
    {
      title: 'Architect Mentorship',
      desc: 'Learn directly from senior frontend architects and database engineers handling high-concurrency systems.'
    },
    {
      title: 'Competitive Compensation',
      desc: 'Industry-standard salaries, performance-based project bonuses, and clear career progression milestones.'
    }
  ];

  openings = [
    {
      id: 'frontend-angular',
      title: 'Senior Angular / Frontend Engineer',
      type: 'Full-Time',
      location: 'India (On-Site / Hybrid)',
      experience: '2 - 5 Years',
      description: 'We are looking for an experienced Angular developer with strong skills in TypeScript, SCSS, RxJS, and GSAP animations to build high-speed corporate web applications.',
      requirements: [
        'Strong expertise in Angular 17+ / 21+ Standalone Components',
        'Proficiency in TypeScript, HTML5, SCSS, and CSS variables design systems',
        'Experience integrating GSAP, Lenis, or custom animation libraries',
        'Familiarity with REST APIs and state management patterns'
      ]
    },
    {
      id: 'backend-dotnet',
      title: 'ASP.NET Core & C# Backend Developer',
      type: 'Full-Time',
      location: 'India (On-Site / Hybrid)',
      experience: '2 - 5 Years',
      description: 'Architect secure RESTful Web APIs, business logic microservices, and high-performance SQL query procedures for custom ERP systems.',
      requirements: [
        'Hands-on experience with ASP.NET Core API, C#, and Entity Framework / LINQ',
        'Deep understanding of MS SQL Server database design and stored procedure tuning',
        'Experience integrating third-party APIs (Payment Gateways, Meta WhatsApp API, SMS)',
        'Knowledge of clean architecture and dependency injection patterns'
      ]
    },
    {
      id: 'fullstack-erp',
      title: 'Full-Stack ERP Developer',
      type: 'Full-Time',
      location: 'India (On-Site)',
      experience: '3 - 6 Years',
      description: 'Lead end-to-end development of domain-specific ERP modules for School, Travel, Retail, Healthcare, and Cooperative Society platforms.',
      requirements: [
        'Proficiency across Angular frontend and .NET Core C# backend',
        'Experience modeling complex financial and inventory relational databases',
        'Ability to translate real business workflows into software modules'
      ]
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer & Frontend Specialist',
      type: 'Full-Time / Contract',
      location: 'India (Remote / Hybrid)',
      experience: '1 - 4 Years',
      description: 'Design intuitive, modern, enterprise SaaS web interfaces, interactive design prototypes, and resolution-independent SVG assets.',
      requirements: [
        'Expertise in Figma, Adobe Creative Suite, and web design systems',
        'Strong sense of editorial typography, whitespace, and microinteractions',
        'Understanding of modern responsive layout boundaries and HTML/SCSS constraints'
      ]
    }
  ];

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Careers & Job Opportunities | MMK Softworks',
      'Join MMK Softworks. Explore career opportunities for Angular developers, .NET backend engineers, and UI/UX designers.'
    );
  }

  onSubmitApplication(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.applicationForm.reset();
    }, 1200);
  }
}
