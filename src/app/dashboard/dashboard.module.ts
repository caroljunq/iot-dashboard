import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { GaugeModule } from 'angular-gauge';
import { NbDialogModule } from '@nebular/theme';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule,
} from '@angular/material';

import { ThemeModule } from 'app/@theme/theme.module';

import { EditViewDashboardComponent } from 'app/dashboard/edit-dashboard/edit-dashboard.component';

import { DashboardService, DashboardIdGuard } from './dashboard.service';
import { ViewDashboardComponent } from 'app/dashboard/view-dashboard/view-dashboard.component';
import { StatusCardComponent } from './view-dashboard/status-card/status-card.component';
import { StatusCardDialogComponent } from './view-dashboard/status-card/status-card-dialog.component';
import { DeviceMonitoringComponent } from './view-dashboard/device-monitoring/device-monitoring.component';

const routes: Routes = [
  { path: 'create', component: EditViewDashboardComponent, canActivate: [] },
  { path: 'edit/:id', component: EditViewDashboardComponent, canActivate: [DashboardIdGuard] },
  { path: ':id', component: ViewDashboardComponent, canActivate: [DashboardIdGuard] },
  { path: '**', redirectTo: 'fake' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }

const components = [
  ViewDashboardComponent,
  EditViewDashboardComponent,
  StatusCardComponent,
  StatusCardDialogComponent,
  DeviceMonitoringComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    // ------ view --------
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    GaugeModule.forRoot(),
    // ------ edit --------
    // MatButtonModule,
    // MatFormFieldModule,
    // MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    { provide: DashboardService, useClass: DashboardService },
    { provide: DashboardIdGuard, useClass: DashboardIdGuard },
  ],
  entryComponents: [
    StatusCardDialogComponent,
  ],
})
export class DashboardModule { }
