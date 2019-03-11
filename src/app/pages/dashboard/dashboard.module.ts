import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { StatusCardDialogComponent } from './status-card/status-card-dialog.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { DeviceMonitoringComponent } from './device-monitoring/device-monitoring.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent, StatusCardDialogComponent,
    RoomSelectorComponent,
    DeviceMonitoringComponent,
    RoomsComponent,
  ],
  entryComponents: [
    StatusCardDialogComponent,
  ],
})
export class DashboardModule { }
