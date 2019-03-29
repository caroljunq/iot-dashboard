import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoricalDataComponent } from './pages/historical-data/historical-data.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HistoricalDataModule } from './pages/historical-data/historical-data.module';
import { RoomEditModule } from './pages/room-edit/room-edit.module';
import { DashboardIdGuard } from './dashboard-id.guard';

import { AuthGuard } from './pages/users/auth.guard';
// import { UsersModule } from './pages/users/users.module';

const routes: Routes = [
  { path: 'dashboard', redirectTo: 'dashboard/none', pathMatch: 'full', canActivate: [AuthGuard, DashboardIdGuard] },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    canActivate: [AuthGuard, DashboardIdGuard],
  },
  {
    path: 'historical-data',
    component: HistoricalDataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: './pages/users/users.module#UsersModule',
  },
  {
    path: 'rooms',
    loadChildren: './pages/room-edit/room-edit.module#RoomEditModule',
  },
  { path: '', redirectTo: 'dashboard/none', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    // hash is required by firebase
    RouterModule.forRoot(routes, {enableTracing: false, useHash: false}),
    DashboardModule,
    HistoricalDataModule,
    RoomEditModule 
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
