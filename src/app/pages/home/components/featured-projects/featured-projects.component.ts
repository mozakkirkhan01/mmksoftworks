import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROJECTS_DATA } from '../../../../shared/data/projects.data';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.scss'
})
export class FeaturedProjectsComponent {
  projects = PROJECTS_DATA;
}
