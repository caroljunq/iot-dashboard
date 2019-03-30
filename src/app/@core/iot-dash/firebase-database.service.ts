import { Injectable } from '@angular/core';
import { database } from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of, combineLatest } from 'rxjs';
import { map, filter, publishReplay, refCount, take, catchError, tap, switchMap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, TimedValue, TimedAggregate } from './iot-dash-models';
import { LiveChartService } from './live-chart.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { DashUser } from './../../pages/users/user-models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(protected angularFireDatabase: AngularFireDatabase) {
    // if (!environment.production) {
    //   // this.angularFireDatabase.object('/').update(getSampleData());
    // }
  }

  sites$: Observable<Site[]>;
  getSites(): Observable<Site[]> {
    if (this.sites$) {
      return this.sites$;
    }
    console.trace('getSites');
    this.sites$ = this.angularFireDatabase.list<Site>('sites').valueChanges().pipe(
      // tap(v => console.log(v)),
      publishReplay(),
      refCount(),
      filter(v => !!v),
    );
    return this.sites$;
  }
  getSite(key: string): Observable<Site> {
    return this.angularFireDatabase.object<Site>(`sites/${key}`).valueChanges();
  }
  getSensorSites(key: string): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`sites/${key}/sensors`).valueChanges();
  }

  getLast<T>(path: string, limit = 1): Observable<T[]> {
    return this.angularFireDatabase.list<T>(
      path,
      ref => ref.orderByChild('timestamp').limitToLast(limit),
    ).valueChanges();
  }

  getLastSensorValues(key: string, limit = 1) {
    return this.getLast<TimedValue<number>>(`sensorData/${key}`, limit);
  }
  getSensorValue(key: string) {
    return this.getLastSensorValues(key).pipe(
      map(list => list[0]),
      filter(value => value !== null && value !== undefined),
    );
  }

  setSensorValue(key: string, value: number) {
    return this.angularFireDatabase
      .list<TimedValue<number>>(`sensorData/${key}`)
      .push({
        value,
        timestamp: <number>database.ServerValue.TIMESTAMP,
      });
  }

  setActorValue(key: string, value: any) {
    return this.angularFireDatabase
      .list<TimedValue<any>>(`actorData/${key}`)
      .push({
        value,
        timestamp: <number>database.ServerValue.TIMESTAMP,
      });
  }
  getActorValue(key: string): Observable<TimedValue<any>> {
    return this.getLast<TimedValue<any>>(`actorData/${key}`).pipe(
      map(list => list[0]),
      filter(value => value !== null && value !== undefined),
      map(timedValue => ({ ...timedValue, value: !!timedValue.value })),
    );
  }

  createSensor(sensor: Device){
    console.log(sensor);
    return true;
  }

  getSensorByKey(id): Observable<Device> {
    return of(<Device>{
      key: 'fakeKey',
      name: 'sensor1',
      type: 'temperatura',
      unit: 'ºC',
      min: 15,
      max: 12,
    });
  }

  getUserSites(dashUser: DashUser): any {
    return this.angularFireDatabase.list<string>(`userSites/${dashUser.authUser.uid}`).valueChanges().pipe(
      // tap(userSites => console.log('[FirebaseDatabaseService.getUserSites]', {userSites})),
      switchMap(userSites => combineLatest(userSites.map(
        userSite => this.getSite(userSite),
      ))),
    );
  }
}
