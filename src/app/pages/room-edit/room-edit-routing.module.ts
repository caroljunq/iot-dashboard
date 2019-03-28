import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomEditComponent } from './room-edit.component';

import { AuthGuard } from '../users/auth.guard';

const routes: Routes = [
  { path: '', component: RoomEditComponent},
  { path: 'create', component: RoomEditComponent},
  { path: ':id', component: RoomEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomEditRoutingModule { }
