import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material
// Other
import { AlertDialogComponent } from './alert-dialog.component';

@NgModule({
	declarations: [
		AlertDialogComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		AlertDialogComponent
	],
})

export class AlertDialogModule { }
