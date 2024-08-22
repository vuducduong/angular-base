import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlarmSettingService {

  constructor(
    private _httpClient: HttpClient
  ) { }

/**
 * get alarm setting by auth
 */
  getAlarmSettingByAuth(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['3.1']).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * Create or update alarm setting
   * @param formData
   */
  createOrUpdateAlarmSetting(formData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['3.2'], formData).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }
}
