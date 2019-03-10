import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { Site, SensorValue, Sensor, SiteFb, ActorValue } from './iot-dash-models';
import { environment } from 'environments/environment';
import { setSampleData } from './setup-dash';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(
    private angularFireDatabase: AngularFireDatabase,
  ) {
    if (!environment.production) {
      this.setup();
    }
  }

  getSites() {
    return this.angularFireDatabase.object<{[key: string]: SiteFb}>('/sites').valueChanges().pipe(
      // tap(v => console.log(v)),
      map(
        (value) => Object.entries(value).map(
          siteEntry => new Site(
            siteEntry[0],
            siteEntry[1].name,
            Object.entries(siteEntry[1].sensors).map(
              sensoEntry => new Sensor(sensoEntry[0], sensoEntry[1].location),
            ),
          ),
        ),
      ),
    );
  }

  getLatest(path: string) {
    return this.angularFireDatabase.list<ActorValue>(
      path,
      ref => ref.orderByChild('timestamp').limitToLast(1),
    ).valueChanges().pipe(
      map(list => list[0]),
      filter(value => value != null),
      // tap((value) => console.log({key, ...value})),
    );
  }

  getSensorValue(key: string) {
    return this.getLatest(`sensorData/${key}`);
  }

  setActorValue(key: string, value: number|boolean) {
    return this.angularFireDatabase.list<ActorValue>(`actorData/${key}`).push({
      value,
      timestamp: database.ServerValue.TIMESTAMP,
    });
  }
  getActorValue(key: string): Observable<ActorValue> {
    return this.getLatest(`actorData/${key}`);
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
