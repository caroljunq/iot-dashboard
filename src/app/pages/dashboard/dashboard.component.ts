import { tap, filter } from 'rxjs/operators';
import { LiveChartService } from './../../@core/iot-dash/live-chart.service';
import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { Observable, Subscription, interval } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators' ;
import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedRoom = null;
  themeSubscription: Subscription;
  colors: {};
  echarts: {};
  sites$: Observable<Site[]>;
  currentDate = interval(2000).pipe( map(() => Date.now()));

  constructor(
    private themeService: NbThemeService,
    private firebaseDatabaseService: FirebaseDatabaseService,
    private liveChartService: LiveChartService,
  ) {
    this.sites$ = this.firebaseDatabaseService.getSites().pipe(
      map(sites => {
        sites.forEach(site => site.sensorsArray.forEach(
          sensor => {
            sensor.value$ = this.firebaseDatabaseService.getSensorValue(sensor.key);
            sensor.aggregate$ = this.firebaseDatabaseService.getSensor24hAggregate(sensor.key);
            sensor.chart$ = this.liveChartService.getSensorsChart({
              colors: this.colors,
              echarts: this.echarts,
              device: sensor,
            });
          },
        ));
        return sites;
      }),
      tap(res => this.selectedRoom = this.selectedRoom || res[0]),
    );
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.colors = theme.variables;
      this.echarts = theme.variables.echarts;
    });
  }

  ngOnInit() { }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
  ngAfterViewInit() { }

  getSensorChart(sensor) {
    return this.liveChartService.getSensorsChart({
      colors: this.colors,
      echarts: this.echarts,
      device: sensor,
    });
  }

  sensors = {};
  getSensorValue(key: string) {
    if (this.sensors[key] == null) {
      this.sensors[key] = this.firebaseDatabaseService.getSensorValue(key);
    }
    return this.sensors[key];
  }
  getSensorAggregate(key: string) {
    return this.firebaseDatabaseService.getSensor24hAggregate(key);
  }

  actors = {};
  getActorValue(key: string) {
    if (this.actors[key] == null) {
      this.actors[key] = this.firebaseDatabaseService.getActorValue(key);
    }
    return this.actors[key];
  }
  setActorValue(key: string, value: boolean) {
    return this.firebaseDatabaseService.setActorValue(key, value);
    // return this.firebaseDatabaseService.setActorValue(key, value);
  }
}
