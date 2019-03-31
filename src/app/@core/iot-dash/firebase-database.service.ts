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

  async createSite(site: Site) {
    const siteRef = this.angularFireDatabase.database.ref('sites11').push();
    site.key = siteRef.key;
    const newSite = await siteRef.update(site);
    return siteRef.key;
  }

  getSite(key: string): Observable<Site> {
    return this.angularFireDatabase.object<Site>(`sites11/${key}`).valueChanges();
  }

  updateSite(key: string, site: Site){
    return this.angularFireDatabase.object(`sites11/${key}`).update(site);
  }

  getSensorSites(key: string): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`sites/${key}/sensors`).valueChanges();
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

  insertMultipleSiteUsers(siteKey: string, selectedUsers: string[]) {
    return Promise.all(
      selectedUsers.map(
        userKey => this.addUserToSite(siteKey, userKey),
      ),
    );
  }
  removeUserFromSite(siteKey: string, userKey: string) {
    return this.angularFireDatabase.database.ref(`userSites/${userKey}/${siteKey}`).remove();
  }
  addUserToSite(siteKey: string, userKey: string) {
    return this.angularFireDatabase.database.ref(`userSites/${userKey}/${siteKey}`).set(siteKey);
  }

  getSiteDevices(key: string): Observable<Device[]> {
    return this.angularFireDatabase.object<Site>(`sites/${key}`).valueChanges().pipe(
      filter(site => !!site),
      switchMap(
        (site: Site) => combineLatest(Object.keys(site.devices).map(
          deviceKey => this.angularFireDatabase.object<Device>(`devices/${deviceKey}`).valueChanges(),
        )),
      ),
    );
  }

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
