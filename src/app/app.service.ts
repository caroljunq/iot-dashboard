import { DashUser } from './pages/users/user-models';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { NbMenuItem } from '@nebular/theme';

import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { FirebaseDatabaseService } from './@core/iot-dash/firebase-database.service';
import { UsersService } from './pages/users/users.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    protected usersService: UsersService,
    protected firebaseDatabaseService: FirebaseDatabaseService,
  ) { }

  getMenu(baseMenu: NbMenuItem[], fakeMenu: NbMenuItem[] = []): Observable<NbMenuItem[]> {
    const siteToMenuItem = (sites: Site[]) => sites.filter(site => !!site).map<NbMenuItem>(site => ({
      title: site.name || 'Dashboard',
      icon: site.icon || 'nb-home',
      link: 'dashboard/' + site.key,
    })).concat(baseMenu);

    return this.usersService.user$.pipe(
      // tap(user => console.log('[AppService]', {user})),
      switchMap<DashUser, NbMenuItem[]>(dashUser => {
        if (!dashUser || !dashUser.storedUser.isActive) {
          return of(fakeMenu);
        }
        if (dashUser.storedUser.isAdmin) {
          return this.firebaseDatabaseService.getSites().pipe(
            map(siteToMenuItem),
          );
        }
        return this.firebaseDatabaseService.getUserSites(dashUser).pipe(
          map(siteToMenuItem),
        );
      }),
      startWith(baseMenu),
      // tap(menu => console.log('[AppService]', {menu})),
    );
  }
}
