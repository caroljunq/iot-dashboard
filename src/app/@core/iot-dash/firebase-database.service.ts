import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { setSampleData } from './setup-dash';
import { Site, Device, TimedValue } from './iot-dash-models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(private angularFireDatabase: AngularFireDatabase) {
    if (!environment.production) {
      this.setup().then(() => null);
    }
  }
  private async setup() {
    const sampleData = setSampleData();
    // const sampleData = await this.angularFireDatabase.object('/').valueChanges().toPromise();
    this.angularFireDatabase.object('/').update(sampleData);
    // update
    Object.values(sampleData.sites).forEach(site =>
      setInterval(
        () =>
          this.angularFireDatabase
            .list(`sensorData/${Object.keys(site)[0]}`)
            .push({
              value: Math.random() * 60 - 10,
              timestamp: database.ServerValue.TIMESTAMP,
            }),
        1000 * Math.floor(Math.random() * 10.0 + 1),
      ),
    );
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
    ).valueChanges().pipe(
      debounceTime(500),
      // tap(value => console.log({path, ...value})),
    );
  }

  getLastSensorValues(key: string, limit = 1) {
    return this.getLast<TimedValue<number>>(`sensorData/${key}`, limit);
  }
  getSensorValue(key: string) {
    if (!environment.production) {
      setInterval(
        () => this.setSensorValue(key, Math.random() * 50 - 10),
        1000,
      );
    }
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
        timestamp: database.ServerValue.TIMESTAMP,
      });
  }

  setActorValue(key: string, value: boolean) {
    return this.angularFireDatabase
      .list<TimedValue<boolean>>(`actorData/${key}`)
      .push({
        value,
        timestamp: database.ServerValue.TIMESTAMP,
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
