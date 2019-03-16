import { Injectable } from '@angular/core';
import { database } from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, filter, publishReplay, refCount, take } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { getSampleData } from './setup-dash';
import { Site, Device, TimedValue } from './iot-dash-models';
import { LiveChartService } from './live-chart.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(protected angularFireDatabase: AngularFireDatabase) {
    if (!environment.production) {
      // this.angularFireDatabase.object('/').update(getSampleData());
      const sub = this.angularFireDatabase.list<Site>('/sites').valueChanges().pipe(take(1)).subscribe(sampleData => {
        sub.unsubscribe();
        // update
        sampleData.forEach(
          site => Object.values(site.sensors).forEach(
            (sensor: Device) => {
              setInterval(
                () => this.setSensorValue(
                  sensor.key,
                  Math.random() * (sensor.max - sensor.min) + sensor.min,
                ).then(() => null),
                100 * Math.floor(Math.random() * 10 + 10),
              );
            },
          ),
        );
      });
    }
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
    if (!site) {
      return site;
    }
    site.sensorsArray = (site.sensorsArray || []).map(
      sensor => this.loadSensorData(sensor, liveChartService, colors, echarts),
    );
    site.actorsArray = (site.actorsArray || []).map(actor => {
      if (!actor.value$) {
        actor.value$ = this.getActorValue(actor.key);
      }
      if (!actor.emiter) {
        actor.emiter = (next) => this.setActorValue(actor.key, next);
      }
      return actor;
    });
    return site;
  }
  loadSitesArraySensorData(sites: Site[], liveChartService: LiveChartService, colors, echarts): Site[] {
    return sites.map(site => this.loadSiteSensorData(site, liveChartService, colors, echarts));
  }
}
