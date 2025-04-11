import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalDeviceComponent } from './rental-device.component';

describe('RentalDeviceComponent', () => {
  let component: RentalDeviceComponent;
  let fixture: ComponentFixture<RentalDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
