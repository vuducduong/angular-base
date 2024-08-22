import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import { getTranslation } from './pipe';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const users = this._authService.currentUserValue;
    if (users && users.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${users.token}`,
        },
      });
    }

    // Only intercept for API request
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error) => {
        let errorMessage = '';
        let resErrorMsg: Array<string> = [];

        if (error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error?.message}`;
        }

        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 0:
              errorMessage = `${error.status}: ${getTranslation('server_connection_lost')}`;
              resErrorMsg.unshift(errorMessage);
              break;
            case 400:    
            if (error.error && error.error.errorDetails) {
                let listObjectError = error.error.errorDetails;  
                if(typeof(listObjectError) == "string") {
                  resErrorMsg.push(listObjectError);
                }    
                for (let key in listObjectError) {  
                  if (listObjectError[key].errors && listObjectError[key].errors.length > 0) {
                      for (let i = 0; i < listObjectError[key].errors.length; i++) {
                          let errorMessage = listObjectError[key].errors[i].errorMessage;
                          resErrorMsg.push(errorMessage);
                      }
                  }
              }
                break;
              }

              if (error.error.message) {
                resErrorMsg.push(error.error.message);
                break;
              }

              if (error.error.errorMessage) {
                resErrorMsg.push(error.error.errorMessage);
                break;
              }

              // Show error default with status 400
              errorMessage = `${error.status}: ${getTranslation('invalid_data')}`;
              resErrorMsg.unshift(errorMessage);
              break;
            case 401:
              localStorage.clear();
              this._router.navigate(["/auth/login"])
              break;
            case 403:
              errorMessage = `${error.status}: ${getTranslation('access_is_not_permitted')}`;
              resErrorMsg.unshift(errorMessage);
              this._router.navigate(['/authentication'], { queryParams: { message: errorMessage } })
              break;
            case 404:
              if (this._authService.checkExpiredToken()) {
                localStorage.clear();
                this._router.navigate(["/auth/login"])
                break;
              }
              if (error.error.errorMessage) {
                resErrorMsg.push(error.error.errorMessage);
                break;
              }
              this._router.navigate(['/not-found'])
              break;
            case 409:
              if (error.error.errorMessage) {
                resErrorMsg.push(error.error.errorMessage);
                break;
              }
              errorMessage = `${error.status}: ${getTranslation('conflict')}`;
              resErrorMsg.unshift(errorMessage);
              break;
            case 500:
              errorMessage = `${error.status}: ${getTranslation('internal_server_error')}`;
              resErrorMsg.unshift(errorMessage);

              if (!error.error) {
                break;
              }
              if (!error.error.errorMessage) {
                break;
              }
              errorMessage = `${error.status}: ${error.error.errorMessage}`;
              break;
            case 503:
              errorMessage = `${error.status}: ${getTranslation('service_unavailable')}`;
              resErrorMsg.unshift(errorMessage);
              localStorage.clear();
              this._router.navigate(["/auth/license"])
              break;
            default:
              errorMessage = `${error.status}: ${getTranslation('unknown_error')}`;
              resErrorMsg.unshift(errorMessage);
              break;
          }
        }
        return throwError(resErrorMsg);
      })
    );
  }
}
