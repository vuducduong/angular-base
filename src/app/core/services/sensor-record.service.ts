import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SensorRecordService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
    * Get data info sensor record
    * @param id
    */
  getDataSensorRecord(id: any): Observable<any> {
    let url = APP_APIS['5.7'].replace("{id}", id);
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
    * Get data chart
    * @param id
    * @param nameChart
    */
  getDataChartSensor(id: any, nameChart: any, data: any): Observable<any> {
    let url = APP_APIS['5.1'].replace("{id}", id).replace("{nameChart}", nameChart);
    return this._httpClient.get<any>(url, {
      params: data
    }).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
    * Create or update setting sensor record
    * @param id
    * @param nameChart
    * @param data
    */
  createOrUpdateSettingSensorRecord(id: any, nameChart: any, data: any): Observable<any> {
    let url = APP_APIS['5.2'].replace("{id}", id).replace("{nameChart}", nameChart);
    return this._httpClient.post<any>(url, data).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
    * Hide or show sensor record
    * @param id
    * @param nameChart
    * @param data
    */
  hideOrShowSettingSensorRecord(id: any, nameChart: any): Observable<any> {
    let url = APP_APIS['5.3'].replace("{id}", id).replace("{nameChart}", nameChart);
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
    * Get last ph sensor record
    * @param id
    */
  getLastPhSensorRecord(id: any): Observable<any> {
    let url = APP_APIS['5.4'].replace("{id}", id);
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
    * Get data SenSor record api
    * @param gw
    */
  getDataSenSorRecordApi(gw: any,): Observable<any> {
    let url = APP_APIS['5.5'].replace("{gw}", gw);
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Delete sensor record
   * @param formData
   */
  deleteSensorRecord(formData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['5.6'], formData).pipe(
      map(
        res => {
          return res.data
        }
      )
    )
  }
}
