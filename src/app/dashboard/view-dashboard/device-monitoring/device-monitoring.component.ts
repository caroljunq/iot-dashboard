import { Component, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Device } from 'app/@core/iot-dash/iot-dash-models';

@Component({
  selector: 'app-device-monitoring',
  styleUrls: ['./device-monitoring.component.scss'],
  templateUrl: './device-monitoring.component.html',
})
export class DeviceMonitoringComponent implements OnDestroy, AfterViewInit {
  @Input()
  title = 'Temperature';
  @Input()
  unit = '°C';
  @Input()
  sensor: Device;
  @Input()
  sensorData = {
    timestamp: Date.now(),
    value: 25.5,
  };
  colors;
  themeSubscription;

  gaugeValues: any = {
    1: 100,
    2: 50,
    3: 50,
    4: 50,
    5: 50,
    6: 50,
    7: 50,
  };

  constructor(
    private theme: NbThemeService,
  ) { }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
