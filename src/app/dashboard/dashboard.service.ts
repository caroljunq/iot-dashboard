import { StoredUser, UserSites, ROOT_DATA } from './../@core/iot-dash/iot-dash-models';
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
import { AngularFireDatabase } from '@angular/fire/database';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions, NbJSThemeVariable } from '@nebular/theme/services/js-themes/theme.options';

import { DeviceTimeSeries, EChartOption, seriesColors } from 'app/@core/iot-dash/live-chart.service';
import { Site, Device, TimedValue } from 'app/@core/iot-dash/iot-dash-models';
import { UsersService } from 'app/pages/users/users.service';
import { LiveChartService, baseSensorChartOpts } from 'app/@core/iot-dash/live-chart.service';
import { oneSixSixBits } from 'app/@core/iot-dash/setup-dash';
import { ToastService, NbToastStatus } from 'app/@theme/toast.service';

export interface LoadedDevice<T> extends Device {
  value$: Observable<TimedValue<T>>;
  chart$: Observable<EChartOption>;
  emiter: (value: T) => void;
}
export interface LoadedSite extends Site {
  devicesArray: LoadedDevice<Number|boolean>[];
  actorsArray: LoadedDevice<Number|boolean>[];
  sensorsArray: LoadedDevice<Number|boolean>[];
}
export interface EditableSite extends Site {
  devicesArray: Device[];
  usersArray: StoredUser[];
}

export interface SitesUsers {
  [siteKey: string]: {
    siteKey: string,
    userKeyList: string[],
    userList: StoredUser[],
  };
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
      min: null,
      max: null,
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

// Pure Function Cached Decorator
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
          } else {
            // console.log('Cache Hit');
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

@Injectable()
export class DashboardService {
  firebaseDataSource = {
    deviceFn: (deviceKey: string) => this.angularFireDatabase.object<Device>(
      `${ROOT_DATA.devices}/${deviceKey}`,
    ).valueChanges(),
    deviceDataFn: (deviceKey: string, limit = 1) => this.angularFireDatabase.list<TimedValue<number|boolean>>(
      `${ROOT_DATA.deviceData}/${deviceKey}`,
      ref => ref.orderByChild('timestamp').limitToLast(limit),
    ).valueChanges(),
    deviceDataNextFn: (deviceKey: string, value: number | boolean) => {
      const nextValue = {timestamp: <number>database.ServerValue.TIMESTAMP, value};
      this.angularFireDatabase.list<TimedValue<number|boolean>>(
        `${ROOT_DATA.deviceData}/${deviceKey}`,
      ).push(nextValue);
    },
  };
  fakeDataSource = valueSources => ({
    deviceFn: (deviceKey: string) => of(Object.values(FAKE_SITE.devices).find(device => device.key === deviceKey)),
    deviceDataFn: (deviceKey: string, limit: number) => valueSources.find(
      device => device.key === deviceKey,
    ).valueSource.asObservable().pipe(
      // tap(v => console.log('[valueSource]', v)),
      map(i => {
        const deviceDataArray = Object.values<TimedValue<number|boolean>>(
          FAKE_SITE.deviceData[deviceKey],
        );
        return deviceDataArray.sort(
          (a, b) => a.timestamp - b.timestamp,
        ).slice(deviceDataArray.length - limit, deviceDataArray.length);
      }),
      // tap(v => console.count('deviceKey')),
      // shareReplay(),
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
    protected usersService: UsersService,
    protected angularFireDatabase: AngularFireDatabase,
    protected themeService: NbThemeService,
    protected liveChartService: LiveChartService,
    protected toastService: ToastService,
    protected router: Router,
  ) { }

  getDataSource(key: string) {
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
    return dataSource;
  }

  @cachedFn()
  getLoadedSite(key: string): Observable<LoadedSite> {
    return this.themeService.getJsTheme().pipe(
      // tap(v => console.log('[themeService]', v)),
      switchMap<NbJSThemeOptions, LoadedSite>(theme => {
        const colors: NbJSThemeVariable = theme.variables;
        const echarts: string | NbJSThemeVariable | string[] = theme.variables.echarts;
        const dataSource = this.getDataSource(key);
        //
        return this.getAuthSite(key).pipe(
          filter(site => !!site),
          switchMap(
            (site: Site) => combineLatest(
              Object.keys(site.devices).map(deviceKey => dataSource.deviceFn(deviceKey)),
            ).pipe(
              map(devices => {
                const loadedDevices: LoadedDevice<number|boolean>[] = devices.map((device, index) => {
                  const value$: Observable<TimedValue<number|boolean>> = dataSource.deviceDataFn(device.key, 1).pipe(
                    filter(value => value !== null && value !== undefined),
                    map(list => list[0]),
                    startWith({timestamp: Date.now(), value: device.min}),
                    // tap(v => console.count(site.name)),
                  );
                  const chart$ = dataSource.deviceDataFn(device.key, 15).pipe(
                    mapTimedValueToDeviceTimeSereies(device, index),
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
                    shareReplay(1),
                    // tap(v => console.count(site.name)),
                  );
                  const emiter = (value) => dataSource.deviceDataNextFn(device.key, value);
                  // if (!device.isActor) setInterval(
                  //   () => emiter(Math.random() * (device.max - device.min) + device.min),
                  //   1000,
                  // );
                  return {
                    ...device,
                    value$,
                    chart$,
                    emiter,
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
        );
      }),
      publishReplay(1),
      refCount(),
      // tap(v => console.log('[main]', v)),
    );
  }

  @cachedFn()
  getAuthSite(key: string): Observable<Site> {
    // console.log('getAuthSite', key);
    if (key === 'fake') {
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
          `${ROOT_DATA.sites}/${key}/`,
        ).valueChanges().pipe(
          catchError(error => {
            // if AuthZ error on read
            console.error(error);
            // take first user's site
            return this.angularFireDatabase.list<string>(
              `${ROOT_DATA.userSites}/${user.authUser.uid}`,
              ref => ref.limitToFirst(1),
            ).valueChanges().pipe(
              take(1),
              switchMap(sitesKeys => {
                if (!sitesKeys || sitesKeys.length === 0 || sitesKeys[0].length === 0) {
                  // user has zero AuthZ sites
                  return of(FAKE_SITE.site);
                }
                return this.angularFireDatabase.object<Site>(
                  `${ROOT_DATA.sites}/${sitesKeys[0]}/`,
                ).valueChanges();
              }),
            );
          }),
        );
      }),
    );
  }

  @cachedFn()
  getEditableSite(key: string): Observable<EditableSite> {
    const dataSource = this.getDataSource(key);
    return this.getAuthSite(key).pipe(
      filter(site => !!site),
      switchMap(
        (site: Site) => combineLatest(
          this.getSitesUsers(),
          combineLatest(Object.keys(site.devices || {}).map(deviceKey => dataSource.deviceFn(deviceKey))),
        ).pipe(
          map(([sitesUsers, devicesArray]) => {
            return {
              ...site,
              devicesArray,
              usersArray: (sitesUsers[site.key] || {userList: []}).userList,
            };
          }),
        ),
      ),
    );
  }

  @cachedFn()
  getSitesUsers(): Observable<SitesUsers> {
    return combineLatest(
      this.angularFireDatabase.object<UserSites>(`${ROOT_DATA.userSites}`).valueChanges(),
      this.angularFireDatabase.list<StoredUser>(`${ROOT_DATA.users}`).valueChanges(),
    ).pipe(
      map(([userSites, storedUsers]) => {
        const siteUsers = Object.keys(userSites);
        const sitesEntries = Object.values(userSites);
        const sitesUsers: SitesUsers = <SitesUsers>{};
        for (let index = 0; index < sitesEntries.length; index++) {
          const siteEntry = sitesEntries[index];
          for (const siteKey of Object.keys(siteEntry)) {
            if (!sitesUsers[siteKey]) {
              sitesUsers[siteKey] = { siteKey, userList: [], userKeyList: [] };
            }
            const userKey = siteUsers[index];
            sitesUsers[siteKey].userKeyList.push(userKey);
            sitesUsers[siteKey].userList.push(storedUsers.find(user => user.uid === userKey));
          }
        }
        return sitesUsers;
      }),
      shareReplay(1),
    );
  }

  getAllDevices(): Observable<Device[]> {
    return this.angularFireDatabase.list<Device>(`${ROOT_DATA.devices}`).valueChanges();
  }

  async addDeviceToSite(site: Site, device: Device) {
    try {
      await this.angularFireDatabase.object(`${ROOT_DATA.sites}/${site.key}/devices/${device.key}`).set(device.key);
      this.toastService.showToast('Dispositivo adicionado', 'Sucesso', NbToastStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Não foi possível adicionar o dispositivo', 'Erro', NbToastStatus.DANGER);
    }
  }
  async removeDeviceFromSite(site: Site, device: Device) {
    try {
      await this.angularFireDatabase.object(`${ROOT_DATA.sites}/${site.key}/devices/${device.key}`).remove();
      this.toastService.showToast('Dispositivo removido', 'Sucesso', NbToastStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Não foi possível remover o dispositivo', 'Erro', NbToastStatus.DANGER);
    }
  }

  async addUserToSite(site: Site, user: StoredUser) {
    try {
      await this.angularFireDatabase.object(`${ROOT_DATA.userSites}/${user.uid}/${site.key}`).set(site.key);
      this.toastService.showToast('Usuário adicionado', 'Sucesso', NbToastStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Não foi possível adicionar o Usuário', 'Erro', NbToastStatus.DANGER);
    }
  }
  async removeUserFromSite(site: Site, user: StoredUser) {
    try {
      await this.angularFireDatabase.object(`${ROOT_DATA.userSites}/${user.uid}/${site.key}`).remove();
      this.toastService.showToast('Usuário removido', 'Sucesso', NbToastStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Não foi possível remover o Usuário', 'Erro', NbToastStatus.DANGER);
    }
  }

  async createsite(site: Site, users: StoredUser[], devices: Device[]): Promise<void> {
    try {
      const key = oneSixSixBits();
      site = {
        key,
        name: site.name || 'Site ' + key,
        devices: (devices || []).reduce((acc, device) => {
          acc[device.key] = device.key;
          return acc;
        }, {}),
      };
      await this.angularFireDatabase.object<Site>(`${ROOT_DATA.sites}/${key}`).set(site);
      this.toastService.showToast('Novo site criado com sucesso', 'Sucesso', NbToastStatus.SUCCESS);
      for (const user of (users || [])) {
        this.addUserToSite(site, user);
      }
      this.router.navigate(['dashboard', 'edit', key]);
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Não foi possível criar o Novo Site', 'Erro', NbToastStatus.DANGER);
    }
  }
  async updateSite(site: Site, users: StoredUser[], devices: Device[]): Promise<void> {
    try {
      site = {
        key: site.key,
        name: site.name || 'Site ' + site.key,
        devices: (devices || []).reduce((acc, device) => {
          acc[device.key] = device.key;
          return acc;
        }, {}),
      };
      await this.angularFireDatabase.object<Site>(`${ROOT_DATA.sites}/${site.key}`).update(site);
      for (const user of (users || [])) {
        this.addUserToSite(site, user);
      }
      this.toastService.showToast('Cadastro Atualizado.', 'Sucesso', NbToastStatus.SUCCESS);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      this.toastService.showToast('Erro ao atualizar cadastro.', 'Erro', NbToastStatus.DANGER);
      return Promise.reject(error);
    }
  }
}

@Injectable()
export class DashboardIdGuard implements CanActivate {
  constructor(
    protected dashboardService: DashboardService,
    protected router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const siteKey = next.params.id;
    // console.log('[canActivate]', {key, comp: next.component});
    return this.dashboardService.getAuthSite(siteKey).pipe(
      take(1),
      map(site => {
        if (!site) {
          throw new Error('No Site Resolved');
        }
        if (site.key === siteKey) {
          return true;
        }
        return this.router.parseUrl(`/dashboard/${site.key}`);
      }),
      catchError(error => {
        console.error(error);
        return of(this.router.parseUrl(`/`));
      }),
    );
  }
}
