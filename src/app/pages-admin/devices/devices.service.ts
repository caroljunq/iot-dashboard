import { Injectable } from '@angular/core';
import { DevicesModule } from './devices.module';

@Injectable({
  providedIn: DevicesModule,
})
export class DevicesService {

  constructor() { }
}
