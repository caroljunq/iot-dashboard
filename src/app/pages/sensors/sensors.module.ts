import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { SensorEditComponent } from './sensor-edit/sensor-edit.component';
import { SensorListComponent } from './sensor-list/sensor-list.component';

import { SensorsRoutingModule } from './sensors-routing.module';


// angular material
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule
} from '@angular/material';


@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    CommonModule,
    SensorsRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  declarations: [ SensorEditComponent, SensorListComponent  ],
  exports: [ SensorEditComponent, SensorListComponent ],
  entryComponents: [  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SensorsModule { }

