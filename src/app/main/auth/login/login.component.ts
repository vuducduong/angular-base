import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, CheckRoleService, LicenseService } from "../../../core/services";
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from "../../../core/layouts";
import { getTranslation } from '../../../core/helpers/pipe';
import { LicenseCodeEnum } from '../../../core/helpers/enum';
import { Subscription } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  returnUrl = '/dashboard';
  copyRight: string = '';
  loader: boolean = false;
  subscribeArr: Subscription[] = [];
  keyFormUsername: string = 'username';
  keyFormPassword: string = 'password';


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _licenseService: LicenseService,
    private _checkRoleService: CheckRoleService,
  ) {
    this.copyRight = getTranslation('copy_right').replace('YYYY', moment().format('YYYY'));
  }

  ngOnInit(): void {
    this.checkLicense();
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9@_.-]+$/)]]
    });
    if (this._activatedRoute.snapshot.queryParamMap.get('returnUrl')) {
      this.returnUrl = <string>this._activatedRoute.snapshot.queryParamMap.get('returnUrl');
    }
  }

     /**
   * Handles the change event of a form input field.
   *
   * @param {string} inputName - The name of the input field.
   * @param {any} event - The event object triggered by the input change.
   * @return {void}
   */
     onInputChange(inputName: string, event: any) {
      const inputValue = event.target.value.trim();
      this.loginForm.get(inputName)?.setValue(inputValue, { emitEvent: false });
    }
  

  /**
   * handle login
   */
  onSubmit(): void {
    this.loader = true;
    let username = this.loginForm.get(this.keyFormUsername)?.value;
    let password = this.loginForm.get(this.keyFormPassword)?.value;

    const jsonData = {
      username: username.trim(),
      password: password.trim()
    };

    const subscription = this._authService.login(jsonData).subscribe(
      res => {
        this._checkRoleService.set(res.role);
        this.loader = false;
        this._router.navigate([this.returnUrl]);
      },
      error => {
        this.loader = false;
        this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
      }
    );
    this.subscribeArr.push(subscription);
  }

  /**
   * check license
   */
  checkLicense(): void {
    this._licenseService.checkLicense().subscribe(res => {
      switch (res.data) {
        case LicenseCodeEnum.DURING:
        case LicenseCodeEnum.API_ERROR:
          break;
        case LicenseCodeEnum.AFTER:
        case LicenseCodeEnum.BEFORE:
        case LicenseCodeEnum.NOT_FOUND:
        case LicenseCodeEnum.LICENSE_NULL:
          this.alertMessage(res.message);
          this.navigateLicense();
          break;
      }
    }, error => {

    })
  }

  /**
   * navigate license
   * @returns void
   */
  navigateLicense(): void {
    this._router.navigate(['/auth/license']);
  }

  /**
   * alert message
   * @param message
   * @returns void
   */
  alertMessage(message: string): void {
    this._matDialog.open(AlertDialogComponent).componentInstance.message = message;
  }

  /**
   * cleanup subscriptions
   */
  cleanupSubscriptions() {
    this.subscribeArr.forEach((subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.subscribeArr = [];
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }
}
