import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { Site, SensorValue, Sensor, SiteFb } from './iot-dash-models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  sitesKeys: String[] = ['site-key'];
  sitesObservables: Observable<Site[]>;

  constructor(
    private angularFireDatabase: AngularFireDatabase,
  ) {
    if (!environment.production) {
      this.setSampleData();
    }
  }

  getSites() {
    function mapToSite(key: string, obj: SiteFb): Site {
      return new Site(
        key,
        obj.name,
        Object.entries(obj.sensors).map(siteEntry => new Sensor(siteEntry[0], siteEntry[1].location)),
      );
    }
    return this.angularFireDatabase.object<{[key: string]: SiteFb}>('/sites').valueChanges().pipe(
      // tap(v => console.log(v)),
      map(
        (value) => Object.entries(value).map(siteEntry => mapToSite(...siteEntry)),
      ),
    );
  }

  getSensorValue(key) {
    // const ref = this.angularFireDatabase.database.ref(`sensors/${key}`);
    // ref.on('value', (snapshot) => console.log({value: snapshot.val(), key}));
    return this.angularFireDatabase.list<SensorValue>(
      `sensorData/${key}`,
      ref => ref.orderByChild('timestamp').limitToLast(1),
    ).valueChanges().pipe(
      map(list => list[0]),
      filter(value => value != null),
      tap((value) => console.log({key, ...value})),
    );
  }

  setSampleData() {
    const oneSixSixBits = (): string => (Date.now().toString(36) + Math.random().toString(36)).replace('0.', '');
    function someName(): string {
      const words = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'];
      return words[Math.floor(Math.random() * words.length)] + ' ' +
        words[Math.floor(Math.random() * words.length)];
    }

    const sampleData = {
      sites: {},
      sensorData: {},
      users: {},
    };
    for (let siteIndex = 0; siteIndex < 3; siteIndex++) {
      const siteSensors = {};
      for (let sensorIndex = 0; sensorIndex < 4; sensorIndex++) {
        const sensorKey = oneSixSixBits();
        siteSensors[sensorKey] = {
          sensorKey,
          location: `Sensor #${sensorIndex} ${someName()}`,
        };
        // fake reports
        sampleData.sensorData[sensorKey] = {};
        for (
          let i = 0;
          i < Math.floor(Math.random() * 10.0 + 1);
          i++
        ) {
          sampleData.sensorData[sensorKey][oneSixSixBits()] = {
            value: Math.random() * 60 - 10,
            timestamp: Date.now(),
          };
        }
      }
      // update
      setInterval(
        () =>
          this.angularFireDatabase.list(
            `sensorData/${Object.keys(siteSensors)[0]}`,
          ).push({
            value: Math.random() * 60 - 10,
            timestamp: database.ServerValue.TIMESTAMP,
          }),
        1000 * Math.floor(Math.random() * 10.0 + 1),
      );
      sampleData.sites[oneSixSixBits()] = {
        name: `Site #${siteIndex} ${someName()}`,
        sensors: siteSensors,
      };
    }
    this.angularFireDatabase.object('/').update(sampleData);
  }
}
