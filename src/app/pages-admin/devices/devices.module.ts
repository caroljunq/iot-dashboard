import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';
// angular material
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule,
} from '@angular/material';

import { ThemeModule } from '../../@theme/theme.module';
import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DevicesService, DevicesIdGuard } from './devices.service';

const routes: Routes = [
  { path: 'list', component: DevicesListComponent },
  { path: 'create', component: DevicesEditComponent },
  { path: ':id', component: DevicesEditComponent, canActivate: [DevicesIdGuard] },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DevicesIdGuard],
})
export class DevicesRoutingModule { }

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    CommonModule,
    DevicesRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  declarations: [ DevicesEditComponent, DevicesListComponent ],
  exports: [ DevicesEditComponent, DevicesListComponent ],
  providers: [
    DevicesService,
  ],
})
export class DevicesModule { }

