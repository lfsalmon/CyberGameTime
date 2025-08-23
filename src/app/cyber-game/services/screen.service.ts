import { Injectable } from '@angular/core';
import { ScreenStatus,Screen, ConsoleType } from '../models/screen';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeviceInfo } from '../models/device-info';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  private apiUrl = `${environment.apiUrl}api/Screens`;

  constructor(private _http: HttpClient) {}

  GetAll(): Observable<Screen[]> {
    return this._http.get<Screen[]>(this.apiUrl);
  }

  GetById(id: number): Observable<Screen> {
    return this._http.get<Screen>(`${this.apiUrl}/${id}`);
  }

  Create(Screen: Screen): Observable<Screen> {
    return this._http.post<Screen>(this.apiUrl, Screen);
  }

  update(Screen: Screen): Observable<Screen> {
    return this._http.put<Screen>(this.apiUrl, Screen);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getInfo(ipAddress: string): Observable<DeviceInfo> {
    return this._http.get<DeviceInfo>(`${this.apiUrl}/RokuInfo/${ipAddress}`);
  }

  PowerOff(ipAddress: string): Observable<DeviceInfo> {
    return this._http.get<DeviceInfo>(`${this.apiUrl}/Roku/PowerOff/${ipAddress}`);
  }

  PowerOn(id: number): Observable<DeviceInfo> {
    return this._http.get<DeviceInfo>(`${this.apiUrl}/Roku/PowerOn/${id}`);
  }
}

