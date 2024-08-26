import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { COMMON_IMPORTS } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TiendaFront';
  
}
