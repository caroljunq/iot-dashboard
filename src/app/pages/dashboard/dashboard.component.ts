import {Component, OnDestroy} from '@angular/core';
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
export class DashboardComponent implements OnDestroy {
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
  sites: any;
  sitesSubscription: Subscription;

  currentDate = null;

  constructor(
    private themeService: NbThemeService,
    private fbDatabase: FirebaseDatabaseService,
  ) {
    this.sitesSubscription = this.fbDatabase.getSites()
      .subscribe(res =>{
        this.sites = res;

        if(!this.selectedRoom){
          this.selectedRoom = this.sites[0];
        }
      })

    this.currentDate = interval(5000).pipe( map(() => Date.now()));

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

  }

  sensors = {};
  getSensorValue(key: string) {
    if (this.sensors[key] == null) {
      this.sensors[key] = this.fbDatabase.getSensorValue(key);
    }
    return this.sensors[key];
  }

  actors = {};
  getActorValue(key: string) {
    if (this.actors[key] == null) {
      this.actors[key] = this.fbDatabase.getActorValue(key);
    }
    return this.actors[key];
  }
  setActorValue(key: string, value: boolean) {
    return this.fbDatabase.setActorValue(key, value);
  }

  ngOnDestroy() {
    this.alive = false;
    this.sitesSubscription.unsubscribe();
  }
}
