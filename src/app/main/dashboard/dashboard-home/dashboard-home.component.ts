import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { AlarmSettingService, DashboardService, ListenseChartChangeService } from '../../../core/services';
import { Subscription } from 'rxjs';
import { SensorRecordStatus } from '../../../core/helpers/enum';
import { getTranslation } from '../../../core/helpers/pipe';
import { AlertDialogComponent } from '../../../core/layouts';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})

export class DashboardHomeComponent implements OnDestroy {
  url: string;
  ph: string = 'ph';
  humidity: string = 'humidity';
  pressure: string = 'pressure';
  temperature: string = 'temperature';
  sendCount: string = 'send_count';
  voltageDifference: string = 'voltage_difference';
  longevity: string = 'longevity';
  arrItemCharts: string[] = [
    this.ph,
    this.pressure,
    this.humidity,
    this.temperature,
    this.sendCount,
    this.voltageDifference,
    this.longevity
  ]
  statusText: string = '';
  statusColor: SensorRecordStatus = SensorRecordStatus.SUCCESS;
  loader: boolean = false;
  timestamp: string[] = [];
  intervalGetData: any = null;
  timeInterval: any;
  subscribeArr: Subscription[] = [];
  alarmSetting: any;
  data: any = [];
  labels: any = [];
  arrAlarmWarningDanger: string[] = [];
  arrAlarmWarningPurple: string[] = [];
  tabUnique: string = this.generateUniqueId();
  valueOff: Number = 0;
  popups: { [url: string]: Window | null } = {};
  textUpdateTime: any = '';
  statusUpdateData: any = true;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _dashboardService: DashboardService,
    private _alarmSettingService: AlarmSettingService,
    private _matDialog: MatDialog,
    private _listenseChartChangeService: ListenseChartChangeService
  ) {
    this.url = this._document.location.origin;
    this.getData();
    this.setStatus();
    this.intervalChart();
    this.listenToChangeSetting();
  }

  /**
   * open popup
   * @param name
   * @return void
   */
  popup(name: string): void {
    const index = [
      this.ph,
      this.pressure,
      this.humidity,
      this.temperature,
      this.sendCount,
      this.voltageDifference,
      this.longevity
    ].indexOf(name);

    const urlChart = `${this.url}/#/dashboard/${name}`;
    const width = 1000;
    const height = 800;
    const left = 100 * index;
    const top = 0;
    const menubar = 'no';
    const toolbar = 'no';
    const location = 'no';
    const scrollbars = 'no';
    const resizable = 'no';
    const specs = `width=${width},height=${height},left=${left},top=${top},menubar=${menubar},toolbar=${toolbar},location=${location},scrollbars=${scrollbars},resizable=${resizable}`;
  
    if (this.popups[urlChart] && !this.popups[urlChart]!.closed) {
      this.popups[urlChart]!.close();
    }

    this.popups[urlChart] = window.open(urlChart, 'popup=' + name, specs);
  }

  /**
   * Get data api
   * @return void
  */
  getDataApi(): void {
    this.loader = true;
    const subscription = this._dashboardService.getDataApi().subscribe(res => {
      this.getData();
      this.loader = false;
    }, error => {
      this.loader = false;
      this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * listen to change setting
   * @return void
   */
  listenToChangeSetting(): void {
    const _this = this;
    const subscription1 = this._listenseChartChangeService.receiveMessage().subscribe(data => {
      if (data == null) {
        _this.timestamp = [];
        _this.getData();
      }
    });

    this.subscribeArr.push(subscription1);
  }

  /**
   * Get data
   * @return void
  */
  getData(): void {
    const subscription = this._dashboardService.getDataChart(this.ph).subscribe(res => {
      let checkTimestamp = res.timestamps.filter((value: any) => this.timestamp.indexOf(value) == -1);
      if (checkTimestamp.length > 0) {
        const subscription = this._alarmSettingService.getAlarmSettingByAuth().subscribe(
          alarmSetting => {
            this.arrAlarmWarningDanger = [];
            this.arrAlarmWarningPurple = [];
            this.data = res.data;
            this.labels = res.labels;
            this.timeInterval = res.interval;
            this.timestamp = res.timestamps;
            this.alarmSetting = alarmSetting;
            this.checkAlarmSetting();
            this.loader = false;
          },
          error => {
            this.setStatus(SensorRecordStatus.WARNING);
            this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
            this.loader = false;
          });
        this.subscribeArr.push(subscription);
      }

      this.textUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.statusUpdateData = 'success';
    }, error => {
      this.textUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.statusUpdateData = 'error';
      this.setStatus(SensorRecordStatus.WARNING);
      this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * check alarm setting
   */
  checkAlarmSetting() {
    if (this.alarmSetting != null) {
      const valueLevelOne = this.alarmSetting.alarm_hydrogen_value_level_1;
      const valueLevelTwo = this.alarmSetting.alarm_hydrogen_value_level_2;
      const statusDashedLineLevelOne = this.alarmSetting.chart_hydrogen_status_dashed_line_level_1;
      const statusDashedLineLevelTwo = this.alarmSetting.chart_hydrogen_status_dashed_line_level_2;
      if (this.data.length > 0) {
        this.data.forEach((element: any, index: any) => {
          if (statusDashedLineLevelOne != undefined && statusDashedLineLevelOne != this.valueOff) {
            if (valueLevelOne != undefined) {
              if (element >= valueLevelOne) {
                this.arrAlarmWarningDanger.push(this.labels[index]);
              }
            }
          }

          if (statusDashedLineLevelTwo != undefined && statusDashedLineLevelTwo != this.valueOff) {
            if (valueLevelTwo != undefined) {
              if (element >= valueLevelTwo && element < valueLevelOne) {
                this.arrAlarmWarningPurple.push(this.labels[index]);
              }
            }
          }
        });
        if (this.arrAlarmWarningDanger.length > 0) {
          this.setStatus(SensorRecordStatus.DANGER);
        } else if (this.arrAlarmWarningPurple.length > 0) {
          this.setStatus(SensorRecordStatus.VOLUNTARY_WARNING);
        } else {
          this.setStatus(SensorRecordStatus.SUCCESS);
        }
      } else {
        this.setStatus(SensorRecordStatus.WARNING);
      }
    }
    this.sendDataToChart();
  }

  /**
   * set local storage
   */
  sendDataToChart() {
    this._listenseChartChangeService.sendMessage(
      {
        alarmWarningDanger: this.arrAlarmWarningDanger,
        alarmWarningPurple: this.arrAlarmWarningPurple,
        alarmSetting: this.alarmSetting,
        tabUnique: this.tabUnique
      }
    );
  }

  /**
   * generate unique id
   * @return string
   */
  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
    * set status
    * @param status
    */
  setStatus(status: SensorRecordStatus = SensorRecordStatus.SUCCESS) {
    switch (status) {
      case SensorRecordStatus.SUCCESS:
        this.statusColor = SensorRecordStatus.SUCCESS;
        this.statusText = getTranslation('normal_sensor');
        break;
      case SensorRecordStatus.DANGER:
        this.statusColor = SensorRecordStatus.DANGER;
        this.statusText = getTranslation('abnormal_sensor');
        break;
      case SensorRecordStatus.WARNING:
        this.statusColor = SensorRecordStatus.WARNING;
        this.statusText = getTranslation('abnormal_condition_sensor');
        break;
      case SensorRecordStatus.VOLUNTARY_WARNING:
        this.statusColor = SensorRecordStatus.VOLUNTARY_WARNING;
        this.statusText = getTranslation('voluntary_warning_sensor');
        break;
      default:
        this.statusColor = SensorRecordStatus.SUCCESS;
        this.statusText = getTranslation('normal_sensor');
        break;
    }
  }

  /**
   * interval chart
   */
  intervalChart() {
    if (this.timeInterval > 0) {
      if (this.intervalGetData != null) {
        this.stopInterval();
      }
      this.intervalGetData = setInterval(() => {
        this.getData();
      }, this.timeInterval * 1000);
    }
  }

  /**
   * stop Interval
   */
  stopInterval() {
    clearInterval(this.intervalGetData);
  }

  /**
   * cleanup subscriptions
   */
  cleanupSubscriptions() {
    this.subscribeArr.forEach((subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.subscribeArr = [];
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.stopInterval();
    this.cleanupSubscriptions();
  }
}