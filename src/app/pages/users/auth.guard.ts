import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

import { LoginComponent } from './login/login.component';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    protected usersService: UsersService,
    protected router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(`[canActivate] url: '${state.url}', component: '${(<Function>next.component).name}',`);
    return this.usersService.user$.pipe(
      take(1),
      // tap(user => console.log(`[canActivate] user: '${user}', component: '${(<Function>next.component).name}',`)),
      map(user => {
        if (next.component === LoginComponent) {
          if (user) {
            return this.router.parseUrl('/');
          } else {
            return true;
          }
        }
        if (!user) {
          return this.router.parseUrl('/users/login');
        }
        return true;
      }),
      // tap(v => console.log(`[canActivate] => '${v}'`)),
    );
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}

@Injectable()
export class NoAuthGuard extends AuthGuard {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.usersService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        }
        return this.router.parseUrl('/');
      }),
    );
  }
}
@Injectable()
export class AdminGuard extends AuthGuard {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.usersService.user$.pipe(
      take(1),
      map(user => {
        if (user && user.storedUser.isAdmin) {
          return true;
        }
        return this.router.parseUrl('/');
      }),
    );
  }
}
