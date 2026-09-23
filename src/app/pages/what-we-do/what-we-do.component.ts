import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './what-we-do.component.html',
  styleUrl: './what-we-do.component.scss'
})
export class WhatWeDoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ecosystemRef', { static: false }) ecosystemRef?: ElementRef<HTMLElement>;

  private animationService = inject(AnimationService);
  private seoService = inject(SeoService);
  private ctx?: gsap.Context;

  nodes = [
    { title: 'School ERP', id: 'school', x: 250, y: -120 },
    { title: 'Travel ERP', id: 'travel', x: -280, y: 0 },
    { title: 'Retail ERP', id: 'retail', x: 280, y: 0 },
    { title: 'Hospital ERP', id: 'hospital', x: -210, y: 140 },
    { title: 'Cooperative ERP', id: 'cooperative', x: 210, y: 140 },
    { title: 'Business Automation', id: 'automation', x: 0, y: 210 }
  ];

  whyChooseUs = [
    {
      num: '01',
      title: '100% Fully Customized',
      desc: 'Software designed specifically around how your company actually operates, eliminating bloated features and manual workarounds.'
    },
    {
      num: '02',
      title: 'Scalable Enterprise Architecture',
      desc: 'Built using Angular 21, ASP.NET Core, and Microsoft SQL Server to support seamless expansion across thousands of concurrent users.'
    },
    {
      num: '03',
      title: 'Secure & Compliant by Design',
      desc: 'Granular role-based permissions, encrypted data transactions, and compliance with Indian business standards (GST, RCS, E-Invoicing).'
    },
    {
      num: '04',
      title: 'Modern Intuitive Experience',
      desc: 'Fast, responsive, single-page application interfaces built for high daily user productivity on desktop, tablet, and mobile.'
    },
    {
      num: '05',
      title: 'Automation First Methodology',
      desc: 'Instant WhatsApp/SMS alerts, payment gateway integrations, and automated scheduled EOD reporting.'
    },
    {
      num: '06',
      title: 'Dedicated Long-Term SLA Support',
      desc: 'Continuous technical monitoring, periodic automated backups, database tuning, and ongoing feature updates.'
    }
  ];

  offerings = [
    {
      title: 'Custom ERP Development',
      desc: 'Purpose-built ERP systems for schools, travel agencies, retail stores, healthcare clinics, and credit cooperative societies.'
    },
    {
      title: 'Business Automation',
      desc: 'Automate repetitive workflows, invoice receipts, WhatsApp updates, payment links, and scheduled operational reports.'
    },
    {
      title: 'Modern Web Applications & Portals',
      desc: 'High-speed single page web applications, customer self-service portals, and executive management dashboards.'
    },
    {
      title: 'API & System Integration',
      desc: 'Seamlessly bridge your software with Razorpay, Meta WhatsApp API, SMS Gateways, Tally accounting, and cloud APIs.'
    },
    {
      title: 'Reporting & Analytics Engine',
      desc: 'Transform raw database transactions into clear real-time executive charts, profit margin analytics, and printable PDF statements.'
    },
    {
      title: 'Maintenance & Technical Support',
      desc: 'Proactive server management, SQL database query optimization, security patching, and ongoing software enhancements.'
    }
  ];

  ngAfterViewInit(): void {
    if (this.ecosystemRef) {
      this.ctx = this.animationService.createContext(this.ecosystemRef, () => {
        gsap.set('.connection-path', { strokeDasharray: 400, strokeDashoffset: 400 });
        gsap.to('.connection-path', { strokeDashoffset: 0, duration: 1.5, stagger: 0.1, ease: 'power2.out' });
        gsap.to('.erp-node-item', { y: '+=6', duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2 });
      });
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.ecosystemRef) return;
    const rect = this.ecosystemRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to('.wwd-ecosystem-visual', {
      rotationY: relX * 10,
      rotationX: -relY * 10,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  ngOnInit(): void {
    this.seoService.updateSeo(
      'What We Do | MMK Softworks',
      'Discover what MMK Softworks does: Introduction, Animated Software Ecosystem, Vision & Mission, Why Choose Us, and Core Offerings.'
    );
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
