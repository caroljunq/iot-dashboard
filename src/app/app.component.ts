/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { StateService } from './@core/utils';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  menu: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'nb-home',
      link: 'dashboard',
    },
    {
      title: 'Historical Data',
      icon: 'nb-bar-chart',
      link: 'historical-data',
    },
  ];
  sidebar: {};
  alive = true;

  constructor(
    protected stateService: StateService,
  ) {
    this.stateService.onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: {}) => this.sidebar = sidebar);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
