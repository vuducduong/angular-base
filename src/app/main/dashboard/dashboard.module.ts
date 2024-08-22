import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { PipeModule } from '../../core/helpers';
import { TagModule } from 'primeng/tag';
import { IconModule } from '../../core/libraries';

@NgModule({
  declarations: [
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    PipeModule,
    TagModule,
    IconModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule { }
