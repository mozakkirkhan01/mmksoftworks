import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';

import { HomeHeroComponent } from './components/hero/hero.component';
import { TrustStripComponent } from './components/trust-strip/trust-strip.component';
import { ProblemStoryComponent } from './components/problem-story/problem-story.component';
import { ErpEcosystemComponent } from './components/erp-ecosystem/erp-ecosystem.component';
import { HomeWorkflowComponent } from './components/workflow/workflow.component';
import { HomeServicesComponent } from './components/services-grid/services-grid.component';
import { TechArchitectureComponent } from './components/tech-architecture/tech-architecture.component';
import { HomeIndustriesComponent } from './components/industries-grid/industries-grid.component';
import { WhyMmkComponent } from './components/why-mmk/why-mmk.component';
import { ResultsValueComponent } from './components/results-value/results-value.component';
import { FeaturedProjectsComponent } from './components/featured-projects/featured-projects.component';
import { MissionVisionComponent } from './components/mission-vision/mission-vision.component';
import { FinalCtaComponent } from './components/final-cta/final-cta.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    TrustStripComponent,
    ProblemStoryComponent,
    ErpEcosystemComponent,
    HomeWorkflowComponent,
    HomeServicesComponent,
    TechArchitectureComponent,
    HomeIndustriesComponent,
    WhyMmkComponent,
    ResultsValueComponent,
    FeaturedProjectsComponent,
    MissionVisionComponent,
    FinalCtaComponent,
    ContactSectionComponent
  ],
  template: `
    <app-home-hero></app-home-hero>
    <app-trust-strip></app-trust-strip>
    <app-problem-story></app-problem-story>
    <app-erp-ecosystem></app-erp-ecosystem>
    <app-home-workflow></app-home-workflow>
    <app-home-services></app-home-services>
    <app-tech-architecture></app-tech-architecture>
    <app-home-industries></app-home-industries>
    <app-why-mmk></app-why-mmk>
    <app-results-value></app-results-value>
    <app-featured-projects></app-featured-projects>
    <app-mission-vision></app-mission-vision>
    <app-final-cta></app-final-cta>
    <app-contact-section></app-contact-section>
  `
})
export class HomeComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'MMK Softworks | Custom ERP & Business Automation Solutions',
      'MMK Softworks builds custom ERP systems, business automation software and modern web applications for growing businesses across India. Ideas → Code → Impact.'
    );
  }
}
