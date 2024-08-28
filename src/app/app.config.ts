import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouterModule, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export const COMMON_IMPORTS = [
  CommonModule,
  RouterModule,
  FormsModule
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};