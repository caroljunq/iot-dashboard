import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HistoricalDataComponent } from './pages/historical-data/historical-data.component';
import { HistoricalDataModule } from './pages/historical-data/historical-data.module';

import { AuthGuard } from './pages/users/auth.guard';
import { DashboardIdGuard } from './pages/dashboard/dashboard.service';

const routes: Routes = [
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [ DashboardIdGuard] },
  { path: 'historical-data', component: HistoricalDataComponent },
  { path: 'users', loadChildren: './pages/users/users.module#UsersModule' },
  { path: 'rooms', loadChildren: './pages-admin/room-edit/room-edit.module#RoomEditModule', canActivate: [AuthGuard] },
  { path: 'sensors', loadChildren: './pages-admin/devices/devices.module#DevicesModule', canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard/fake', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/fake' },
];

@NgModule({
  imports: [
    // hash is required by firebase
    RouterModule.forRoot(routes, {enableTracing: false, useHash: false}),
    DashboardModule,
    HistoricalDataModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
