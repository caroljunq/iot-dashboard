import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Observable, interval, combineLatest, of } from 'rxjs';
import { tap, filter, switchMap, publishReplay, refCount, map, takeWhile } from 'rxjs/operators';

import { DashboardService, LoadedSite } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {
  site: LoadedSite;
  currentDate = interval(1000).pipe( map(() => Date.now()));
  alive = true;

  constructor(
    protected route: ActivatedRoute,
    protected dashboardService: DashboardService,
  ) {
    this.route.paramMap.pipe(
      takeWhile(() => this.alive),
      switchMap(params => this.dashboardService.getSite(params.get('id'))),
      // tap(v => console.log('[DashboardComponent]', v, v.sensorsArray.map(s => s.value$.subscribe(
      //   value => console.log('value', value),
      //   error => console.log('error', error),
      //   () => console.log('complete'),
      // )))),
    ).subscribe(
      site => this.site = site,
    );
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
