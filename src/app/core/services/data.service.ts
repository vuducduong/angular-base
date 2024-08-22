import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userDataSubject = new BehaviorSubject<any>('');
  constructor() { }

  /**
   * Get user sensor data
   * @returns Observable
  */
  getUserSensorData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  /**
   * Set user sensor data
   * @param data
  */
  setUserSensorData(data: any) {
    this.userDataSubject.next(data);
  }
}
