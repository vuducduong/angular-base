import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-information-dialog',
    templateUrl: './information-dialog.component.html',
    styleUrls: ['./information-dialog.component.scss']
})

export class InformationDialogComponent implements OnInit {

    message = '';
    dataDialog: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialogRef: MatDialogRef<InformationDialogComponent>
    ) {
        this.dataDialog = data;
    }

    ngOnInit(): void {
        if (this.dataDialog) {
            this.message = this.dataDialog.message || this.message;
        }
    }
}
