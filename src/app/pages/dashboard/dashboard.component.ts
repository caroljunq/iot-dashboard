import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Observable, interval, combineLatest } from 'rxjs';
import { tap, filter, switchMap, publishReplay, refCount, map } from 'rxjs/operators';

import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { LiveChartService } from 'app/@core/iot-dash/live-chart.service';
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
export class DashboardComponent {
  site$: Observable<Site>;
  currentDate = interval(2000).pipe( map(() => Date.now()));

  constructor(
    private themeService: NbThemeService,
    private firebaseDatabaseService: FirebaseDatabaseService,
    private liveChartService: LiveChartService,
    private route: ActivatedRoute,
  ) {
    this.site$ = combineLatest(
      this.route.paramMap,
      this.themeService.getJsTheme(),
      this.firebaseDatabaseService.getSites(),
    ).pipe(
      map(params => ({
        route: params[0],
        theme: params[1],
        sites: params[2],
        site: params[2].find(site => site.key === params[0].get('id')),
      })),
      // tap(v => console.log(v)),
      map(params => this.firebaseDatabaseService.loadSiteSensorData(
        params.site,
        this.liveChartService,
        params.theme.variables,
        params.theme.variables.echarts,
      )),
      publishReplay(),
      refCount(),
      filter(v => !!v),
    );
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
