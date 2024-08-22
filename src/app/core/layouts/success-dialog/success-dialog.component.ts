import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-success-dialog',
    templateUrl: './success-dialog.component.html',
    styleUrls: ['./success-dialog.component.scss']
})

export class SuccessDialogComponent implements OnInit {
    title = '成功';
    message = '';
    dataDialog: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialogRef: MatDialogRef<SuccessDialogComponent>
    ) {
        this.dataDialog = data;
    }

    ngOnInit(): void {
        if (this.dataDialog) {
            this.message = this.dataDialog.message || this.message;
        }
    }
}
