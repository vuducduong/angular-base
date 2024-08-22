import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import Form, Flex
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Component
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { PipeModule } from '../../core/helpers';
import { IconModule } from '../../core/libraries';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    IconModule,
    InputMaskModule,
    InputTextModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
