import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_APIS } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static _httpClient: HttpClient;
  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Get all user
   * @param page
   * @param pageSize
   * @param column
   * @param orderBy
   */
  getAllUser(
    page: number,
    pageSize: number,
    column: string,
    orderBy: string,
  ): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['2.1'], {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', pageSize.toString())
        .set('column', column.toString())
        .set('orderBy', orderBy.toString())
    }).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  /**
   * Create User
   * @param formData
   */
  createUser(formData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['2.2'], formData).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * Update user
   * @param id
   * @param formData
   */
  updateUser(id: any, formData: any): Observable<any> {
    let url = APP_APIS['2.3'].replace("{id}", id);
    return this._httpClient.put<any>(url, formData).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * delete user
   * @param id
   */
  deleteUser(id: any): Observable<any> {
    let url = APP_APIS['2.4'].replace("{id}", id);
    return this._httpClient.delete<any>(url).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * validate unique username
   * @param formData
   */
  uniqueUsername(formData: any): Observable<any> {
    return this._httpClient.post<any>(APP_APIS['2.5'], formData).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * update relationship
   * @param id
   * @param formData
   */
  updateRelationship(id: any, formData: any): Observable<any> {
    let url = APP_APIS['2.6'].replace("{id}", id);
    return this._httpClient.put<any>(url, formData).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }

  /**
   * get role
   */
  getRole(): Observable<any> {
    return this._httpClient.get<any>(APP_APIS['2.7']).pipe(
      map(
        res => {
          return res.data;
        }
      ),
    );
  }
}
