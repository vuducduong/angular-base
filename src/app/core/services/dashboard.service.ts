import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * get data dashboard by name field
   * @param nameField
   */
  getDataChart(nameField: any): Observable<any> {
    let url = `${APP_APIS['7.1']}?name=${nameField}`;
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * get data api
   */
  getDataApi(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['7.2']).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }
}
