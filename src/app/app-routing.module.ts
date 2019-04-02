import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HistoricalDataComponent } from './pages/historical-data/historical-data.component';
import { HistoricalDataModule } from './pages/historical-data/historical-data.module';

import { AuthGuard } from './pages/users/auth.guard';

const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [] },
  { path: 'historical-data', component: HistoricalDataComponent },
  { path: 'users', loadChildren: './pages/users/users.module#UsersModule' },
  { path: 'devices', loadChildren: './pages-admin/devices/devices.module#DevicesModule', canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard/fake', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/fake' },
];

@NgModule({
  imports: [
    // hash is required by firebase
    RouterModule.forRoot(routes, {enableTracing: false, useHash: false}),
    HistoricalDataModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
