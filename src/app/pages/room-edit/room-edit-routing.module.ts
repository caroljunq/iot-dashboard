import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomEditComponent } from './room-edit.component';

const routes: Routes = [
  { path: 'create', component: RoomEditComponent },
  { path: ':id', component: RoomEditComponent },
  { path: '**', redirectTo: 'create' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomEditRoutingModule { }
