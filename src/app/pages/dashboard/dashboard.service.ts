import { database } from 'firebase/app';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
  map,
  switchMap,
  publishReplay,
  refCount,
  filter,
  startWith,
  tap,
  take,
  shareReplay,
  catchError,
} from 'rxjs/operators';
import { Observable, combineLatest, of, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions, NbJSThemeVariable } from '@nebular/theme/services/js-themes/theme.options';

import { DeviceTimeSeries, EChartOption, seriesColors } from 'app/@core/iot-dash/live-chart.service';
import { DashUser } from './../users/user-models';
import { Site, Device, TimedValue } from 'app/@core/iot-dash/iot-dash-models';
import { UsersService } from '../users/users.service';
import { LiveChartService, baseSensorChartOpts } from 'app/@core/iot-dash/live-chart.service';
import { oneSixSixBits } from 'app/@core/iot-dash/setup-dash';

export interface LoadedDevice<T> extends Device {
  value$: Observable<TimedValue<T>>;
  emiter: (value: T) => void;
  chart$: Observable<EChartOption>;
}
export interface LoadedSite extends Site {
  devicesArray: LoadedDevice<Number|boolean>[];
  actorsArray: LoadedDevice<Number|boolean>[];
  sensorsArray: LoadedDevice<Number|boolean>[];
}

function mapTimedValueToDeviceTimeSereies(device: Device, index: number) {
  return map<TimedValue<number>[], DeviceTimeSeries>(timeSeries => ({
    device,
    timeSeries,
    color: seriesColors[index],
  }));
}
const FAKE_SITE = {
  site: /* Site = */{
    key: 'fake',
    name: 'Sala Teste',
    devices: {
      'deviceKey1': 'deviceKey1',
      'deviceKey2': 'deviceKey2',
      'deviceKey3': 'deviceKey3',
    },
  },
  devices: /* {[key: string]: Device} = */{
    'deviceKey1': {
      key: 'deviceKey1',
      name: 'Device 1',
      isActor: false,
      isActive: true,
      type: 'Temperatura',
      unit: 'ºC',
      min: 15,
      max: 25,
    },
    'deviceKey2': {
      key: 'deviceKey2',
      name: 'Device 2',
      isActor: false,
      isActive: true,
      type: 'Umidade',
      unit: '%',
      min: 20,
      max: 80,
    },
    'deviceKey3': {
      key: 'deviceKey3',
      name: 'Device 3',
      isActor: true,
      isActive: true,
      type: 'boolean',
      unit: '',
      min: 0,
      max: 1,
    },
  },
  deviceData: /* {[key: string]: {[key: string]: TimedValue<number|boolean>}} = */{
    'deviceKey1': (new Array(15)).fill(0).reduce((acc, v, i) => {
      acc[(i + 1).toString()] = {
        value: ((Math.random() * 2 + i) % (25 - 15)) + 15,
        timestamp: 1553904801661 + (i * 100),
      };
      return acc;
      },
      {},
    ),
    'deviceKey2': (new Array(15)).fill(0).reduce((acc, v, i) => {
      acc[(i + 1).toString()] = {
        value: ((Math.random() * 2 + i) % (80 - 20)) + 20,
        timestamp: 1553904801661 + (i * 100),
      };
      return acc;
      },
      {},
    ),
    'deviceKey3': {
      '1': { value: true, timestamp: 1553904801661},
      '2': { value: false, timestamp: 1553904802661},
      '3': { value: true, timestamp: 1553904803661},
      '4': { value: false, timestamp: 1553904804661},
      '5': { value: true, timestamp: 1553904805661},
    },
  },
};

function cachedFn<V>() {
  const cache = new Map<string, V>();
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = function(...args): V {
        const key: string = args.join(', ');
        // console.log('Arguments: ', {key, args});
        try {
          if (!cache.has(key)) {
            // console.log('Cache Miss');
            cache.set(key, original.apply(this, args));
          }
          const result = cache.get(key);
          // console.log('Result: ', {propertyKey, key, args, result });
          return result;
        } catch (e) {
          // console.log('Error: ', e);
          throw e;
        }
      };
    }
    return descriptor;
  };
}


@Injectable({
  providedIn: 'root',
})
export class DashboardService implements CanActivate {

  firebaseDataSource = {
    siteFn: (siteKey: string) => this.angularFireDatabase.object<Site>(`sites/${siteKey}/`).valueChanges(),
    deviceFn: (deviceKey: string) => this.angularFireDatabase.object<Device>(`devices/${deviceKey}`).valueChanges(),
    deviceDataFn: (deviceKey: string, limit = 1) => this.angularFireDatabase.list<TimedValue<number|boolean>>(
      `deviceData/${deviceKey}`,
      ref => ref.orderByChild('timestamp').limitToLast(limit),
    ).valueChanges(),
    deviceDataNextFn: (deviceKey: string, value: number | boolean) => {
      const nextValue = {timestamp: <number>database.ServerValue.TIMESTAMP, value};
      this.angularFireDatabase.list<TimedValue<number|boolean>>(
        `deviceData/${deviceKey}`,
      ).push(nextValue);
    },
  };
  fakeDataSource = valueSources => ({
    siteFn: (siteKey: string) => of(FAKE_SITE.site),
    deviceFn: (deviceKey: string) => of(Object.values(FAKE_SITE.devices).find(device => device.key === deviceKey)),
    deviceDataFn: (deviceKey: string, limit: number) => valueSources.find(
      device => device.key === deviceKey,
    ).valueSource.asObservable().pipe(
      // tap(v => console.log('[valueSource]', v)),
      map(i => Object.values<TimedValue<number|boolean>>(
          FAKE_SITE.deviceData[deviceKey],
        ).sort(
          (a, b) => a.timestamp - b.timestamp,
        ).slice(0, limit),
      ),
      // tap(v => console.log('[valueSource]', v)),
      shareReplay(),
    ),
    deviceDataNextFn: (deviceKey: string, value: number | boolean) => {
      const nextValue = {timestamp: Date.now(), value};
      FAKE_SITE.deviceData[deviceKey][oneSixSixBits()] = nextValue;
      valueSources.find(
        device => device.key === deviceKey,
      ).valueSource.next(nextValue);
    },
  })

  constructor(
    protected router: Router,
    protected usersService: UsersService,
    protected angularFireDatabase: AngularFireDatabase,
    protected themeService: NbThemeService,
    protected liveChartService: LiveChartService,
  ) { }

  @cachedFn()
  getLoadedSite(key: string): Observable<LoadedSite> {
    return this.themeService.getJsTheme().pipe(
      // tap(v => console.log('[themeService]', v)),
      switchMap<NbJSThemeOptions, LoadedSite>(theme => {
        const colors = theme.variables;
        const echarts = theme.variables.echarts;
        let dataSource = this.firebaseDataSource;
        if (!key || key === 'fake') {
          const valueSources = Object.values(FAKE_SITE.devices).map(device => ({
            ...device,
            valueSource: new BehaviorSubject<TimedValue<number|boolean>>(
              (Object.values<TimedValue<number | boolean>>(FAKE_SITE.deviceData[device.key])[0]),
            ),
          }));
          dataSource = this.fakeDataSource(valueSources);
          for (const device of valueSources) {
            if (!device.isActor) {
              setInterval(
                () => dataSource.deviceDataNextFn(
                  device.key,
                  Math.random() * (device.max - device.min) + device.min,
                ),
                1000,
              );
            }
          }
        }
        return this.innerGetSite(
          key,
          dataSource.siteFn,
          dataSource.deviceFn,
          dataSource.deviceDataFn,
          dataSource.deviceDataNextFn,
          colors,
          echarts,
        );
      }),
      publishReplay(1),
      refCount(),
      // tap(v => console.log('[main]', v)),
    );
  }

  protected innerGetSite(
    siteKey: string,
    siteFn: (siteKey: string) => Observable<Site>,
    deviceFn: (deviceKey: string) => Observable<Device>,
    deviceDataFn: (deviceKey: string, limit: number) => Observable<TimedValue<number | boolean>[]>,
    deviceDataNextFn: (deviceKey: string, value: number | boolean) => void,
    colors: NbJSThemeVariable,
    echarts: string | NbJSThemeVariable | string[],
  ) {
    return siteFn(siteKey).pipe(
      tap(v => console.log('[siteFn]', v)),
      filter(v => !!v),
      switchMap(
        (site: Site) => combineLatest(
          Object.keys(site.devices).map(deviceKey => deviceFn(deviceKey)),
        ).pipe(
          tap(v => console.log('[deviceFn]', v)),
          map(devices => {
            const loadedDevices: LoadedDevice<number|boolean>[] = devices.map((device, index) => {
              const value$ = deviceDataFn(device.key, 1).pipe(
                // tap(v => console.log('[deviceDataFn, 1]', v)),
                filter(value => value !== null && value !== undefined),
                map(list => list[0]),
              );
              const chart$ = this.getSensorChart(
                colors,
                echarts,
                device.key,
                deviceDataFn(device.key, 15).pipe(
                  // tap(v => console.log('[deviceDataFn, 15]', v)),
                  mapTimedValueToDeviceTimeSereies(device, index),
                ),
              );
              const emiter = (value) => deviceDataNextFn(device.key, value);
              return {
                ...device,
                value$,
                emiter,
                chart$,
              };
            });
            const loadedSite: LoadedSite = {
              ...site,
              devicesArray: loadedDevices,
              sensorsArray: loadedDevices.filter((device: Device) => !device.isActor),
              actorsArray: loadedDevices.filter((device: Device) => device.isActor),
            };
            return loadedSite;
         }),
        ),
      ),
      // tap(v => console.log('[switchMap]', v)),
    );
  }

  @cachedFn()
  getAuthSite(key: string): Observable<Site> {
    if (!key || key === 'fake') {
      return of(FAKE_SITE.site);
    }
    return this.usersService.user$.pipe(
      take(1),
      switchMap(user => {
        // if no AuthN || AuthZ
        if (!user || !user.storedUser.isActive) {
          return of(FAKE_SITE.site);
        }
        // try read
        return this.angularFireDatabase.object<Site>(
          `sites/${key}/`,
        ).valueChanges().pipe(
          catchError(error => {
            // if AuthZ error on read
            console.error(error);
            // take first user's site
            return this.angularFireDatabase.list<string>(
              `userSites/${user.authUser.uid}`,
              ref => ref.limitToFirst(1),
            ).valueChanges().pipe(
              take(1),
              switchMap(sitesKeys => {
                if (!sitesKeys || sitesKeys.length === 0 || sitesKeys[0].length === 0) {
                  // user has zero AuthZ sites
                  return of(FAKE_SITE.site);
                }
                return this.angularFireDatabase.object<Site>(
                  `sites/${sitesKeys[0]}/`,
                ).valueChanges();
              }),
            );
          }),
        );
      }),
    );
  }

  @cachedFn()
  getSensorChart(colors, echarts, device, data$: Observable<DeviceTimeSeries>) {
    return data$.pipe(
      map(deviceTimeSeries => {
        const base = baseSensorChartOpts(colors, echarts);
        base.legend.data = [device.name];
        base.xAxis[0].data = deviceTimeSeries.timeSeries.map(
          timedValue => (new Date(<number>timedValue.timestamp)).toLocaleTimeString(),
        );
        base.series = [{
          name: device.name,
          type: 'line',
          data: deviceTimeSeries.timeSeries.map(
            timedValue => timedValue.value,
          ),
        }];
        return base;
      }),
      startWith(baseSensorChartOpts(colors, echarts)),
    );
  }

  getDeviceValue(key: string) {
    //
  }
  setDeviceValue(key: string, value: boolean | number) {
    //
  }
  getDeviceValueChart(key: string) {
    //
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const key = next.params.id;
    console.log('[canActivate]', {key, comp: next.component});
    return this.getAuthSite(key).pipe(
      take(1),
      map(site => {
        if (!site) {
          throw new Error('No Site Resolved');
        }
        if (site.key === key) {
          return true;
        }
        return this.router.parseUrl(`/dashboard/${key.key}`);
      }),
      catchError(error => {
        console.error(error);
        return of(this.router.parseUrl(`/`));
      }),
    );
  }
}

export const DashboardIdGuard = DashboardService;
