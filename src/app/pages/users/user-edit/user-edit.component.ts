import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

import { UsersService } from 'app/pages/users/users.service';
import { StoredUser } from '../user-models';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  active = true;
  user$: Observable<StoredUser>;

  constructor(
    protected route: ActivatedRoute,
    protected usersService: UsersService,
  ) {
    this.user$ = this.route.paramMap.pipe(
      takeWhile(() => this.active),
      switchMap(paramMap => this.usersService.getUser(paramMap.get('id'))),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.active = false;
  }

}
