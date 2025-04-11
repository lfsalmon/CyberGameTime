export class RentalDevice
{
    public id:number=0;
    public screenId: number=0;
    public startDate: Date= new Date();
    public endDate: Date= new Date(new Date().setHours(new Date().getHours() + 1));
}
