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

import { DashboardService, LoadedSite } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {
  site: LoadedSite;
  siteSubscription: Subscription;
  currentDate = interval(1000).pipe( map(() => Date.now()));
  alive = true;

  constructor(
    protected route: ActivatedRoute,
    protected dashboardService: DashboardService,
  ) {
    this.siteSubscription = this.route.paramMap.pipe(
      takeWhile(() => this.alive),
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
    this.alive = false;
    this.siteSubscription.unsubscribe();
  }
}
