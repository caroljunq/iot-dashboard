import { map, tap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { FirebaseDatabaseService } from '../../@core/iot-dash/firebase-database.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardIdGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    protected firebaseDatabaseService: FirebaseDatabaseService,
    protected router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const key = next.params.id;
    return this.firebaseDatabaseService.getSites().pipe(
      filter(sites => !!sites),
      map(sites => {
        const site = sites.find(sitef => sitef.key === key);
        if (!!site) {
          return true;
        }
        if (sites[0]) {
          const newSiteKey = sites[0].key;
          return this.router.parseUrl(`/dashboard/${newSiteKey}`);
        }
        return this.router.parseUrl(`/`);
      }),
      // tap((v: boolean | UrlTree) => console.log('DashboardIdGuard', v.toString())),
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
