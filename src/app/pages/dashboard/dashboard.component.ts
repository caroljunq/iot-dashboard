import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators' ;
import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnDestroy {
  private alive = true;

  lightCard: CardSettings = {
    title: "Light",
    iconClass: "nb-lightbulb",
    type: "primary"
  };
  rollerShadesCard: CardSettings = {
    title: "Roller Shades",
    iconClass: "nb-roller-shades",
    type: "success"
  };
  wirelessAudioCard: CardSettings = {
    title: "Wireless Audio",
    iconClass: "nb-audio",
    type: "info"
  };
  coffeeMakerCard: CardSettings = {
    title: "Coffee Maker",
    iconClass: "nb-coffee-maker",
    type: "warning"
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard
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
        type: "warning"
      },
      {
        ...this.rollerShadesCard,
        type: "primary"
      },
      {
        ...this.wirelessAudioCard,
        type: "danger"
      },
      {
        ...this.coffeeMakerCard,
        type: "secondary"
      }
    ]
  };
  sites: Observable<Site[]>;

  constructor(
    private themeService: NbThemeService,
    private fbDatabase: FirebaseDatabaseService,
  ) {
    this.sites = this.fbDatabase.getSites();

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

  }

  sensors = {};
  getSensorValue(key) {
    if (this.sensors[key] == null) {
      this.sensors[key] = this.fbDatabase.getSensorValue(key);
    }
    return this.sensors[key];
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
