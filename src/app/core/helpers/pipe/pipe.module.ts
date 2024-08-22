import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JapaneseTranslatePipe } from './translate.pipe';
import { TruncatePipe } from './text-truncate.pipe';
import { RolePipe } from './role.pipe';

@NgModule({
  declarations: [
    JapaneseTranslatePipe,
    TruncatePipe,
    RolePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JapaneseTranslatePipe,
    TruncatePipe,
    RolePipe
  ]
})
export class PipeModule { }
