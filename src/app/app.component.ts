
import { RouterOutlet } from '@angular/router';
import { DevicesListComponent } from './cyber-game/components/devices-list/devices-list.component';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Dock } from 'primeng/dock';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './shared/components/header/header.component';
import { DeviceComponent } from './cyber-game/components/device/device.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DevicesListComponent,Dock, ToastModule, CommonModule, FormsModule, TooltipModule,HeaderComponent,DynamicDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService,DialogService],
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'CyberGameTime';
  items: MenuItem[] | undefined;
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService, 
    public messageService: MessageService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Force dark mode on application start
    this.document.documentElement.classList.add('dark');
    
    this.items = [
        {
            label: 'Consolas',
            icon: 'https://cdn-icons-png.flaticon.com/512/10069/10069151.png',

        },
        {
            label: 'Agregar Consola',
            icon: 'https://cdn-icons-png.flaticon.com/512/5610/5610959.png',
            command: () => this.AddDeviceComponent()
        },
        {
            label: 'Linea de tiempo de consolas',
            icon: 'https://static.vecteezy.com/system/resources/previews/009/826/881/non_2x/eight-o-clock-time-sign-design-icon-free-png.png'
        }
    ];
  }

  AddDeviceComponent() {
    this.ref = this.dialogService.open(DeviceComponent, {
        header: 'Agregar consola',
        width: '50vw',
        modal: true,
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        closable:true,
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        }
    });

}

ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
}
}
