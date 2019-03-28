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

  googleLogin() {
    this.usersService.googleLogin().then(
      () => setTimeout(
        // wait 10ms for user$ to reach AuthGuard
        () => this.router.navigate(['/']),
        10,
      ),
      () => null,
    );
  }

  changeForgotBtn() {
    this.passForgot = !this.passForgot;
  }
}
