import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { HistoricalDataComponent } from './historical-data.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
  ],
  declarations: [ HistoricalDataComponent ],
  exports: [ HistoricalDataComponent ],
  entryComponents: [  ],
})
export class HistoricalDataModule { }

