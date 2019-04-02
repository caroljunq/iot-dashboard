import { Component, ChangeDetectionStrategy, OnDestroy, DoCheck, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Observable, interval, combineLatest, of, Subscription } from 'rxjs';
import {
  tap,
  switchMap,
  map,
  takeWhile,
} from 'rxjs/operators';

import { DashboardService, LoadedSite } from 'app/dashboard/dashboard.service';
import { UsersService } from 'app/pages/users/users.service';
import { DashUser } from 'app/pages/users/user-models';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./view-dashboard.component.scss'],
  templateUrl: './view-dashboard.component.html',
})
export class ViewDashboardComponent implements OnDestroy {
  site: LoadedSite;
  siteSubscription: Subscription;
  currentDate = interval(1000).pipe( map(() => Date.now()));
  currentUser: DashUser;
  userSubscription = this.usersService.user$.subscribe(
    currentUser => this.currentUser = currentUser,
  );

  constructor(
    protected route: ActivatedRoute,
    protected dashboardService: DashboardService,
    protected usersService: UsersService,
  ) {
    this.siteSubscription = this.route.paramMap.pipe(
      switchMap(params => this.dashboardService.getLoadedSite(params.get('id'))),
    ).subscribe(
      site => {
        this.site = site;
        // console.log('new site value', site);
      },
      // error => console.log('error', error),
      // () => console.log('complete'),
    );
  }

  ngOnDestroy(): void {
    this.siteSubscription.unsubscribe();
  }
}
