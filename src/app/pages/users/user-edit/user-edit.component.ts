import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, takeWhile, map, take } from 'rxjs/operators';

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
  profileForm = new FormGroup({
    fullName: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
    emailAddress: new FormControl('', [ Validators.email ]),
    password: new FormControl('', [Validators.minLength(6)]),
    repeatPassword: new FormControl('', [
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
    termsConditions: new FormControl(true, []),
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

  onSubmitFlag = false;
  error;
  async onSubmit() {
    if (this.onSubmitFlag) return;
    this.onSubmitFlag = true;
    try {
      const { emailAddress, fullName, password } = this.profileForm.value;
      const name = fullName;
      const displayName = fullName;
      const email = emailAddress;
      if (this.editMode) {
        const paramMap = await this.route.paramMap.pipe(take(1)).toPromise();
        const id = paramMap.get('id');
        const user = await this.usersService.getUser(id).pipe(take(1)).toPromise();
        await this.usersService.updateUser({
          ...user,
          name, displayName,
        });
        return;
      }
      if (this.profileForm.invalid) {
        return;
      }
      const result = await this.usersService.emailUserCreate({email, password, fullName});
      return;
    } catch (error) {
      this.error = error;
    } finally {
      this.onSubmitFlag = false;
    }
  }
}
