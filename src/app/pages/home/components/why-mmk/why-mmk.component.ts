import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-mmk',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-mmk.component.html',
  styleUrl: './why-mmk.component.scss'
})
export class WhyMmkComponent {
  benefits = [
    { num: '01', title: 'Fully Customized', desc: 'Software engineered specifically around your established operational workflow.' },
    { num: '02', title: 'Scalable Architecture', desc: 'Built to support your business expansion from 10 to 10,000 users seamlessly.' },
    { num: '03', title: 'Secure by Design', desc: 'Structured APIs, granular role-based permissions, and encrypted database design.' },
    { num: '04', title: 'Modern Experience', desc: 'Lightning-fast, responsive, intuitive single-page interfaces for desktop & mobile.' },
    { num: '05', title: 'Automation First', desc: 'Eliminate repetitive manual data entry with automated notification triggers.' },
    { num: '06', title: 'Long-Term Support', desc: 'Dedicated SLA support, database tuning, and continuous software evolution.' }
  ];
}
