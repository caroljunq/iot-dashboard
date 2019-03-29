import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { RoomEditComponent } from './room-edit.component';

import { RoomEditRoutingModule } from './room-edit-routing.module';

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
    RoomEditRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  declarations: [ RoomEditComponent ],
  exports: [ RoomEditComponent ],
  entryComponents: [  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoomEditModule { }

