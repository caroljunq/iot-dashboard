import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  passForgot: boolean = false;

  constructor(
    protected usersService: UsersService,
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  changeForgotBtn() {
    this.passForgot = !this.passForgot;
  }
}
