import { ApplicationConfig, importProvidersFrom, Provider } from '@angular/core';
import { provideRouter, RouterModule, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInterceptorHttp } from './utils/custom-interceptor-http';


export const COMMON_IMPORTS = [
  CommonModule,
  RouterModule,
  FormsModule
];


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
    ),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptorHttp,
      multi: true
    },
    
  ]
};