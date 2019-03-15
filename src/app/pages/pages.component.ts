import { Component } from '@angular/core';
import { NbMenuItem, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { MENU_ITEMS } from './pages-menu';
import { LiveChartService } from 'app/@core/iot-dash/live-chart.service';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Site } from 'app/@core/iot-dash/iot-dash-models';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {
  sites$: Observable<Site[]>;
  menu$: Observable<NbMenuItem[]>;
  menu = MENU_ITEMS;
  constructor(
    // private themeService: NbThemeService,
    // private firebaseDatabaseService: FirebaseDatabaseService,
    // private liveChartService: LiveChartService,
  ) {
    // debugger;
    // this.sites$ = this.themeService.getJsTheme().pipe(
    //   switchMap(theme =>
    //     this.firebaseDatabaseService
    //       .getSites()
    //       .pipe(
    //         map(sites =>
    //           this.firebaseDatabaseService.loadSiteSensorData(
    //             sites,
    //             this.liveChartService,
    //             theme.variables,
    //             theme.variables.echarts,
    //           ),
    //         ),
    //       ),
    //   ),
    //   // tap(res => (this.selectedRoom = this.selectedRoom || res[0]))
    // );
    // this.menu$ = this.sites$.pipe(
    //   map(
    //     sites => sites.map(site => ({
    //       title: 'Dashboard' + site.name,
    //       icon: site.icon || 'nb-home',
    //       link: '/pages/iot-dashboard/' + site.key,
    //     })).concat([{
    //       title: 'Historical Data',
    //       icon: 'nb-bar-chart',
    //       link: '/pages/historical-data',
    //     }]),
    //   ),
    // );
  }
}
