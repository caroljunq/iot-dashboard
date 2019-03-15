import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoricalDataComponent } from './pages/historical-data/historical-data.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HistoricalDataModule } from './pages/historical-data/historical-data.module';

const routes: Routes = [
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'historical-data',
    component: HistoricalDataComponent,
  },
  { path: '', redirectTo: 'historical-data', pathMatch: 'full' },
  { path: '**', redirectTo: 'historical-data' },
];

@NgModule({
  imports: [
    // hash is required by firebase
    RouterModule.forRoot(routes, {useHash: true}),
    DashboardModule,
    HistoricalDataModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
