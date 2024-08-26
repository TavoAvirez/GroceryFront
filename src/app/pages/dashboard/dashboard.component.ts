import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { COMMON_IMPORTS } from '../../app.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './dashboard.component.html',

})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
