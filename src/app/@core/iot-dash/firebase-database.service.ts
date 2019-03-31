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

  createSite(site: Site) {
    const siteRef = this.angularFireDatabase.database.ref('sites11').push();
    site.key = siteRef.key;
    return siteRef.push(site);
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


  insertMultipleSiteUsers(siteKey,selectedUsers){
    console.log(siteKey)
    // return this.angularFireDatabase.object(`userSites/${userId}`).push(selectedUsers);
  }



  // getSites(): Observable<Site[]> {
  //   if (this.sites$) {
  //     return this.sites$;
  //   }
  //   this.sites$ = this.angularFireDatabase.object<{ [key: string]: Site }>('sites').valueChanges().pipe(
  //     catchError(err => {
  //       console.error(err);
  //       return of();
  //     }),
  //     map(value =>
  //       Object.entries(value).map(
  //         siteEntry =>
  //           <Site>{
  //             ...siteEntry[1],
  //             key: siteEntry[0],
  //             sensorsArray: Object.entries(siteEntry[1].sensors || {}).map(
  //               sensorEntry =>
  //                 <Device>{
  //                   key: sensorEntry[0],
  //                   ...sensorEntry[1],
  //                 },
  //             ),
  //             actorsArray: Object.entries(siteEntry[1].actors || {}).map(
  //               sensorEntry =>
  //                 <Device>{
  //                   key: sensorEntry[0],
  //                   ...sensorEntry[1],
  //                 },
  //             ),
  //           },
  //       ),
  //     ),
  //     // tap(v => console.log(v)),
  //     publishReplay(),
  //     refCount(),
  //     filter(v => !!v),
  //   );
  //   return this.sites$;
  // }

  // getSite(key: string): Observable<Site> {
  //   return this.angularFireDatabase.object<Site>(`sites/${key}`).valueChanges();
  // }
  // getSensorSites(key: string): Observable<Device[]> {
  //   return this.angularFireDatabase.list<Device>(`sites/${key}/sensors`).valueChanges();
  // }

  // getLast<T>(path: string, limit = 1): Observable<T[]> {
  //   return this.angularFireDatabase.list<T>(
  //     path,
  //     ref => ref.orderByChild('timestamp').limitToLast(limit),
  //   ).valueChanges();
  // }

  // getLastSensorValues(key: string, limit = 1) {
  //   return this.getLast<TimedValue<number>>(`sensorData/${key}`, limit);
  // }
  // getSensorValue(key: string) {
  //   return this.getLastSensorValues(key).pipe(
  //     map(list => list[0]),
  //     filter(value => value !== null && value !== undefined),
  //   );
  // }

  // setSensorValue(key: string, value: number) {
  //   return this.angularFireDatabase
  //     .list<TimedValue<number>>(`sensorData/${key}`)
  //     .push({
  //       value,
  //       timestamp: <number>database.ServerValue.TIMESTAMP,
  //     });
  // }

  // setActorValue(key: string, value: any) {
  //   return this.angularFireDatabase
  //     .list<TimedValue<any>>(`actorData/${key}`)
  //     .push({
  //       value,
  //       timestamp: <number>database.ServerValue.TIMESTAMP,
  //     });
  // }
  // getActorValue(key: string): Observable<TimedValue<any>> {
  //   return this.getLast<TimedValue<any>>(`actorData/${key}`).pipe(
  //     map(list => list[0]),
  //     filter(value => value !== null && value !== undefined),
  //     map(timedValue => ({ ...timedValue, value: !!timedValue.value })),
  //   );
  // }

  // loadSensorData(sensor: Device, liveChartService: LiveChartService, colors, echarts): Device {
  //   if (!sensor.value$) {
  //     sensor.value$ = this.getSensorValue(sensor.key);
  //   }
  //   if (!sensor.chart$) {
  //     sensor.chart$ = liveChartService.getSensorsChart({
  //       colors: colors,
  //       echarts: echarts,
  //       device: sensor,
  //     });
  //   }
  //   return sensor;
  // }
  // loadSiteSensorData(site: Site, liveChartService: LiveChartService, colors, echarts): Site {
  //   if (!site) {
  //     return site;
  //   }
  //   site.sensorsArray = (site.sensorsArray || []).map(
  //     sensor => this.loadSensorData(sensor, liveChartService, colors, echarts),
  //   );
  //   site.actorsArray = (site.actorsArray || []).map(actor => {
  //     if (!actor.value$) {
  //       actor.value$ = this.getActorValue(actor.key);
  //     }
  //     if (!actor.emiter) {
  //       actor.emiter = (next) => this.setActorValue(actor.key, next);
  //     }
  //     return actor;
  //   });
  //   return site;
  // }
  // loadSitesArraySensorData(sites: Site[], liveChartService: LiveChartService, colors, echarts): Site[] {
  //   return sites.map(site => this.loadSiteSensorData(site, liveChartService, colors, echarts));
  // }


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
