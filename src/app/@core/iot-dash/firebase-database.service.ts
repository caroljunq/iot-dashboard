import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { tap, map, filter, debounceTime } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { setSampleData } from './setup-dash';
import { Site, Device, TimedValue } from './iot-dash-models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(
    private angularFireDatabase: AngularFireDatabase,
  ) {
    if (!environment.production) {
      // this.setup();
    }
  }

  getSites() {
    return this.angularFireDatabase.object<{[key: string]: Site}>('/sites')
    .valueChanges().pipe(
      // tap(v => console.log(v)),
      map(
        (value) => Object.entries(value).map(
          siteEntry => <Site>{
            ...siteEntry[1],
            key: siteEntry[0],
            sensorsArray: Object.entries(siteEntry[1].sensors || {}).map(
              sensorEntry => <Device>{
                key: sensorEntry[0],
                ...sensorEntry[1],
              },
            ),
            actorsArray: Object.entries(siteEntry[1].actors || {}).map(
              sensorEntry => <Device>{
                key: sensorEntry[0],
                ...sensorEntry[1],
              },
            ),
          },
        ),
      ),
    );
  }

  getLatest<T>(path: string): Observable<TimedValue<T>> {
    return this.angularFireDatabase.list<TimedValue<T>>(
      path,
      ref => ref.orderByChild('timestamp').limitToLast(1),
    ).valueChanges().pipe(
      debounceTime(500),
      map(list => list[0]),
      filter(value => value !== null && value !== undefined),
      // tap(value => console.log({path, ...value})),
    );
  }

  getSensorValue(key: string) {
    return this.getLatest(`sensorData/${key}`);
  }

  setActorValue(key: string, value: boolean) {
    return this.angularFireDatabase.list<TimedValue<boolean>>(`actorData/${key}`).push({
      value,
      timestamp: database.ServerValue.TIMESTAMP,
    });
  }
  getActorValue(key: string): Observable<TimedValue<boolean>> {
    return this.getLatest(`actorData/${key}`).pipe(
      map(timedValue => ({...timedValue, value: !!timedValue.value})),
    );
  }

  private setup() {
    const sampleData = setSampleData();
    this.angularFireDatabase.object('/').update(sampleData);
    // update
    Object.values(sampleData.sites).forEach(
      (site) => setInterval(
        () =>
          this.angularFireDatabase.list(
            `sensorData/${Object.keys(site)[0]}`,
          ).push({
            value: Math.random() * 60 - 10,
            timestamp: database.ServerValue.TIMESTAMP,
          }),
        1000 * Math.floor(Math.random() * 10.0 + 1),
      ),
    );
  }
}
