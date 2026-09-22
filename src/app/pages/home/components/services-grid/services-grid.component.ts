import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SERVICES_DATA } from '../../../../shared/data/services.data';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-grid.component.html',
  styleUrl: './services-grid.component.scss'
})
export class HomeServicesComponent {
  services = SERVICES_DATA;
}
