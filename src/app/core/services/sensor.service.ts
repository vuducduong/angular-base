import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Get all sensor
   * @param page
   * @param pageSize
   * @param order
   * @param sortColumn
   */
  getAllSensor(
    page: number,
    pageSize: number,
    sortColumn: string,
    order: string = 'desc'
  ): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['4.1'], {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', pageSize.toString())
        .set('column', sortColumn.toString())
        .set('orderBy', order.toString())
    }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  /**
   * Get list sensor by user
   * @param id
   * @returns Observable<any>
   */
  getListSensorByUser(id: any): Observable<any> {
    let url = APP_APIS['4.8'].replace("{id}", id);
    return this._httpClient.get<any>(url).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Get all sensor
   * @returns Observable<any>
   */
  getListSensor(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['4.9']).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Get list gateways
   * @returns Observable<any>
   */
  getListGateway(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['8.1']).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Get sensormac by gateway id
   * @param gatewayId
   * @returns Observable<any>
   */
  getSensorMacByGatewayId(gatewayId: string): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['4.7'].replace("{gwId}", gatewayId), {}).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Get sensormac by gateway id
   * @param gatewayId
   * @param id
   * @returns Observable<any>
   */
  getSensorMacById(gatewayId: string, id: string): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['4.6'].replace("{gwId}", gatewayId).replace("{num}", id), {}).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Create sensor
   * @param data
   * @returns Observable<any>
   */
  createSensor(data: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['4.2'], data).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Update sensor
   * @param id
   * @param data
   * @returns Observable<any>
   */
  updateSensor(id: string, data: any): Observable<any> {
    return this._httpClient.put<any>(APP_APIS['4.3'].replace('{id}', id), data).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Delete sensor
   * @param id
   * @returns Observable<any>
   */
  deleteSensor(id: string): Observable<any> {
    return this._httpClient.delete<any>(APP_APIS['4.4'].replace("{id}", id)).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }

  /**
   * Get gateway from api
   * @returns Observable<any>
   */
  getGatewayFromApi(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['4.10']).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }
}
