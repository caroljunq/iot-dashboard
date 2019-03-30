
import { Observable } from 'rxjs';
export interface StoredUser {
  uid: string;
  isActive: boolean;
  isAdmin: boolean;
  name?: string;
  // google auth
  displayName: string;
  photoURL?: string;
  // email auth
  email?: string;
  // internal
  isCurrentUser?: boolean;
  color?: string;
}

export interface TimedValue<T> {
  key?: string;
  value: T;
  timestamp: number;
}
export interface Device {
  key?: string;
  name: string;
  isActor: boolean;
  // ------ ACTOR -------
  iconClass?: string;
  // ------ SENSOR -------
  // Umidade: 20 - 80
  // Temperatura: 15 - 25
  type?: string | 'Temperatura' | 'Umidade';
  unit?: string | 'ºC' | '%';
  max?: number | 0;
  min?: number | 0;
  active?: boolean | true,
  // ------ INTERNAL -------
  value$?: Observable<TimedValue<number>>;
  emiter?: (number) => any;
  aggregate$?: Observable<TimedAggregate>;
  chart$?: Observable<any>;
}
export interface Site {
  key: string;
  name: string;
  devices: {[sensorId: string]: string};
  actors: {[sensorId: string]: string};
}

export interface RootData {
  devices: {[key: string]: Device};
  sites: {[key: string]: Site};
  sensorData: {[deviceKey: string]: {[key: string]: TimedValue<number>}};
  actorData: {[deviceKey: string]: {[key: string]: TimedValue<boolean>}};
  users: {[key: string]: StoredUser};
  userSites: {[userUid: string]: {[siteKey: string]: string}};
}

export interface TimedAggregate {
  key: string;
  min: number;
  max: number;
  avg: number;
  stdDev: number;
  startTimeStamp: number;
  endTimeStamp: number;
}
