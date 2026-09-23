import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'About Us — MMK Softworks',
      'Meet the founders Modassir Khan & Mozakkir Khan. Building custom ERP solutions, enterprise web applications, and AI-powered business automation in Bokaro Steel City, Jharkhand.'
    );
  }
}
