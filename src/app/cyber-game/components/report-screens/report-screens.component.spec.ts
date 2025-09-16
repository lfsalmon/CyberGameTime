import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportScreensComponent } from './report-screens.component';

describe('ReportScreensComponent', () => {
  let component: ReportScreensComponent;
  let fixture: ComponentFixture<ReportScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
