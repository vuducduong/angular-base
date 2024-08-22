import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// Material
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Other
import {SearchDialogComponent} from './search-dialog.component';

@NgModule({
  declarations: [
    SearchDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SearchDialogComponent
  ],
})

export class SearchDialogModule {

}
