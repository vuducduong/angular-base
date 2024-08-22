import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { AuthService, CheckRoleService, UserService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  loader: boolean = false;
  private completeGetRole$: Subject<boolean> = new Subject<boolean>;
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _httpClient: HttpClient,
    private _primeNGConfig: PrimeNGConfig,
    private _checkRoleService: CheckRoleService,
    private _authService: AuthService,
    private _userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.configLanguageJa();
    this.getRole();
  }

  /**
   * get role
   */
  getRole() {
    if (this._authService.isValidLogin()) {
      this.loader = true;
      this._userService.getRole().subscribe(res => {
          this._checkRoleService.set(res);
          this.completeGetRole$.next(true);
          this._checkRoleService.setAppLoaded();
          this.loader = false;
        }
      );
    }
  }

  /**
   * set language ja for calender
   */
  configLanguageJa() {
    var location = this._document.location.origin;
    return this._httpClient.get<any>(location + '/assets/config-lang-ja.json')
      .toPromise()
      .then(
        (response: any) => {
          this._primeNGConfig.setTranslation(response)
        }
      )
      .catch(
        (error: any) => {
          return Promise.reject(error);
        }
      );
  }
}
