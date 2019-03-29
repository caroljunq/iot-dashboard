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
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.usersService.emailLogin(email, password);
  }
}
