import { Injectable } from '@angular/core';
import { database } from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of, Subject } from 'rxjs';
import { map, filter, publishReplay, refCount, take, tap, timeout } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, TimedValue, TimedAggregate } from './iot-dash-models';
import { sensor24hourAggregate } from './sensor24hourAggregate';
import { LiveChartService } from './live-chart.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  connectionSpeed = {
    size: 0,
    speed: 0,
    time: 0,
    related: 0,
    isSlow: false,
  };

  constructor(
    private angularFireDatabase: AngularFireDatabase,
    private angularFireFunctions: AngularFireFunctions,
  ) {
    if (!environment.production) {
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
    const init = Date.now();
    fetch('assets/images/speed-test.png').then(
      response => (!response.ok ? null : response.blob()),
    ).then(
      b => {
        const end = Date.now();
        const size = b.size;
        const time = end - init;
        const speed = b.size / time;
        const related = time / 16000;
        // below 60fps
        const isSlow = related > 1;
        this.connectionSpeed = { size, time, speed, related, isSlow };
      },
    );
  }

  sites$: Observable<Site[]>;
  getSites(): Observable<Site[]> {
    if (this.sites$) {
      return this.sites$;
    }
    this.sites$ = this.angularFireDatabase.object<{ [key: string]: Site }>('sites').valueChanges().pipe(
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
      // tap(v => console.log(v)),
      publishReplay(),
      refCount(),
      filter(v => !!v),
    );
    return this.sites$;
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
  getSensor24hAggregateFF(key: string): Observable<TimedAggregate> {
    if (this.sensor24hAggregate.hasOwnProperty(key)) {
      return this.sensor24hAggregate[key];
    }

    this.sensor24hAggregate[key] = this.angularFireFunctions.httpsCallable('sensorAggregate')({key}).pipe(
      publishReplay(),
      refCount(),
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

  loadSensorData(sensor: Device, liveChartService: LiveChartService, colors, echarts): Device {
    if (!sensor.value$) {
      sensor.value$ = this.getSensorValue(sensor.key);
    }
    if (!sensor.aggregate$) {
      sensor.aggregate$ = this.getSensor24hAggregateFF(sensor.key);
    }
    if (!sensor.chart$) {
      sensor.chart$ = liveChartService.getSensorsChart({
        colors: colors,
        echarts: echarts,
        device: sensor,
      });
    }
    return sensor;
  }
  loadSiteSensorData(site: Site, liveChartService: LiveChartService, colors, echarts): Site {
    site.sensorsArray = site.sensorsArray.map(sensor => this.loadSensorData(sensor, liveChartService, colors, echarts));
    site.actorsArray.forEach(actor => {
      if (!actor.value$) {
        actor.value$ = this.getActorValue(actor.key);
      }
      if (!actor.emiter) {
        actor.emiter = (next) => this.setActorValue(actor.key, next);
      }
    });
    return site;
  }
  loadSitesArraySensorData(sites: Site[], liveChartService: LiveChartService, colors, echarts): Site[] {
    sites.forEach(site => this.loadSiteSensorData(site, liveChartService, colors, echarts));
    return sites;
  }
}
