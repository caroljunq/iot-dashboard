import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SensorEditComponent } from './sensor-edit.component';

import { AuthGuard } from '../users/auth.guard';

const routes: Routes = [
  { path: '', component: SensorEditComponent,canActivate: [AuthGuard]},
  { path: 'create', component: SensorEditComponent,canActivate: [AuthGuard]},
  { path: ':id', component: SensorEditComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorEditRoutingModule { }
