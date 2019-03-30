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
  baseMenu = [
    {
      title: 'Historical Data',
      icon: 'nb-bar-chart',
      link: 'historical-data',
    },
    {
      title: 'Users',
      icon: 'ion-android-people',
      link: 'users/list',
    },
  ];
  fakeMenu = [
    {
      title: 'Dashboard',
      icon: 'nb-home',
      link: 'dashboard/fake',
    },
    {
      title: 'Users',
      icon: 'ion-android-people',
      link: 'users/list',
    },
  ];

  constructor(
    protected usersService: UsersService,
    protected firebaseDatabaseService: FirebaseDatabaseService,
    protected angularFireDatabase: AngularFireDatabase,
  ) {
    this.menu$ = this.getMenu(this.baseMenu, this.fakeMenu);
  }

  getMenu(baseMenu: NbMenuItem[], fakeMenu: NbMenuItem[] = []): Observable<NbMenuItem[]> {
    const siteToMenuItem = (sites: Site[]) => sites.filter(site => !!site).map<NbMenuItem>(site => ({
      title: site.name || 'Dashboard',
      icon: 'nb-home',
      link: 'dashboard/' + site.key,
    })).concat(baseMenu);

    return this.usersService.user$.pipe(
      // tap(user => console.log('[AppService]', {user})),
      switchMap<DashUser, NbMenuItem[]>(dashUser => {
        if (!dashUser || !dashUser.storedUser.isActive) {
          return of(fakeMenu);
        }
        if (dashUser.storedUser.isAdmin) {
          return this.angularFireDatabase.list<Site>('sites').valueChanges().pipe(
            map(siteToMenuItem),
          );
        }
        return this.angularFireDatabase.list<string>(`userSites/${dashUser.authUser.uid}`).valueChanges().pipe(
          // tap(userSites => console.log('[FirebaseDatabaseService.getUserSites]', {userSites})),
          switchMap(userSites => combineLatest(userSites.map(
            userSite => this.angularFireDatabase.object<Site>(`sites/${userSite}`).valueChanges(),
          ))),
          map(siteToMenuItem),
        );
      }),
      startWith(baseMenu),
      // tap(menu => console.log('[AppService]', {menu})),
    );
  }
}
