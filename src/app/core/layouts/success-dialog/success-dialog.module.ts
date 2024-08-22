import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material
// Other
import { SuccessDialogComponent } from './success-dialog.component';

@NgModule({
	declarations: [
		SuccessDialogComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		SuccessDialogComponent
	]
})

export class SuccessDialogModule { }
