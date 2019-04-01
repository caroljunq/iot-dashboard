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

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./view-dashboard.component.scss'],
  templateUrl: './view-dashboard.component.html',
})
export class ViewDashboardComponent implements OnDestroy {
  site: LoadedSite;
  siteSubscription: Subscription;
  currentDate = interval(1000).pipe( map(() => Date.now()));

  constructor(
    protected route: ActivatedRoute,
    protected dashboardService: DashboardService,
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
