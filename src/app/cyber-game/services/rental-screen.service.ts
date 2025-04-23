import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {RentalDevice} from '../models/rental-device'
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class RentalScreenService {

  private apiUrl = `${environment.apiUrl}/RentalScreend`;

  constructor(private _http: HttpClient) {}

  Create(RentalDevice: RentalDevice): Observable<RentalDevice> {
    return this._http.post<RentalDevice>(this.apiUrl, RentalDevice);
  }

  Update(RentalDevice: RentalDevice): Observable<RentalDevice> {
    return this._http.put<RentalDevice>(this.apiUrl, RentalDevice);
  }
}
