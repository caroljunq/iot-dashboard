import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of, combineLatest } from 'rxjs';
import { map, filter, publishReplay, refCount, take, catchError, tap, switchMap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, UserSites } from './iot-dash-models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(protected angularFireDatabase: AngularFireDatabase) {
    // if (!environment.production) {
    //   // this.angularFireDatabase.object('/').update(getSampleData());
    // }
  }
  getSite(key: string): Observable<Site> {
    return this.angularFireDatabase.object<Site>(`sites/${key}`).valueChanges();
  }
  getSensorSites(key: string): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`sites/${key}/sensors`).valueChanges();
  }

  createSite(site: Site) {
    const siteRef = this.angularFireDatabase.database.ref('sites11').push();
    site.key = siteRef.key;
    return siteRef.update(site);
  }

  getSitesUsers() {
    return this.angularFireDatabase.object<UserSites>(`userSites/`).valueChanges().pipe(
      map(userList => {
        const users = Object.keys(userList);
        const sitesEntries = Object.values(userList);
        const sitesUsers = {};
        for (let index = 0; index < sitesEntries.length; index++) {
          const siteEntry = sitesEntries[index];
          for (const siteKey of Object.keys(siteEntry)) {
            if (!sitesUsers[siteKey]) {
              sitesUsers[siteKey] = [];
            }
            sitesUsers[siteKey].push(users[index]);
          }
        }
        return sitesUsers;
      }),
    );
  }

  // getUserSites(dashUser: DashUser): any {
  //   return this.angularFireDatabase.list<string>(`userSites/${dashUser.authUser.uid}`).valueChanges().pipe(
  //     tap(userSites => console.log('[FirebaseDatabaseService.getUserSites]', {userSites})),
  //     switchMap(userSites => combineLatest(userSites.map(
  //       userSite => this.getSite(userSite),
  //     ))),
  //   );
  // }

  createDevice(device: Device) {
    const deviceRef = this.angularFireDatabase.database.ref('sensors').push();
    device.key = deviceRef.key;
    return deviceRef.update(device);
  }

  getDeviceById(id: string): Observable<Device> {
    return this.angularFireDatabase.object<Device>(`sensors/${id}`).valueChanges();
  }

  updateDevice(id: string, device: Device) {
    return this.angularFireDatabase.object(`sensors/${id}`).update(device);
  }

  getAllDevices(): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>('sensors').valueChanges();
  }
}
