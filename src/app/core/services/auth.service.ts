import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { APP_APIS } from './config.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private _httpClient: HttpClient, private _router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(<string>localStorage.getItem('currentUser'))
    );
   
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.checkExpiredToken()) {
      localStorage.clear();
      this._router.navigate(['/auth/login']);
    }
  }

  public get currentUserValue(): User {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(<string>localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value;
  }

  /**
   * get role user
  */
  public get getRoleUser() {
    return this.currentUserValue.role;
  }

  /**
   * login
   * @param jsonData
   * @return Observable
   */
  login(jsonData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['1.1'], jsonData).pipe(
      map((res) => {        
        if (res.isError) {
          throw new Error('ゲートウェイユーザーはログインできません！');
        } else {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.currentUserSubject.next(res);
          console.log(res);
          
          return res.data;
        }
      })
    );
  }

  /**
   * logout
   * @return Observable
   */
  logout(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['1.2']).pipe(
      map((res) => {
        localStorage.clear();
        this._router.navigate(['/auth/login']);
        this.currentUserSubject.next(res);
        return res;
      })
    );
  }

  /**
   * isValidLogin
   */
  isValidLogin(): boolean {    
    if (this.currentUserValue && this.currentUserValue.token) {
      if (this.checkExpiredToken()) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * checkExpiredToken
   */
  checkExpiredToken(): boolean {
    if (
      this.currentUserValue &&
      this.currentUserValue.token &&
      this.currentUserValue.expiredAt
    ) {
      if (this.currentUserValue.expiredAt < new Date()) {
        return true;
      }
    }
    return false;
  }
}
