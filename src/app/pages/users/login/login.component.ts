import { FormBuilder } from '@angular/forms';
import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  passForgot: boolean = false;
  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  constructor(
    protected usersService: UsersService,
    protected formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  }

  changeForgotBtn() {
    this.passForgot = !this.passForgot;
  }
  error;
  submitDebounceFlag = false;
  async onSubmit() {
    if (this.submitDebounceFlag) return;
    this.submitDebounceFlag = true;
    try {
      if (this.passForgot) {
        return this.usersService.emailForgotPassword(this.loginForm.value.email);
      }
      if (this.loginForm.invalid) {
        return;
      }
      const { email, password } = this.loginForm.value;
      const result = await this.usersService.emailLogin(email, password);
      return result;
    } catch (error) {
      this.error = error;
    } finally {
      this.submitDebounceFlag = false;
    }
  }
}
