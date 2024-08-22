import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListenseChartChangeService {
  private channel: BroadcastChannel;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.channel = new BroadcastChannel('chart_setting_change');

    this.channel.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };
  }

  /**
   * send message
   * @param data
   * @returns void
   */
  sendMessage(data: any): void {
    this.channel.postMessage(data);
    this.messageSubject.next(data);
  }

  /**
   * receive message
   * @returns Observable<any>
   */
  receiveMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
