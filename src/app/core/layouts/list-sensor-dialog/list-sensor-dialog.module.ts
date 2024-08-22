import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSensorDialogComponent } from './list-sensor-dialog/list-sensor-dialog.component';
import { PipeModule } from '../../helpers';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    ListSensorDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipeModule,
    InputTextModule,
  ]
})
export class ListSensorDialogModule { }
