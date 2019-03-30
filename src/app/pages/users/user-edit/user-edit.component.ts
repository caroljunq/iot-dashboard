import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, takeWhile, map } from 'rxjs/operators';

import { UsersService } from 'app/pages/users/users.service';
import { StoredUser } from '../user-models';

interface ProfileForm {
  fullName: string;
  emailAddress: string;
  password: string;
  repeatPassword: string;
  termsConditions: boolean;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  isActive = true;
  profileForm = this.formBuilder.group({
    fullName: [''],
    emailAddress: [''],
    password: [''],
    repeatPassword: [''],
    termsConditions: [true],
  });
  editMode = false;

  constructor(
    protected route: ActivatedRoute,
    protected usersService: UsersService,
    protected formBuilder: FormBuilder,
  ) {
    this.route.paramMap.pipe(
      takeWhile(() => this.isActive),
      switchMap<ParamMap, StoredUser>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          return this.usersService.getUser(id);
        }
        return of(<StoredUser>{
          uid: '',
          displayName: '',
          photoURL: '',
          email: '',
          isActive: false,
          isAdmin: false,
        });
      }),
      map<StoredUser, ProfileForm>(user => ({
        fullName: user.displayName,
        emailAddress: user.email,
        password: null,
        repeatPassword: null,
        termsConditions: false,
      })),
    ).subscribe(
      user => this.profileForm.setValue(user),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }
    const { emailAddress, fullName, password } = this.profileForm.value;
    this.usersService.emailUserCreate({email: emailAddress, password, fullName});
  }
}
