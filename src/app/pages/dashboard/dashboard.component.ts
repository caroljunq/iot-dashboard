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
export class DashboardComponent implements OnDestroy, OnInit, AfterViewInit, OnDestroy {
  private alive = true;

  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  selectedRoom = null;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
  } = {
    default: this.commonStatusCardsSet
  };
  themeSubscription: Subscription;
  colors;
  echarts;
  options;

  sites: any;
  sitesSubscription: Subscription;

  currentDate = null;

  constructor(
    private themeService: NbThemeService,
    private firebaseDatabaseService: FirebaseDatabaseService,
    private liveChartService: LiveChartService,
  ) {
    this.sitesSubscription = this.firebaseDatabaseService.getSites()
      .subscribe(res => {
        this.sites = res;

        if (!this.selectedRoom) {
          this.selectedRoom = this.sites[0];
        }
      })

    this.currentDate = interval(2000).pipe( map(() => Date.now()));
  }

  ngOnInit(): void {
    this.sites = this.firebaseDatabaseService.getSites();

    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.statusCards = this.statusCardsByThemes[theme.name];

      this.colors = theme.variables;
      this.echarts = theme.variables.echarts;
    });
  }

  ngAfterViewInit() { }

  // getChart(siteKey) {
  //   return this.liveChartService.getSiteSensorsComposedChart({
  //     colors: this.colors,
  //     echarts: this.echarts,
  //     siteKey,
  //   });
  // }
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

  ngOnDestroy() {
    this.alive = false;
    this.themeSubscription.unsubscribe();
    this.sitesSubscription.unsubscribe();
  }
}
