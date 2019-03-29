import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UsersService } from 'app/pages/users/users.service';
import { StoredUser } from '../user-models';

interface ListedUser extends StoredUser {
  badgeStatus: 'primary'| 'info'| 'success'| 'warning'| 'danger';
  badgeText: 'n'| 'u'| 'a';
  title: 'inativo'| 'usuário'| 'administrador';
}
function mkListedUser(user: StoredUser): ListedUser {
  const { isActive, isAdmin } = user;
  if (isAdmin) {
    return <ListedUser>{
      ...user,
      badgeStatus: 'primary',
      badgeText: 'a',
      title: 'administrador',
    };
  }
  if (isActive) {
    return <ListedUser>{
      ...user,
      badgeStatus: 'info',
      badgeText: 'u',
      title: 'usuário',
    };
  }
  return <ListedUser>{
    ...user,
    badgeStatus: 'danger',
    badgeText: 'n',
    title: 'inativo',
  };
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users$: Observable<ListedUser[]>;

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
