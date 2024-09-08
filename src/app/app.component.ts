import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { COMMON_IMPORTS } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptorHttp } from './utils/custom-interceptor-http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [...COMMON_IMPORTS,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptorHttp,
      multi: true
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TiendaFront';
  
}
