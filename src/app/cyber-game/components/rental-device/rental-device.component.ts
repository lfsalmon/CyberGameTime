import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import {RentalDevice} from '../../models/rental-device'
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-rental-device',
  imports: [
    DatePickerModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './rental-device.component.html',
  styleUrl: './rental-device.component.scss'
})
export class RentalDeviceComponent implements OnInit{


  public RentalDevice: RentalDevice= new RentalDevice()

  constructor(private ref: DynamicDialogRef){}
  ngOnInit(): void
  {

  }

  public onSubmit(){
    this.ref.close(this.RentalDevice);
  }
}
