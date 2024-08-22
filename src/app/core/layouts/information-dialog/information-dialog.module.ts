import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material

// Other
import { InformationDialogComponent } from './information-dialog.component';

@NgModule({
	declarations: [
		InformationDialogComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		InformationDialogComponent
	]
})

export class InformationDialogModule { }
