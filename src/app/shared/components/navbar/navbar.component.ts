import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { SOLUTIONS_DATA } from '../../data/solutions.data';
import { INDUSTRIES_DATA } from '../../data/industries.data';
import { SERVICES_DATA } from '../../data/services.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private smoothScroll = inject(SmoothScrollService);
  
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  activeDropdown = signal<string | null>(null);

  solutions = SOLUTIONS_DATA;
  industries = INDUSTRIES_DATA;
  services = SERVICES_DATA;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 30);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.activeDropdown.set(null);
  }

  openDropdown(name: string) {
    this.activeDropdown.set(name);
  }

  closeDropdown() {
    this.activeDropdown.set(null);
  }

  toggleDropdown(name: string) {
    this.activeDropdown.update(curr => curr === name ? null : name);
  }

  scrollToContact() {
    this.closeMobileMenu();
    this.smoothScroll.scrollTo('#contact-section');
  }
}
