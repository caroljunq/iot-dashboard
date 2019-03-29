import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

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

  constructor(
    protected appService: AppService,
  ) {
    this.menu$ = this.appService.getMenu(this.baseMenu);
  }
}
