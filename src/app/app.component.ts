import { AngularFireDatabase } from '@angular/fire/database';
import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';

import { DashUser } from './pages/users/user-models';
import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { UsersService } from './pages/users/users.service';

@Component({
  selector: 'app-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menu$: Observable<NbMenuItem[]>;

  constructor(
    protected usersService: UsersService,
    protected firebaseDatabaseService: FirebaseDatabaseService,
    protected angularFireDatabase: AngularFireDatabase,
  ) {
    const fakeDash: NbMenuItem = {
      title: 'Dashboard Teste',
      icon: 'nb-home',
      link: 'dashboard/fake',
    };
    const historicalData: NbMenuItem = {
      title: 'Historical Data',
      icon: 'nb-bar-chart',
      link: 'historical-data',
    };
    const users: NbMenuItem = {
      title: 'Users',
      icon: 'ion-android-people',
      link: 'users/list',
    };
    const novoSite: NbMenuItem = {
      title: 'Novo Site',
      icon: 'nb-e-commerce',
      link: 'rooms/create',
    };
    const devices: NbMenuItem = {
      title: 'Sensors',
      icon: 'ion-android-wifi',
      link: 'sensors/',
    };
    const siteToMenuItem = (sites: Site[]) => sites.filter(site => !!site).map<NbMenuItem>(site => ({
      title: site.name || 'Dashboard',
      icon: 'nb-home',
      link: 'dashboard/' + site.key,
    }));

    this.menu$ = this.usersService.user$.pipe(
      switchMap<DashUser, NbMenuItem[]>(dashUser => {
        if (!dashUser) {
          return of([fakeDash, historicalData]);
        }
        if (!dashUser.storedUser.isActive) {
          return of([fakeDash, historicalData, users]);
        }
        if (dashUser.storedUser.isAdmin) {
          return this.angularFireDatabase.list<Site>('sites').valueChanges().pipe(
            map(sites => [fakeDash, ...siteToMenuItem(sites), historicalData, users, novoSite, devices]),
          );
        }
        return this.angularFireDatabase.list<string>(`userSites/${dashUser.authUser.uid}`).valueChanges().pipe(
          switchMap(userSites => combineLatest(userSites.map(
            userSite => this.angularFireDatabase.object<Site>(`sites/${userSite}`).valueChanges(),
          ))),
          map(sites => [fakeDash, ...siteToMenuItem(sites), historicalData, users]),
        );
      }),
      startWith([fakeDash, historicalData]),
    );
  }
}
