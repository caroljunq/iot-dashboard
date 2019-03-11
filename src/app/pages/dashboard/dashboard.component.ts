import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators' ;
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

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'secondary',
      },
    ],
  };
  sites: Observable<Site[]>;
  themeSubscription: Subscription;
  colors;
  echarts;
  options;

  constructor(
    private themeService: NbThemeService,
    private firebaseDatabaseService: FirebaseDatabaseService,
  ) { }

  ngOnInit(): void {
    this.sites = this.firebaseDatabaseService.getSites();

    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.statusCards = this.statusCardsByThemes[theme.name];

      this.colors = theme.variables;
      this.echarts = theme.variables.echarts;
    });
  }

  ngAfterViewInit() { }

  getChart(siteKey) {
    return this.firebaseDatabaseService.getChartOptions({
      colors: this.colors,
      echarts: this.echarts,
      siteKey,
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.alive = false;
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
  }
}
