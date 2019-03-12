import { Component, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

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
  sensorData = {
    timestamp: Date.now(),
    value: 25.5,
  };
  colors;
  themeSubscription;

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
