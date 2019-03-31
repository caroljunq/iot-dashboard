import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { DevicesListComponent } from './devices-list/devices-list.component';

const routes: Routes = [
  { path: '', component: DevicesListComponent },
  { path: 'list', component: DevicesListComponent },
  { path: 'create', component: DevicesEditComponent },
  { path: ':id', component: DevicesEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule { }
