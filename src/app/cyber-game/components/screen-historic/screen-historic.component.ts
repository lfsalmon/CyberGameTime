import { Component, OnInit } from '@angular/core';
import { Timeline } from 'primeng/timeline';
import { ScreenHistoricService } from '../../services/screen-historic.service';
import { HistoricScreen } from '../../models/HistoricScreen';
import { EventItem } from '../../models/eventModel';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectItem } from 'primeng/select';

@Component({
  selector: 'app-screen-historic',
  imports: [Timeline],
  templateUrl: './screen-historic.component.html',
  styleUrl: './screen-historic.component.scss'
})
export class ScreenHistoricComponent implements OnInit {
  public historicData: HistoricScreen[] | null = null;
  public events: EventItem[]=[];
  constructor(private _historicService: ScreenHistoricService,
              public config: DynamicDialogConfig
  ) {}

  
  ngOnInit(): void {
    // rango: hoy 00:00 hasta hoy 23:59 (local), enviar en UTC (ISO)
    //const start = new Date(2025, 8, 15);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    //const end = new Date(2025, 8, 15);
    end.setHours(23, 59, 0, 0);
    var _selected = this.config.data?.screen;
    let screenid=null;
    let screenname="";
    if(_selected)
    {
      screenid=_selected.id;
      screenname=_selected.name;
    }
    const fromUtc = start.toISOString();
    const toUtc = end.toISOString();

    this._historicService.ScreenHistoric(screenid,fromUtc, toUtc).subscribe(
      (response) => {
        // convertir fechas ISO a representación local legible y crear encabezados cortos
        this.events = response.map(item => {
          const startLocal = this.formatToLocal(item.startDate);
          const endLocal = this.formatToLocal(item.endDate);
          return {
            status: item.status,
            // date usado en el marker: mostrar solo la hora local para evitar textos largos
            date: startLocal.split(', ').pop() ?? startLocal,
            
            header: `${startLocal} — ${item.status}`,
            screenDevice: screenname,
            endLocal: endLocal,
            icon: 'pi pi-clock',
            color: '#42A5F5',
          } as any;
        });
      },
      (err) => {
        console.error('Error al obtener historial de pantallas', err);
      }
    );
  }

  private formatToLocal(iso?: string | null): string {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso as string;
    }
  }
}
