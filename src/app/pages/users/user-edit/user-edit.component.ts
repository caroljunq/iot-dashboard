import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  formValue = {
    fullName: '',
    emailAddress: '',
    password: '',
    repeatPassword: '',
    termsConditions: true,
  };
  profileForm = new FormGroup(
    {
      fullName: new FormControl(this.formValue.fullName, [ Validators.required, Validators.minLength(6) ]),
      emailAddress: new FormControl(this.formValue.emailAddress, [ Validators.email ]),
      password: new FormControl(this.formValue.password, [Validators.minLength(6)]),
      repeatPassword: new FormControl(this.formValue.repeatPassword, [
        Validators.minLength(6),
        (control: AbstractControl): ValidationErrors | null => {
          if (
            this.profileForm &&
            this.profileForm.value.password &&
            control.value &&
            this.profileForm.value.password !== control.value
          ) {
            return {'repeatPassword': 'Passswords dont match'};
          }
        },
      ]),
      termsConditions: new FormControl(this.formValue.termsConditions, []),
    },
  );
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
    const { emailAddress, fullName, password } = this.profileForm.value;
    const name = fullName;
    const displayName = fullName;
    const email = emailAddress;
    if (this.editMode) {
      this.usersService.user$.subscribe(user => {
        this.usersService.updateUser({
          ...user.storedUser,
          name, displayName,
        });
      });
      return;
    }
    if (this.profileForm.invalid) {
      return;
    }
    return this.usersService.emailUserCreate({email, password, fullName});
  }
}
