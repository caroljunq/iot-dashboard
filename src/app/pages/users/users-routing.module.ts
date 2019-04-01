import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { AuthGuard, NoAuthGuard, AdminGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: UserEditComponent, canActivate: [NoAuthGuard]},
  { path: 'list', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: ':id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: AuthGuard, useClass: AuthGuard },
    { provide: NoAuthGuard, useClass: NoAuthGuard },
    { provide: AdminGuard, useClass: AdminGuard },
  ],
})
export class UsersRoutingModule { }
