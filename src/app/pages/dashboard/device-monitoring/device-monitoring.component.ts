import { Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Temperature, TemperatureHumidityData } from '../../../@core/data/temperature-humidity';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-device-monitoring',
  styleUrls: ['./device-monitoring.component.scss'],
  templateUrl: './device-monitoring.component.html',
})
export class DeviceMonitoringComponent implements OnDestroy {

  private alive = true;

  @Input() type = "temperature";

  temperatureData: Temperature;
  temperature: number;
  temperatureOff = false;
  temperatureMode = 'cool';

  humidityData: Temperature;
  humidity: number;
  humidityOff = false;
  humidityMode = 'heat';

  colors: any;
  themeSubscription: any;

  units: any = {
    temperature: {
      title: 'Temperature',
      symbol: "°C"
    },
    humidity: {
      title: 'Humidity',
      symbol: "%"
    },
  };

  title: string =  "";
  symbols: string = "";

  constructor(private theme: NbThemeService,
              private temperatureHumidityService: TemperatureHumidityData) {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
      this.colors = config.variables;
    });

    forkJoin(
      this.temperatureHumidityService.getTemperatureData(),
      this.temperatureHumidityService.getHumidityData(),
    )
      .subscribe(([temperatureData, humidityData]: [Temperature, Temperature]) => {
        this.temperatureData = temperatureData;
        this.temperature = this.temperatureData.value;

        this.humidityData = humidityData;
        this.humidity = this.humidityData.value;
      });
      this.title = this.units[this.type].title;
      this.symbol = this.units[this.type].symbol;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
