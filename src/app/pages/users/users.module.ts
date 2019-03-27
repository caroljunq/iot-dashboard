import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ThemeModule } from '../../@theme/theme.module';


@NgModule({
  declarations: [LoginComponent, UsersListComponent, UserEditComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ThemeModule
  ],
})
export class UsersModule { }
