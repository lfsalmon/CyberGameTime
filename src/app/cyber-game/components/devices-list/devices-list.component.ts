
import { Component, OnDestroy } from '@angular/core';
import { ScreenService } from '../../services/screen.service';
import { ConsoleType, ConsoleTypeLabels, Screen,ScreenStatus,ScreenStatusLabels } from '../../models/screen';
import { DataView } from 'primeng/dataview';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeviceComponent } from '../device/device.component';
import { Dialog } from 'primeng/dialog';
import { RentalDeviceComponent } from '../rental-device/rental-device.component';
import { RentalDevice } from '../../models/rental-device';
import { RentalScreenService } from '../../services/rental-screen.service';

import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { ScreenHistoricComponent } from '../screen-historic/screen-historic.component';
@Component({
  selector: 'app-devices-list',
  standalone: true,
  imports: [
    DataView,
    MenubarModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ToastModule,
    BadgeModule,
    AccordionModule
  ],
  providers: [MessageService,DialogService],
  templateUrl: './devices-list.component.html',
  styleUrl: './devices-list.component.scss'
})
export class DevicesListComponent implements OnDestroy {
  private hubConnection: signalR.HubConnection | undefined;

  public devices:any[]=[];
  // public devices_Xbox:any[]=[];
  // public devices_Ps:any[]=[];
  // public devices_Nintendo:any[]=[];
  public visibleDialog=false;
  // public devices_Unknow:any[]=[];

  public itemMenu: MenuItem[] | undefined;
  public activeIndex: number | undefined = 0;

  public active: string = "0";
  public ConsoleTypes = Object.values(ConsoleType)
    .filter((value) => typeof value === "number")
    .map((value) => ({
      value: value as ConsoleType,
      label: ConsoleTypeLabels[value as ConsoleType]
    }));

  public ref: DynamicDialogRef | undefined;
  constructor(private _service:ScreenService,
              private _rentalService:RentalScreenService,
              private dialogService: DialogService,
              private messageService: MessageService
  ){
    //this.devices=this._service.All();
    this.createDeviceMenu();
    this.startConnection();
  }


  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}messageHub`, {
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection
      .start()
      .then(() => console.log('Conexión SignalR establecida'))
      .catch(err => console.error('Error al conectar con SignalR', err));

    this.hubConnection.on('ConnectionPowerOff', (screenName: string) => {
      this.createDeviceMenu();
      this.messageService.add({ severity: 'info', summary: 'Success', detail:`Se mando apagar la pantalla ${screenName}`, life: 3000 });
    });

    // Agregar listener para cuando se actualice el tiempo
    this.hubConnection.on('TimeUpdated', (screenName: string) => {
      this.createDeviceMenu();
      this.messageService.add({ severity: 'info', summary: 'Tiempo Actualizado', detail:`Se actualizó el tiempo para ${screenName}`, life: 3000 });
    });

    // Agregar listener para cuando se agregue tiempo
    this.hubConnection.on('TimeAdded', (screenName: string) => {
      this.createDeviceMenu();
      this.messageService.add({ severity: 'info', summary: 'Tiempo Agregado', detail:`Se agregó tiempo para ${screenName}`, life: 3000 });
    });
  }


  public AddTime(_screed:Screen)
  {
    let _title=`Agregar Tiempo de uso para consola ${_screed.name}`;
    this.visibleDialog=true;
    this.ref = this.dialogService.open(RentalDeviceComponent, {
      header: _title,
      width: '400px',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closable:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      }
  });

  this.ref.onClose.subscribe((rentalData:RentalDevice) => {
    if(rentalData){
      rentalData.screenId=_screed.id;
      
      this._rentalService.Create(rentalData).subscribe((success)=>{
        let _message=`se agrego tiempo en la consola ${_screed?.name} desde ${rentalData.startDate} hasta ${rentalData.endDate}`;
        this.messageService.add({ severity: 'info', summary: 'Success', detail:_message, life: 3000 });
        
        // Actualizar la lista de dispositivos después de agregar tiempo
        this.createDeviceMenu();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar tiempo', life: 3000 });
      });
    }
  });
  }

  activeIndexChange(index : number)
  {
    this.activeIndex = index;
  }

  public handleEvent(name:string, action:string)
  {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: name+' was '+action, life: 3000 });
  }

  public  createDeviceMenu() {
    this._service.GetAll().subscribe(_screens => {
      _screens.forEach(x=>{
        if(x.rentalScrean){
          x.rentalScrean.endDate= new Date(x.rentalScrean.endDate)
          x.rentalScrean.startDate= new Date(x.rentalScrean.startDate)
        }
      })
      this.devices=this.createDevices(_screens);
      // this.devices_Ps=this.createDevices(ConsoleType.Ps4,_screens);
      // this.devices_Nintendo=this.createDevices(ConsoleType.Nintendo,_screens);
      // this.devices_Unknow=this.createDevices(ConsoleType.Unknow,_screens);

    });;

  }


  public PowerOff(IpAddress:string){
   this._service.PowerOff(IpAddress).subscribe((sucess)=>{
    this.messageService.add({ severity: 'success', summary: 'success', detail: `La conosla con Ip ${IpAddress} fue apagada correctamente`, life: 3000 });
    
    // Actualizar la lista de dispositivos después de apagar
    this.createDeviceMenu();
   },
   (error)=>{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: `hubo error en la conosla con Ip ${IpAddress} al intetnar apagar`, life: 3000 });
   }
  )
  }

  public PowerOn(id:number){
    this._service.PowerOn(id).subscribe((sucess)=>{
      this.messageService.add({ severity: 'success', summary: 'success', detail: `La conosla con Id ${id} fue prendida correctamente`, life: 3000 });
      
      // Actualizar la lista de dispositivos después de encender
      this.createDeviceMenu();
     },
     (error)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `hubo error en la conosla con Id ${id} al intetnar prender`, life: 3000 });
     }
    )
  }

  public EditAction(screen:Screen){
      this.ref = this.dialogService.open(DeviceComponent, {
        header: 'Agregar consola',
        width: '50vw',
        modal: true,
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        closable:true,
        data: {
          screen:screen
        },
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        }
    });

    this.ref.onClose.subscribe((product) => {
      this.createDeviceMenu();
    });
  }


  public TimeLineAction(screen:Screen){
      this.ref = this.dialogService.open(ScreenHistoricComponent, {
        header: 'Time Line of '+ screen.name,
        width: '50vw',
        modal: true,
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        closable:true,
        data: {
          screen:screen
        },
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        }
    });

    this.ref.onClose.subscribe((product) => {
      this.createDeviceMenu();
    });
  }

  public createDevices(_screen:Screen[]):Screen[]{

    //let _filters=_screen.filter(x=>x.consoleType==type);

    return  _screen.map(device => ({
      ...device,
      menu: [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => this.EditAction(device)
        },

        {
          label: 'Time Line',
          icon: 'pi pi-history',
          command: () => this.TimeLineAction(device)
        },
        {
          label: 'Power On',
          icon: 'pi pi-power-off',

          command: () => this.handleEvent(device.name, 'Turn On'),
          styleClass: 'power-on'
        },
        {
          label: 'Power Off',
          icon: 'pi pi-power-off',
          command: () => this.handleEvent(device.name, 'Turn Off'),
          styleClass: 'power-off'
        }
      ]
      }));
  }
  public getImage(type:ConsoleType){
    switch (type) {
      case ConsoleType.Xbox:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8bqcn8xTGlSw5XjXm8-LKRnIfIa_uW2TCjA&s';
      case ConsoleType.Ps4:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAlmmy-prmVJ4wKjVaz7qnDDW5DtLizigPtQ&s';
      case ConsoleType.Nintendo:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0gxQTkcPN-_D5MzfyE6W981Okrt5Fq0CC2A&s';

      default:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGS9ziJwspwelvddA1sFa0bDVDFxHoiGOMNQ&s';
    }
  }

  public getCurrenStatus(status:ScreenStatus):string{
    return ScreenStatusLabels[status];
  }

  // public getVAlues(type:ConsoleType):Screen[]{
  //   switch (type) {
  //     case ConsoleType.Xbox:
  //       return this.devices_Xbox;
  //     case ConsoleType.Ps4:
  //       return this.devices_Ps;
  //     case ConsoleType.Nintendo:
  //       return this.devices_Nintendo;
  //     case ConsoleType.Unknow:
  //       return this.devices_Unknow;
  //     default:
  //       return [];
  //   }
  // }

  public updateTime(_screed:Screen){

    if(_screed.rentalScrean){
      this._rentalService.Update(_screed.rentalScrean).subscribe((success)=>{
        let _message=`Se finalizo el tiempo de la consola ${_screed?.name} se apagara en unos instantes `;
        this.messageService.add({ severity: 'info', summary: 'Success', detail:_message, life: 3000 });
        
        // Actualizar la lista de dispositivos después de actualizar tiempo
        this.createDeviceMenu();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar tiempo', life: 3000 });
      });
    }
    else{
      let _message=`El dispositivo ${_screed?.name} no tiene tiempo para finalizar`;
        this.messageService.add({ severity: 'info', summary: 'Info', detail:_message, life: 3000 });
    }

  }

  ngOnDestroy(): void {
    // Cerrar la conexión SignalR cuando el componente se destruya
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('Conexión SignalR cerrada'))
        .catch(err => console.error('Error al cerrar la conexión SignalR', err));
    }
    
    // Cerrar el diálogo si está abierto
    if (this.ref) {
      this.ref.close();
    }
  }

}

