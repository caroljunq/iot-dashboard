import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { StateService } from 'app/@core/utils';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Site } from 'app/@core/iot-dash/iot-dash-models';

const baseMenu = [
  {
    title: 'Historical Data',
    icon: 'nb-bar-chart',
    link: 'historical-data',
  },
  {
    title: 'Users',
    icon: 'ion-android-people',
    link: 'users',
  },
];

@Component({
  selector: 'app-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  sidebar$: Observable<{}>;
  sites$: Observable<Site[]>;
  menu$: Observable<NbMenuItem[]>;

  constructor(
    protected stateService: StateService,
    private firebaseDatabaseService: FirebaseDatabaseService,
  ) {
    this.sidebar$ = this.stateService.onSidebarState();
    this.menu$ = this.firebaseDatabaseService.getSites().pipe(
      map(
        sites => sites.map(site => ({
          title: site.name || 'Dashboard',
          icon: site.icon || 'nb-home',
          link: 'dashboard/' + site.key,
        })).concat(baseMenu),
      ),
      startWith(baseMenu),
    );
  }
}
