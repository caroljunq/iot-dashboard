import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SensorEditComponent } from './sensor-edit.component';

import { AuthGuard } from '../users/auth.guard';

const routes: Routes = [
  { path: '', component: SensorEditComponent},
  { path: 'create', component: SensorEditComponent},
  { path: ':id', component: SensorEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorEditRoutingModule { }
