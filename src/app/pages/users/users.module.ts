import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NoAuthGuard } from './auth.guard';


@NgModule({
  declarations: [LoginComponent, UsersListComponent, UserEditComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ThemeModule,
  ],
  providers: [
    { provide: NoAuthGuard, useClass: NoAuthGuard },
  ],
})
export class UsersModule { }
