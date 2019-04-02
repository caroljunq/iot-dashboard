import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of, combineLatest } from 'rxjs';
import { map, filter, publishReplay, refCount, take, catchError, tap, switchMap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, UserSites, ROOT_DATA } from './iot-dash-models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(protected angularFireDatabase: AngularFireDatabase) {
    // if (!environment.production) {
    //   // this.angularFireDatabase.object('/').update(getSampleData());
    // }
  }

  createDevice(device: Device) {
    const deviceRef = this.angularFireDatabase.database.ref(`${ROOT_DATA.devices}`).push();
    device.key = deviceRef.key;
    return deviceRef.update(device);
  }

  getDeviceById(id: string): Observable<Device> {
    return this.angularFireDatabase.object<Device>(`${ROOT_DATA.devices}/${id}`).valueChanges();
  }

  updateDevice(id: string, device: Device) {
    return this.angularFireDatabase.object(`${ROOT_DATA.devices}/${id}`).update(device);
  }

  getAllDevices(): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`${ROOT_DATA.devices}`).valueChanges();
  }
}
