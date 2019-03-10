import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';

@Component({
  selector: 'ngx-device-monitoring',
  styleUrls: ['./device-monitoring.component.scss'],
  templateUrl: './device-monitoring.component.html',
})
export class DeviceMonitoringComponent implements OnDestroy {

  private alive = true;

  @Input() devtype;


  colors: any;
  themeSubscription: any;

  devices_type: any = {
    temperature: {
      title: 'Temperature',
      unit: "°C"
    },
    humidity: {
      title: 'Humidity',
      unit: "%"
    },
    electricity: {
      title: 'Electricity',
      unit: 'kW'
    }
  };

  constructor( private theme: NbThemeService, private fbDatabase: FirebaseDatabaseService ) {

    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
      this.colors = config.variables;
    });
  }

  ngOnInit(): void {
    // this.fbDatabase.currentTemp();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
