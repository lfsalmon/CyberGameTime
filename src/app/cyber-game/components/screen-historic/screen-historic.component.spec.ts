import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenHistoricComponent } from './screen-historic.component';

describe('ScreenHistoricComponent', () => {
  let component: ScreenHistoricComponent;
  let fixture: ComponentFixture<ScreenHistoricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenHistoricComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
