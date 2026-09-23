import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<Theme>('dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('mmk_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.setTheme(savedTheme);
    } else {
      // Default theme is dark
      this.setTheme('dark');
    }
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mmk_theme', theme);
      const bodyEl = document.body;
      const htmlEl = document.documentElement;

      if (theme === 'light') {
        bodyEl.classList.remove('mmk-dark-theme');
        bodyEl.classList.add('mmk-light-theme');
        htmlEl.classList.remove('mmk-dark-theme');
        htmlEl.classList.add('mmk-light-theme');
      } else {
        bodyEl.classList.remove('mmk-light-theme');
        bodyEl.classList.add('mmk-dark-theme');
        htmlEl.classList.remove('mmk-light-theme');
        htmlEl.classList.add('mmk-dark-theme');
      }
    }
  }
}
