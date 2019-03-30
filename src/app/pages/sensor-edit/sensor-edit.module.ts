import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { SensorEditComponent } from './sensor-edit.component';

import { SensorEditRoutingModule } from './sensor-edit-routing.module';


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
    SensorEditRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  declarations: [ SensorEditComponent ],
  exports: [ SensorEditComponent ],
  entryComponents: [  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SensorEditModule { }

