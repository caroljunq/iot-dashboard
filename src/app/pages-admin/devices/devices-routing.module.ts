import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { DevicesListComponent } from './devices-list/devices-list.component';

const routes: Routes = [
  { path: 'list', component: DevicesListComponent },
  { path: 'create', component: DevicesEditComponent },
  { path: ':id', component: DevicesEditComponent },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule { }
