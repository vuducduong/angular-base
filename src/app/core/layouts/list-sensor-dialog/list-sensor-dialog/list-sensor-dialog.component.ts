import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService, DataService, SensorService } from '../../../services';

@Component({
  selector: 'app-list-sensor-dialog',
  templateUrl: './list-sensor-dialog.component.html',
  styleUrls: ['./list-sensor-dialog.component.scss']
})
export class ListSensorDialogComponent {
  dataRef: any;
  listSensorForm: FormGroup;
  username: string = "";
  currentUsername: string = "";
  displayedColumns: string[] = ['sensor_id', 'sensor_name'];
  dataListSensor: any;
  dataSensorByUser: any[] = [];
  keyFormListSensor: string = "list_sensor";

  constructor(
    public _dialogRef: MatDialogRef<ListSensorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public _sensorService: SensorService,
    private _dataService: DataService,
    private _authService: AuthService,
  ) {
    this.dataRef = data;
    this.listSensorForm = this._formBuilder.group({
      [this.keyFormListSensor]: ['']
    });

    const currentUser = this._authService.currentUserValue;
    this.currentUsername = currentUser.userName.toString() ? currentUser.userName.toString() : "";
    this.username = this.data.username;
    this.dataListSensor = this.data.list_sensor;
    this.listSensorByUser(this.data.user_id);
  }

  /**
   * List sensor by user
   * @param userId
   * @returns void
  */
  listSensorByUser(userId: number): void {
    this._sensorService.getListSensorByUser(userId).subscribe(res => {
      const copiedData = JSON.parse(JSON.stringify(res));
      if (this.currentUsername === this.username) {
        this._dataService.setUserSensorData(copiedData);
      }
      this.dataSensorByUser = res;
    }, error => { });
  }

  /**
   * Checked sensor
   * @returns void
  */
  checkedSensor(sensorId: number, sensorName: string): void {
    if (this.dataSensorByUser.filter(e => e.id == sensorId).length > 0) {
      this.dataSensorByUser = this.dataSensorByUser.filter(e => e.id !== sensorId);
    } else {
      let sensor = { id: sensorId, name: sensorName }
      this.dataSensorByUser.push(sensor);
    }
  }

  /**
   * Is checked
   * @returns boolean
  */
  isChecked(sensorId: number): boolean {
    return this.dataSensorByUser.filter(e => e.id == sensorId).length > 0;
  }

  /**
   * Save dialog
   * @returns void
  */
  saveDialog(): void {
    let data: any[] = [];
    if (typeof this.dataSensorByUser == 'object') {
      data = this.dataSensorByUser.map(value => value.id);
    }
    let resData = {
      data: data,
      dataSensor: this.dataSensorByUser
    }
    this._dialogRef.close(resData);
  }
}
