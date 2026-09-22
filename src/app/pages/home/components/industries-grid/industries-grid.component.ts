import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { INDUSTRIES_DATA } from '../../../../shared/data/industries.data';

@Component({
  selector: 'app-home-industries',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './industries-grid.component.html',
  styleUrl: './industries-grid.component.scss'
})
export class HomeIndustriesComponent {
  industries = INDUSTRIES_DATA;
}
