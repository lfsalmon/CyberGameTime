import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScreenHistoricService } from '../../services/screen-historic.service';
import { HistoricScreen } from '../../models/HistoricScreen';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ScreenHistoryBillingDto } from '../../models/ScreenHistoryBillingDto';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-screens',
  imports: [
    DatePickerModule,
    ButtonModule,
    FormsModule,
    TableModule,
    CommonModule
  ],
  templateUrl: './report-screens.component.html',
  styleUrl: './report-screens.component.scss'
})
export class ReportScreensComponent implements OnInit {

  public ReportData: ScreenHistoryBillingDto[] =[];
  public totalMinutes: number = 0;
  public totalHours: number = 0;
  public totalBilling: number = 0;

  public fromDate: Date | null = null;
  public quantity: number | null = null;


  constructor(private _historicService: ScreenHistoricService) {}

  ngOnInit(): void {

  }

  public onCut(): void {
    
    const start = this.fromDate ? new Date(this.fromDate) : new Date();
    if (!this.fromDate) start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setHours(23,59,59,999);

    const fromUtc = start.toISOString();
    const toUtc = end.toISOString();

    
    this._historicService.ScreenBillings(this.quantity, fromUtc, toUtc).subscribe(
      (response) => {
        console.log(response);
        this.ReportData = response;
        this.totalMinutes = this.round2(this.ReportData.reduce((sum, item) => sum + item.minutes, 0));
        this.totalHours = this.round2(this.ReportData.reduce((sum, item) => sum + item.hours, 0));
        this.totalBilling = this.round2(this.ReportData.reduce((sum, item) => sum + item.total, 0));
      },
      (err) => {
        console.error('Error al obtener historial (corte)', err);
      });
  }

  // Round a number to 2 decimal places and return a number
  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private isIsoDateString(value: any): boolean {
    if (typeof value !== 'string') return false;
    const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?/;
    if (!isoLike.test(value)) return false;
    const time = Date.parse(value);
    return !isNaN(time);
  }


}
