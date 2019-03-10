import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-device-monitoring',
  styleUrls: ['./device-monitoring.component.scss'],
  templateUrl: './device-monitoring.component.html',
})
export class DeviceMonitoringComponent implements OnDestroy {
  private alive = true;

  @Input()
  title = 'Temperature';
  @Input()
  unit = '°C';
  @Input()
  sensorData = {
    timestamp: Date.now(),
    value: 25.5,
  };

  colors: any;
  themeSubscription: any;

  devices_type: any = {
    temperature: {
      title: 'Temperature',
      unit: '°C',
    },
    humidity: {
      title: 'Humidity',
      unit: '%',
    },
    electricity: {
      title: 'Electricity',
      unit: 'kW',
    },
  };

  constructor(private theme: NbThemeService) {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
      this.colors = config.variables;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
