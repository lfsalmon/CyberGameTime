import { MenuItem } from "primeng/api";
import { RentalDevice } from "./rental-device";

export class Screen {
  public id: number=0;
  public name: string='';
  public ipAddres: string='';
  public roku_DeviceId: string='';
  public roku_SerialNumber: string='';
  public roku_udn: string='';
  public currentStatus: ScreenStatus=ScreenStatus.Unknown;
  public consoleType:ConsoleType|null=null;
  public rentalScrean:RentalDevice|null=null;
  public connectionType:ConnectionType|null=null;
}

export enum ScreenStatus {
  Unknown = 0,
  Online = 1,
  Offline = 2
}

export enum ConsoleType {
  Unknow ,
  Ps4 ,
  Nintendo,
  Xbox ,
  Pc,
}

export enum ConnectionType{
  Unknown,
  Roku,
  Xbox
}

export const ConnectionTypeLabels: { [key in ConnectionType]: string } = {
  [ConnectionType.Unknown]: "Desconocido",
  [ConnectionType.Roku]: "Roku",
  [ConnectionType.Xbox]: "Xbox",

};


export const ScreenStatusLabels: { [key in ScreenStatus]: string } = {
  [ScreenStatus.Unknown]: "Desconocido",
  [ScreenStatus.Online]: "En linea",
  [ScreenStatus.Offline]: "Fuera de linea",

};


export const ConsoleTypeLabels: { [key in ConsoleType]: string } = {
  [ConsoleType.Unknow]: "Desconocido",
  [ConsoleType.Ps4]: "Play Station",
  [ConsoleType.Nintendo]: "Nintendo",
  [ConsoleType.Xbox]: "Xbox",
  [ConsoleType.Pc]: "Pc",
};
