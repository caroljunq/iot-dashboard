import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, filter, publishReplay, refCount, take } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, TimedValue, TimedAggregate } from './iot-dash-models';
import { sensor24hourAggregate } from './sensor24hourAggregate';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(private angularFireDatabase: AngularFireDatabase) {
    if (!environment.production) {
      // debugger;
      // this.angularFireDatabase.object('/').update(getSampleData());
      const randomValue = (sensor: Device) => setInterval(
        () => this.setSensorValue(sensor.key, Math.random() * 60 - 10).then(() => null),
        100 * Math.floor(Math.random() * 10 + 10),
      );
      const sub = this.angularFireDatabase.list<Site>('/sites').valueChanges().pipe(take(1)).subscribe(sampleData => {
        sub.unsubscribe();
        // update
        sampleData.forEach(
          site => Object.values(site.sensors).forEach(
            sensor => randomValue(sensor),
          ),
        );
      });
    }
  }

  getSites() {
    return this.angularFireDatabase
      .object<{ [key: string]: Site }>('sites')
      .valueChanges()
      .pipe(
        // tap(v => console.log(v)),
        map(value =>
          Object.entries(value).map(
            siteEntry =>
              <Site>{
                ...siteEntry[1],
                key: siteEntry[0],
                sensorsArray: Object.entries(siteEntry[1].sensors || {}).map(
                  sensorEntry =>
                    <Device>{
                      key: sensorEntry[0],
                      ...sensorEntry[1],
                    },
                ),
                actorsArray: Object.entries(siteEntry[1].actors || {}).map(
                  sensorEntry =>
                    <Device>{
                      key: sensorEntry[0],
                      ...sensorEntry[1],
                    },
                ),
              },
          ),
        ),
      );
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

  sensor24hAggregate = {};
  sensor24hAggregateCache = {};
  getSensor24hAggregate(key: string): Observable<TimedAggregate> {
    if (this.sensor24hAggregate.hasOwnProperty(key)) {
      return this.sensor24hAggregate[key];
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.sensor24hAggregate[key] = this.angularFireDatabase.list<TimedValue<number>>(
      `sensorData/${key}`,
      ref => ref.orderByChild('timestamp').startAt(yesterday.valueOf()).endAt(Date.now()),
    ).valueChanges().pipe(
      take(1),
      map((values) => sensor24hourAggregate(key, values)),
      publishReplay(),
      refCount(),
      filter(v => !!v),
    );

    return this.sensor24hAggregate[key];
  }
  setSensorValue(key: string, value: number) {
    return this.angularFireDatabase
      .list<TimedValue<number>>(`sensorData/${key}`)
      .push({
        value,
        timestamp: <number>database.ServerValue.TIMESTAMP,
      });
  }

  setActorValue(key: string, value: boolean) {
    return this.angularFireDatabase
      .list<TimedValue<boolean>>(`actorData/${key}`)
      .push({
        value,
        timestamp: <number>database.ServerValue.TIMESTAMP,
      });
  }
  getActorValue(key: string): Observable<TimedValue<boolean>> {
    return this.getLast<TimedValue<boolean>>(`actorData/${key}`).pipe(
      map(list => list[0]),
      filter(value => value !== null && value !== undefined),
      map(timedValue => ({ ...timedValue, value: !!timedValue.value })),
    );
  }
}
