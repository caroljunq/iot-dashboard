import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { take, map, catchError, publishReplay, refCount } from 'rxjs/operators';

import { ROOT_DATA, Device } from 'app/@core/iot-dash/iot-dash-models';
import { cachedFn } from 'app/dashboard/dashboard.service';

@Injectable()
export class DevicesService {

  constructor(
    protected angularFireDatabase: AngularFireDatabase,
  ) { }

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

  @cachedFn()
  getAllDevices(): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`${ROOT_DATA.devices}`).valueChanges().pipe(
      publishReplay(1),
      refCount(),
    );
  }
}

@Injectable()
export class DevicesIdGuard implements CanActivate {
  constructor(
    protected deviceService: DevicesService,
    protected router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const deviceKey = next.params.id;
    // console.log('[canActivate]', {key, comp: next.component});
    return this.deviceService.getAllDevices().pipe(
      take(1),
      map(devices => {
        if (!devices || devices.length === 0) {
          throw new Error('No Site Resolved');
        }
        const resolvedDevice = devices.find(device => device.key === deviceKey);
        if (!resolvedDevice) {
          return this.router.parseUrl(`/devices/list`);
        }
        return true;
      }),
      catchError(error => {
        console.error(error);
        return of(this.router.parseUrl(`/`));
      }),
    );
  }
}

