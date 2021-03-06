import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbMenuService, NbSidebarService, NbMenuItem } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { UsersService } from 'app/pages/users/users.service';
import { Subscription } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { Router } from "@angular/router";


@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() position = 'normal';
  // used to finish subscriptions by takeWhile
  isActive = true;

  user: any = { name: 'Nick Jones', picture: 'assets/images/nick.png' };
  userSub$: Subscription;

  profileMenu = {
    title: 'Profile',
    link: '/users/none',
  };
  logoutMenu = {
    title: 'Log out',
    data: {
      click: () => this.logout(),
    }
  };
  userMenu: NbMenuItem[] = [
    this.profileMenu,
    this.logoutMenu,
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    protected usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub$ = this.usersService.user$.pipe(takeWhile(() => this.isActive)).subscribe(user => {
      if (!user) {
        this.user = null;
        this.userMenu = null;
        return;
      }
      this.profileMenu.link = `/users/${user.storedUser.uid}`;
      this.userMenu = [
        this.profileMenu,
        this.logoutMenu,
      ];
      this.user = {
        name: user.storedUser.displayName,
        picture: user.storedUser.photoURL,
        color: user.storedUser.color,
      };
    });
    this.menuService.onItemClick().pipe(
      takeWhile(() => this.isActive),
      filter(click => this.logoutMenu === click.item),
    ).subscribe(click => click.item.data.click());
  }

  ngOnDestroy() {
    this.isActive = false;
  }

  logout() {
    this.usersService.signOut()
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    //
  }
}
