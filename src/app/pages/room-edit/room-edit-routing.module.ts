import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomEditComponent } from './room-edit.component';

import { AuthGuard } from '../users/auth.guard';

const routes: Routes = [
  { path: '', component: RoomEditComponent,canActivate: [AuthGuard]},
  { path: 'create', component: RoomEditComponent,canActivate: [AuthGuard]},
  { path: ':id', component: RoomEditComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomEditRoutingModule { }
