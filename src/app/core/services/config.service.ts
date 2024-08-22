import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

export class AppConfig {
  apiURL!: string;
  staticURL!: string;
  plugins!: Array<any>;
}
export let APP_CONFIG = new AppConfig();

export let APP_APIS: { [key: string]: string } = {
  //Authentication 1.
  '1.1': 'Auth/Login',
  '1.2': 'Auth/Logout',
  //User 2
  '2.1': 'User',
  '2.2': 'User',
  '2.3': 'User/{id}',
  '2.4': 'User/{id}',
  '2.5': 'User/ValidateUniqueName',
  '2.6': 'User/UpdateRelationship/{id}',
  '2.7': 'User/GetRole',
  //Alarm settings 3
  '3.1': 'AlarmSetting',
  '3.2': 'AlarmSetting/CreateOrUpdate',
  //Sensor 4
  '4.1': 'Sensor',
  '4.2': 'Sensor',
  '4.3': 'Sensor/{id}',
  '4.4': 'Sensor/{id}',
  '4.5': 'Sensor/Create',
  '4.6': 'Sensor/GetSensorMacAddress/{gwId}/{num}',
  '4.7': 'Sensor/GetNums/{gwId}',
  '4.8': 'Sensor/GetListSensorByUserId/{id}',
  '4.9': 'Sensor/GetAllNoPaginate',
  '4.10': 'Sensor/RefreshSensorParameters',
  //Sensor record 5
  '5.1': 'SensorRecord/GetDataShowSensor/{id}/{nameChart}',
  '5.2': 'SensorRecord/CreateOrUpdateSetting/{id}/{nameChart}',
  '5.3': 'SensorRecord/HideOrShowSetting/{id}/{nameChart}',
  '5.4': 'SensorRecord/GetLastValuePh/{id}',
  '5.5': 'SensorRecord/GetDataByApi/{gw}',
  '5.6': 'SensorRecord/Delete',
  '5.7': 'SensorRecord/GetDataInforSensorRecord/{id}',
  //Export Csv 6
  '6.1': 'Csv/ExportRadio',
  '6.2': 'Csv/ExportSensor',
  //Chart Dashboard 7
  '7.1': 'ChartDashboard/GetDataChart',
  '7.2': 'ChartDashboard/GetDataApi',
  //Gateways 8
  '8.1': 'Gw/AllGateways',
  //License 9
  '9.1': 'License',
  '9.2': 'License',
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(DOCUMENT) private _document: any
  ) {}

  loadConfig() {
    var local = this._document.location.origin;

    return this._httpClient
      .get<any>(local + '/assets/config.json')
      .toPromise()
      .then((response: any) => {
        APP_CONFIG = response;

        for (let i in APP_APIS) {
          APP_APIS[i] = APP_CONFIG.apiURL + '/' + APP_APIS[i];
        }

        return Promise.resolve(response);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }
}
