import { AngularFireDatabase } from '@angular/fire/database';
import { CONNECTION_SPEED_DEF, getConnectionSpeed } from './connection-speed';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Observable, of, Subject } from 'rxjs';
import { map, filter, publishReplay, refCount, take, tap, timeout } from 'rxjs/operators';

import { Site, Device, TimedValue, TimedAggregate } from './iot-dash-models';
import { sensor24hourAggregate } from './sensor24hourAggregate';

export class AggregateService extends FirebaseDatabaseService {
  connectionSpeed = CONNECTION_SPEED_DEF;

  constructor(
    angularFireDatabase: AngularFireDatabase,
  ) {
    super(angularFireDatabase);
    getConnectionSpeed().then(connectionSpeed => {
      this.connectionSpeed = connectionSpeed;
    });
  }

  sensor24hAggregate = {};
  sensor24hAggregateCache = {};
  getSensor24hAggregate(key: string): Observable<TimedAggregate> {
    if (this.sensor24hAggregate.hasOwnProperty(key)) {
      return this.sensor24hAggregate[key];
    }
    if (this.connectionSpeed.isSlow) {
      this.sensor24hAggregate[key] = of<TimedAggregate>({
        key,
        max: 50,
        min: -10,
        avg: 25,
        endTimeStamp: 0,
        startTimeStamp: 0,
        stdDev: 25,
      }).pipe(
        publishReplay(),
        refCount(),
      );
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
}