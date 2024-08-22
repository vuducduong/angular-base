import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private _httpClient: HttpClient
  ) {

  }

  /**
   * export Radio
   * @param data
   */
  exportRadio(data: any): Observable<any> {
    let url = APP_APIS['6.1'];
    return this._httpClient.post(url, data, { responseType: 'blob', observe: 'response' }).pipe(
      map(
        (res: HttpResponse<Blob>) => {      
          return res.body;
        })
    );
  }

  /**
   * export Sensors
   * @param data
   */
  exportSensors(data: any): Observable<any> {
    let url = APP_APIS['6.2'];
    return this._httpClient.post(url, data, { responseType: 'blob', observe: 'response' }).pipe(
      map(
        (res: HttpResponse<Blob>) => {
          return res.body;
        })
    );
  }
}
