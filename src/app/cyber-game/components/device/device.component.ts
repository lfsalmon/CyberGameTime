import { ConnectionType, ConnectionTypeLabels } from './../../models/screen';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ConsoleType,ConsoleTypeLabels,Screen, ScreenStatus } from '../../models/screen';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidatorFn, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { ScreenService } from '../../services/screen.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeviceInfoService } from '../../services/device-info.service';
import { Dialog } from 'primeng/dialog';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { DeviceInfo } from '../../models/device-info';

@Component({
  selector: 'app-device',
  imports: [ButtonModule,
            InputTextModule,
            Select,
            FormsModule,
            InputMaskModule,
            Dialog,
            NgxSpinnerModule
        ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',

})
export class DeviceComponent implements OnInit {

  public console:Screen= new Screen();
  public visibleDialog=false;
  public isLoading: boolean = false;
  objectKeys = Object.keys;
  public deviceInfo :DeviceInfo= new  DeviceInfo();

  public ConsoleTypes = Object.values(ConsoleType)
  .filter((value) => typeof value === "number")
  .map((value) => ({
    value: value as ConsoleType,
    label: ConsoleTypeLabels[value as ConsoleType]
  }));

  public ConnectionType = Object.values(ConnectionType)
  .filter((value) => typeof value === "number")
  .map((value) => ({
    value: value as ConnectionType,
    label: ConnectionTypeLabels[value as ConnectionType]
  }));


constructor(private _service:ScreenService,
            private _deviceService:DeviceInfoService,
            private ref: DynamicDialogRef,
            private _messageService: MessageService,
            public config: DynamicDialogConfig,
            private spinner: NgxSpinnerService,


  ){
  }

  ngOnInit() {
    this.spinner.show();
    var _selected = this.config.data?.screen;
    if(_selected){
      this._service.GetById(_selected?.id).subscribe((response)=>{
        this.console=response;
        this.spinner.hide();
      });
    }else{
      this.spinner.hide();
    }
  }

  ipValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const ip = control.value;
      if (!ip) {
        return { invalidIP: 'La IP es requerida' };
      }
      const segments = ip.split('.');
      if (segments.length !== 4) {
        return { invalidIP: 'La IP debe contener 4 octetos' };
      }
      for (const segment of segments) {
        if (!segment.trim()) {
          return { invalidIP: 'Todos los octetos deben tener un valor' };
        }
        const num = parseInt(segment, 10);
        if (isNaN(num) || num < 0 || num > 255) {
          return { invalidIP: 'Cada octeto debe estar entre 0 y 255' };
        }
      }
      return null;
    };
  }

  public getImage(screen:any){

    switch (screen) {
      case ConsoleType.Xbox:
        return 'https://play-lh.googleusercontent.com/hihXCV-0wxOXB5N7uBREaJeCVK0BDjNEBtKwNAncftZMflpEvasiKXn7vCKxu9qGpvk=w240-h480-rw';
      case ConsoleType.Ps4:
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/PlayStation_App_Icon.jpg/768px-PlayStation_App_Icon.jpg';
      case ConsoleType.Nintendo:
        return 'https://play-lh.googleusercontent.com/5IR5tmAD35Sqfi-tDrFmb-mk9wronJDZm1w3h8xtFeK1rDX46Cyt0nauwUmUexSU9uM=w240-h480-rw';

      default:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGS9ziJwspwelvddA1sFa0bDVDFxHoiGOMNQ&s';
    }
  }

  onSubmit() {
    this.spinner.show();
    if(this.console.id>0){
      this._service.update(this.console).subscribe((success)=>{
        this._messageService.add({ severity: 'info', summary: 'se guardo correctamente', detail: success.name });
        this.ref.close(this.console);
        this.spinner.hide();
      },
      (error)=>{
        this._messageService.add({ severity: 'error', summary: 'Se genero un problema al intentar guardar' });
        this.ref.close();
        this.spinner.hide();
      })
    }else{
      this._service.Create(this.console).subscribe((success)=>{
        this._messageService.add({ severity: 'info', summary: 'se guardo correctamente', detail: success.name });
        this.ref.close(this.console);
        this.spinner.hide();
      },
      (error)=>{
        this._messageService.add({ severity: 'error', summary: 'Se genero un problema al intentar guardar' });
        this.ref.close();
        this.spinner.hide();
      })
    }



  }

  getIpDeviceInfo(){
    this.spinner.show();
    this.visibleDialog=true;
    this._service.getInfo(this.console.ipAddres).subscribe(
      (response)=>{
      this.deviceInfo=response;
      this.console.name=this.deviceInfo.modelName
      this.console.roku_DeviceId=this.deviceInfo.deviceId;
      this.console.roku_SerialNumber=this.deviceInfo.serialNumber;
      this.console.currentStatus=ScreenStatus.Online;
      this.console.roku_udn=this.deviceInfo.udn;
      this.isLoading = false;
      this.spinner.hide();

    },
    (error)=>{
      this.isLoading = false;
      this.spinner.hide();
    }
  );

  }

}
