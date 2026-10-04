import { Component, OnInit, OnDestroy, signal, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { ThemeService } from '../../../core/services/theme.service';
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
export class NavbarComponent implements OnInit, OnDestroy {
  private smoothScroll = inject(SmoothScrollService);
  private ngZone = inject(NgZone);
  themeService = inject(ThemeService);
  
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  activeDropdown = signal<string | null>(null);

  solutions = SOLUTIONS_DATA;
  industries = INDUSTRIES_DATA;
  services = SERVICES_DATA;

  private scrollHandler?: () => void;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.scrollHandler = () => {
      // Separate enter/exit thresholds avoid toggling on tiny scroll reversals.
      const scrolled = this.isScrolled() ? window.scrollY > 8 : window.scrollY > 48;
      if (scrolled !== this.isScrolled()) {
        this.ngZone.run(() => {
          this.isScrolled.set(scrolled);
        });
      }
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollHandler!, { passive: true });
      this.scrollHandler!();
    });
  }

  ngOnDestroy(): void {
    if (this.scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
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
