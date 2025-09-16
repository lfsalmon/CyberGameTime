import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricScreen } from '../models/HistoricScreen';
import { environment } from '../../../environments/environment';
import { ScreenHistoryBillingDto } from '../models/ScreenHistoryBillingDto';

@Injectable({
  providedIn: 'root'
})
export class ScreenHistoricService {
  private apiUrl = `${environment.apiUrl}api/ScreenHistoric`;

  constructor(private _http: HttpClient) {}


  ScreenHistoric(screenId: number | null , from: string, to: string): Observable<HistoricScreen[]> {
    const fromEnc = encodeURIComponent(from);
    const toEnc = encodeURIComponent(to);
    const url = `${this.apiUrl}?screenId=${screenId}&from=${fromEnc}&to=${toEnc}`;
    return this._http.get<HistoricScreen[]>(url);
  }

  ScreenBillings(cost: number | null , from: string, to: string): Observable<ScreenHistoryBillingDto[]> {
    const fromEnc = encodeURIComponent(from);
    const toEnc = encodeURIComponent(to);
    const url = `${this.apiUrl}/BillingReport?unitAmmont=${cost}&from=${fromEnc}&to=${toEnc}`;
    return this._http.get<ScreenHistoryBillingDto[]>(url);
  }
}
