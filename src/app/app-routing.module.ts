import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoricalDataComponent } from './pages/historical-data/historical-data.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HistoricalDataModule } from './pages/historical-data/historical-data.module';
import { DashboardIdGuard } from './dashboard-id.guard';

const routes: Routes = [
  { path: 'dashboard', redirectTo: 'dashboard/none', pathMatch: 'full' },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    canActivate: [DashboardIdGuard],
  },
  {
    path: 'historical-data',
    component: HistoricalDataComponent,
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
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
