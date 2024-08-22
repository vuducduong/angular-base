import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GwService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   *Get All Gateways
   */
  getListGateway(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['8.1']).pipe(
      map(
        res => {
          return res.data;
        })
    );
  }
}
