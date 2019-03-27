import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [] },
  { path: 'cadastro', component: UserEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
