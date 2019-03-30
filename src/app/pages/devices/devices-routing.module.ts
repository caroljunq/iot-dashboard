import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { DevicesListComponent } from './devices-list/devices-list.component';


import { AuthGuard } from '../users/auth.guard';

const routes: Routes = [
  { path: '', component: DevicesListComponent, canActivate: [AuthGuard]},
  { path: 'list', component: DevicesListComponent, canActivate: [AuthGuard]},
  { path: 'create', component: DevicesEditComponent, canActivate: [AuthGuard]},
  { path: ':id', component: DevicesEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule { }
