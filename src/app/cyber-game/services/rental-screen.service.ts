import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {RentalDevice} from '../models/rental-device'
@Injectable({
  providedIn: 'root'
})
export class RentalScreenService {

  private apiUrl = 'https://localhost:44365/api/RentalScreend';

  constructor(private _http: HttpClient) {}

  Create(RentalDevice: RentalDevice): Observable<RentalDevice> {
    return this._http.post<RentalDevice>(this.apiUrl, RentalDevice);
  }

  Update(RentalDevice: RentalDevice): Observable<RentalDevice> {
    return this._http.put<RentalDevice>(this.apiUrl, RentalDevice);
  }
}
