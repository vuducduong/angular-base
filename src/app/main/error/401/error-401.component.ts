import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from "../../../core/layouts";

@Component({
  selector: 'error-401',
  templateUrl: './error-401.component.html',
  styleUrls: ['./error-401.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Error401Component implements OnInit {
  messageError: string = '401: 無許可.';
  message: any;
  constructor(
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    if (this._route.snapshot.queryParams['message']) {
      this.messageError = this._route.snapshot.queryParams['message'];
    }
  }

  logout(): void {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
    this._matDialog.open(SuccessDialogComponent).componentInstance.message = '正常にログアウトしました';
  }
}
