import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'what-we-do',
    loadComponent: () => import('./pages/what-we-do/what-we-do.component').then(m => m.WhatWeDoComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'career',
    loadComponent: () => import('./pages/career/career.component').then(m => m.CareerComponent)
  },
  {
    path: 'solutions',
    loadComponent: () => import('./pages/solutions/solutions.component').then(m => m.SolutionsComponent)
  },
  {
    path: 'solutions/:slug',
    loadComponent: () => import('./pages/solutions/solution-detail/solution-detail.component').then(m => m.SolutionDetailComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'industries',
    loadComponent: () => import('./pages/industries/industries.component').then(m => m.IndustriesComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'technology',
    loadComponent: () => import('./pages/technology/technology.component').then(m => m.TechnologyComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
