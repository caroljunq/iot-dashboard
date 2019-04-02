import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UsersService } from 'app/pages/users/users.service';
import { StoredUser, DashUser } from '../user-models';

interface ListedUser extends StoredUser {
  badgeStatus: 'primary'| 'info'| 'success'| 'warning'| 'danger';
  badgeText: 'n'| 'u'| 'a';
  title: string;
}
function mkListedUser(user: StoredUser): ListedUser {
  const { isActive, isAdmin } = user;
  const listedUser: ListedUser = {
    ...user,
    badgeStatus: 'danger',
    badgeText: 'n',
    title: 'inativo',
  };
  if (isActive) {
    listedUser.badgeStatus = 'info';
    listedUser.badgeText = 'u';
    listedUser.title = 'usuário';
  }
  if (isAdmin) {
    listedUser.badgeStatus = 'primary';
    listedUser.badgeText = 'a';
    listedUser.title = 'administrador';
  }
  if (user.email) {
    listedUser.title = user.email;
  }
  return listedUser;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users$: Observable<ListedUser[]>;
  currentUser: DashUser;
  userSubscription = this.usersService.user$.subscribe(
    currentUser => this.currentUser = currentUser,
  );

  constructor(
    protected usersService: UsersService,
  ) {
    this.users$ = this.usersService.getUsersList().pipe(
      map<StoredUser[], ListedUser[]>(
        userList => userList.map<ListedUser>(user => mkListedUser(user)),
      ),
    );
  }

  ngOnInit() {
  }

  chageActive(user: StoredUser, isActive: boolean) {
    this.update({...user, isActive});
  }
  chageAdmin(user: StoredUser, isAdmin: boolean) {
    this.update({...user, isAdmin});
  }
  update(user: StoredUser) {
    this.usersService.updateUser(user);
  }

}
