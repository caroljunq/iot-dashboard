import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMonitoringComponent } from './device-monitoring.component';

describe('DeviceMonitoringComponent', () => {
  let component: DeviceMonitoringComponent;
  let fixture: ComponentFixture<DeviceMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
