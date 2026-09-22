import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor.component';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CustomCursorComponent],
  template: `
    <app-custom-cursor></app-custom-cursor>
    <app-navbar></app-navbar>
    <main class="mmk-main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .mmk-main-content {
      min-height: calc(100vh - 300px);
      position: relative;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private smoothScroll = inject(SmoothScrollService);

  ngOnInit(): void {
    this.smoothScroll.initSmoothScroll();
  }

  ngOnDestroy(): void {
    this.smoothScroll.destroy();
  }
}
