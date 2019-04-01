import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { DevicesListComponent } from './devices-list/devices-list.component';

import { DevicesRoutingModule } from './devices-routing.module';


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
})
export class DevicesModule { }

