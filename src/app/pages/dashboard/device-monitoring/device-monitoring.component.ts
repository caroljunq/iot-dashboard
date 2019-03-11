import { FirebaseDatabaseService } from './../../../@core/iot-dash/firebase-database.service';
import { Component, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-device-monitoring',
  styleUrls: ['./device-monitoring.component.scss'],
  templateUrl: './device-monitoring.component.html',
})
export class DeviceMonitoringComponent implements OnDestroy, AfterViewInit {
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
  options: any = {};
  colors;
  themeSubscription;

  constructor(
    private theme: NbThemeService,
    private firebaseDatabaseService: FirebaseDatabaseService,
  ) { }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.alive = false;
  }

}
