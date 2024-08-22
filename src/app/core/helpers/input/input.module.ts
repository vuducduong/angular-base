import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputOnlyNumberDirective } from './input-only-number.directive';
import { InputPhoneNumberDirective } from './input-phone-number.directive';

@NgModule({
  declarations: [
    InputOnlyNumberDirective,
    InputPhoneNumberDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InputOnlyNumberDirective,
    InputPhoneNumberDirective
  ]
})
export class InputModule { }
