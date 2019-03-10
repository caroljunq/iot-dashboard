import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
<<<<<<< HEAD
import { SolarData } from '../../@core/data/solar';
import { Observable } from 'rxjs';
import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
=======
>>>>>>> f4c4d1125de8ca93102be96eb0484cc6bcaf72c3

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
    private solarService: SolarData,
    private fbDatabase: FirebaseDatabaseService,
  ) {
    this.sites = this.fbDatabase.getSites();

<<<<<<< HEAD
    this.themeService
      .getJsTheme()
=======
  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
>>>>>>> f4c4d1125de8ca93102be96eb0484cc6bcaf72c3
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

<<<<<<< HEAD
    this.solarService
      .getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.solarValue = data;
      });
=======

>>>>>>> f4c4d1125de8ca93102be96eb0484cc6bcaf72c3
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
