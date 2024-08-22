import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * check license
   */
  checkLicense(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['9.1']).pipe(
      map(
        res => {
          return res;
        }
      ),
    );
  }

  /**
   * import license
   * @param formData
   */
  importLicense(formData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['9.2'], formData).pipe(
      map(
        res => {
          return res;
        }
      ),
    );
  }
}
